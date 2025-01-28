import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class UserController {



  async registerUser(req, res) {
    try {
      console.log(req.body);

      const password = req.body.password;
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      const user = await prisma.user.create({
        data: {
          fullName: req.body.fullName,
          email: req.body.email,
          password: hash,
        },
      })

      const token = jwt.sign(
        { userId: user.id },
        'secret123',
        { expiresIn: '30d' }
      )

      res.json({ ...user, token })
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Ошибка при регистрации' })
    }

  }

  async loginUser(req, res) {
    try {
      const user = await prisma.user.findFirst({
        where: { email: req.body.email },
      })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const isValidatePassword = await bcrypt.compare(req.body.password, user.password)

      if (!isValidatePassword) {
        return res.status(400).json({ message: 'Неверный пароль' })
      }


      const token = jwt.sign(
        { userId: user.id },
        'secret123',
        { expiresIn: '30d' }
      )


      res.json({ ...user, token })



    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Ошибка при авторизации' })
    }
  }

  async authUser(req, res) {
    try {

      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }


      res.json(user)
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Ошибка при запросе пользователя' })
    }
  }

}

export default new UserController()