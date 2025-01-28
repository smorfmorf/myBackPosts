import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Неверный токен' })
  }

  try {
    const decoded = jwt.verify(token, 'secret123')
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'не получилось расшифровать' })
  }


}