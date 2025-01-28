import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


import UserController from './controller/UserController.js';
import PostController from './controller/PostController.js';
import { registerValidator, loginValidator } from './middleware/validatorExpress.js'
import handleValidateErrors from './middleware/handleValidateErrors.js'
import { checkAuth } from './middleware/checkAuth.js';


dotenv.config()
const PORT = process.env.PORT || 5555;

const app = express();
app.use(cors());
app.use(express.json())
// app.use('/api', router)

app.use('/uploads', express.static('uploads'));

123
async function start() {


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads') // указываем папку для сохранения файлов
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // указываем имя файлу, которое будет сохранено на сервере
    }
  })

  const upload = multer({ storage: storage })

  app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`
    })
  })




  app.get('/', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка при подключении к базе данных' });
    }
  });



  // app.get('/', (req, res, next) => {
  //   console.log('ModdleWare ok]')
  //   next()
  // }, (req, res) => {
  //   res.send('Hello World!');
  // });

  //* Авторизация
  app.post('/api/register', registerValidator, handleValidateErrors, UserController.registerUser)
  app.post('/api/login', loginValidator, handleValidateErrors, UserController.loginUser)
  app.get('/api/auth', checkAuth, UserController.authUser) // проверка авторизации
  app.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
  })

  //! Посты

  // создание поста 
  app.post('/api/posts', checkAuth, PostController.create)
  //получение всех постов 
  app.get('/api/posts', PostController.getAll)

  //получение конкретного поста
  app.get('/api/posts/:id', PostController.getOne)

  //обновление поста
  app.patch('/api/posts/:id', checkAuth, PostController.update)
  //удаление поста
  app.delete('/api/posts/:id', PostController.delete)





  app.listen(PORT, () => {
    console.log('http://localhost:5555')
  });
}


start()