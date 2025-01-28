import { body } from 'express-validator'

export const registerValidator = [
  body('email', 'неверный формат почты ').isEmail(),
  body('password', 'минимум 6 символов').isLength({ min: 6 }),
  body('fullName', 'укажите имя').isLength({ min: 3 }),
]

export const loginValidator = [
  body('email', 'неверный формат почты ').isEmail(),
  body('password', 'необходимо ввести пароль').isLength({ min: 6 }),
]