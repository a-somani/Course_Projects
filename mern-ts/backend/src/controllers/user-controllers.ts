const { validationResult } = require("express-validator")
import { NextFunction, Request, Response } from "express"
import bcrypt, { hash } from "bcryptjs"
import jwt from "jsonwebtoken"
import { HttpError } from "../models/http-error"
const User = require("../models/user")

type user = {
  id?: string
  name: string
  email: string
  password: string
  image?: string
  places: any
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  let users
  try {
    users = await User.find({}, "-password")
  } catch (error) {
    return next(new HttpError(500, "Error fetching users from DB"))
  }

  res.json({
    users: users.map((user: any) => user.toObject({ getters: true })),
  })
}

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError(422, "Invalid inputs were entered: "))
  }

  const { name, email, password } = req.body as user

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (error) {
    return next(new HttpError(500, "Error finding user in DB"))
  }
  if (existingUser) {
    return next(new HttpError(422, "User with that email exists already"))
  }

  let hashedPassword
  try {
    await bcrypt.hash(password, 12)
  } catch (error) {
    return next(new HttpError(500, "Error hashing password"))
  }

  const newUser = new User({
    name,
    email,
    image: req.file!.path,
    password: hashedPassword,
    places: [],
  })

  try {
    await newUser.save()
  } catch (error) {
    return next(new HttpError(500, "Error adding new user to DB"))
  }

  let token
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_PRIVATE_KEY as string,
      { expiresIn: "1h" }
    )
  } catch (error) {
    return next(new HttpError(500, "Error creating token for new user"))
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token })
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  let identifiedUser
  try {
    identifiedUser = await User.findOne({ email: email })
  } catch (error) {
    return next(new HttpError(500, "Error finding user in DB"))
  }
  if (identifiedUser) {
    return next(new HttpError(422, "User with that email exists already"))
  }

  if (!identifiedUser) {
    return next(
      new HttpError(403, "Incorrect email/password or account does not exist")
    )
  }

  let isValidPassword
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password)
  } catch (error) {
    return next(new HttpError(500, "Error verifying password"))
  }
  if (!isValidPassword) return next(new HttpError(403, "Invalid password"))

  let token
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      process.env.JWT_PRIVATE_KEY as string,
      { expiresIn: "1h" }
    )
  } catch (error) {
    return next(new HttpError(500, "Error creating token for new user"))
  }

  res.status(201).json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
