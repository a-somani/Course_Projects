import { Request } from "express"
import multer, { FileFilterCallback } from "multer"
const { uuid } = require("uuidv4")

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

type fileTypeKey = "/image/png" | "/image/jpeg" | "/image/jpg"

const MIME_TYPE_MAP = {
  "/image/png": "png",
  "/image/jpeg": "jpeg",
  "/image/jpg": "jpg",
}

const fileUpload = multer({
  limits: { fieldSize: 1000000 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype as fileTypeKey]
    let error = isValid ? null : new Error("Invalid mime type")
    cb(error as null, isValid)
  },
  storage: multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      cb(null, "uploads/images")
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      const ext = MIME_TYPE_MAP[file.mimetype as fileTypeKey]
      cb(null, uuid() + "." + ext)
    },
  }),
})

module.exports = fileUpload
