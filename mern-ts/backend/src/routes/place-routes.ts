import express from "express"
import authChecker from "../middleware/check-auth"
const router = express.Router()
const { check } = require("express-validator")
import { HttpError } from "../models/http-error"
const fileUploader = require("../middleware/file-upload")
const placesControllers = require("../controllers/place-controllers")

router.get("/:pid", placesControllers.getPlaceById)

router.get("/user/:uid", placesControllers.getPlacesByUserId)

router.use(authChecker)

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
)

router.post(
  "/",
  fileUploader.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
)

router.delete("/:pid", placesControllers.deletePlace)

module.exports = router
