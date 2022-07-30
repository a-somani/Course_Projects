import express from "express"
import bodyParser from "body-parser"
import { NextFunction, Request, Response } from "express"
import mongoose, { mongo } from "mongoose"
import { HttpError } from "./models/http-error"
const placeRoutes = require("./routes/place-routes")
const userRoutes = require("./routes/user-routes")
import fs from "fs"
import path from "path"

const app = express()

app.use(bodyParser.json())

app.use("/uploads/images", express.static(path.join("uploads", "images")))

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")

  next()
})

app.use("/api/places", placeRoutes)
app.use("/api/users", userRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
  throw new HttpError(404, "Could not find this route")
})

app.use(
  "/",
  (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (req.file)
      fs.unlink(req.file.path, (err) => {
        console.log(err)
      })

    if (res.headersSent) {
      return next(error)
    }

    res.status(error.code || 500)
    res.json({
      message: error.message || "An unknown error occurred!",
    })
  }
)

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicecluster0.3joea.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000)
    console.log("DB name: " + process.env.DB_NAME)
  })
  .catch()
