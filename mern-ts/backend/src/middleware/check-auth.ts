import { NextFunction, Request, Response } from "express"
import { HttpError } from "../models/http-error"
import jwt from "jsonwebtoken"

interface authRequest extends Request {
  userData?: {
    userId: string
  }
}

const authChecker = (req: authRequest, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") return next()

  let token
  try {
    token = req.headers.authorization?.split(" ")[1]
    if (!token) throw new Error("Authentication failed")
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY as string
    ) as {
      userId: string
    }

    req.userData = { userId: decodedToken.userId }
    next()
  } catch (error) {
    return next(new HttpError(403, "Authentication failed"))
  }
}

export default authChecker
