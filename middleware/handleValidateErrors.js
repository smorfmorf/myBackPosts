import { validationResult } from 'express-validator'

export default (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Сработал express-validator Ошибка!!!');
    return res.status(400).json({ errors: errors.array() })
  }
  // если нет ошибок дальше
  next()
}