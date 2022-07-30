const express = require("express")
const { check } = require("express-validator")
const fileUploader = require("../middleware/file-upload")

const userController = require("../controllers/user-controllers")

const router = express.Router()

router.get("/", userController.getUsers)

router.post(
  "/signup",
  fileUploader.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  userController.signup
)

router.post("/login", userController.login)

module.exports = router
