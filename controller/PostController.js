import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class PostController {
  async getAll(req, res) {
    const data = await prisma.post.findMany({
      include: {
        author: true
      },
      // orderBy: {
      //   createdAt: 'desc'
      // }
    })
    res.json(data.reverse())
  }

  async create(req, res) {
    try {
      console.log(req.body)
      const data = await prisma.post.create({
        data: {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          authorId: req.userId
        }
      })
      res.json(data)

    } catch (err) {
      console.log(err)
      res.status(400).json({ message: 'Ошибка при создании поста' })
    }
  }



  async getOne(req, res) {
    const postId = req.params.id;
    const data = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: {
        author: true
      }
    })
    res.json(data)
  }
  async update(req, res) {
    const postId = req.params.id;
    const data = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        title: req.body.title,
        text: req.body.text
      }
    })
    res.json(data)

  }
  async delete(req, res) {
    const postId = req.params.id;
    const data = await prisma.post.delete({
      where: { id: Number(postId) }
    })
    res.json(data)
  }
}

export default new PostController()