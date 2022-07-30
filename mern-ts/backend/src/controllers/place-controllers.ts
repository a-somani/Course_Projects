import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import getCoordinates from "../util/location"
import mongoose from "mongoose"
import fs from "fs"

import { HttpError } from "../models/http-error"
const Place = require("../models/place")
const User = require("../models/user")

type place = {
  title: string
  description: string
  imageUrl?: string
  address: string
  coordinates: google.maps.LatLngLiteral
  creator: string
}

interface authRequest extends Request {
  userData?: {
    userId: string
  }
}

const getPlaceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const placeId = req.params.pid
  let place
  try {
    place = await Place.findById(placeId)
  } catch (error) {
    return next(new HttpError(500, "Error finding place in DB"))
  }

  if (!place) {
    return next(new HttpError(404, "Could not find place"))
  }

  res.json({ message: "it works", place: place.toObject({ getters: true }) })
}

const getPlacesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.uid

  let userWithPlaces
  try {
    userWithPlaces = await User.findById(userId).populate("places")
  } catch (error) {
    return next(new HttpError(500, "Error finding places in DB"))
  }
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError(404, "Could not any find places"))
  }

  res.json({
    places: userWithPlaces.places.map((place: any) =>
      place.toObject({ getters: true })
    ),
  })
}

const createPlace = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError(422, "Invalid inputs were entered"))
  }

  const { title, description, address } = req.body as place
  let coordinates: google.maps.LatLngLiteral
  try {
    coordinates = (await getCoordinates(address))!
  } catch (error) {
    return next(error)
  }

  const newPlace = new Place({
    title,
    description,
    coordinates,
    address,
    creator: req.userData!.userId,
    imageUrl: req.file!.path,
  })

  let identifiedUser
  try {
    identifiedUser = await User.findById(req.userData!.userId)
  } catch (error) {
    return next(new HttpError(500, "Error finding user in DB"))
  }
  if (!identifiedUser) {
    return next(new HttpError(422, "User does not exist"))
  }

  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await newPlace.save({ session })
    identifiedUser.places.push(createPlace)
    await identifiedUser.save({ session })
    session.commitTransaction()
    res.status(201).json({ place: newPlace.toObject({ getters: true }) })
  } catch (error) {
    return next(
      new HttpError(
        500,
        "Error adding new place to places and user.places in the DB"
      )
    )
  }
}

const updatePlace = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError(422, "Invalid inputs were entered"))
  }

  const placeId = req.params.pid
  const { title, description } = req.body as place

  let place
  try {
    place = await Place.findById(placeId)
  } catch (error) {
    return next(new HttpError(500, "Error finding place in DB"))
  }

  if (!place) {
    return next(new HttpError(404, "Could not find place"))
  }

  if (place.creator.toString() !== req.userData!.userId)
    return next(new HttpError(401, "Unauthorized"))

  place.title = title
  place.description = description

  try {
    await place.save()
  } catch (error) {
    return next(new HttpError(500, "Error finding place in DB"))
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (
  req: authRequest,
  res: Response,
  next: NextFunction
) => {
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId).populate("creator")
  } catch (error) {
    return next(new HttpError(500, "Error finding place in DB"))
  }
  if (!place) {
    return next(new HttpError(404, "Could not find place"))
  }

  const imagePath = place.image
  fs.unlink(imagePath, (err) => {
    console.log(err)
  })

  if (place.creator.id !== req.userData!.userId)
    return next(new HttpError(401, "Unauthorized"))

  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await place.remove({ session })
    await place.creator.places.pull(place)
    await place.creator.save({ session })
    await session.commitTransaction()
  } catch (error) {
    return next(new HttpError(500, "Error deleting place in DB"))
  }

  res.status(200).json({ message: "Deleted place" })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
