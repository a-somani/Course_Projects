import { HttpError } from "../models/http-error"

const axios = require("axios")
const API_KEY = process.env.GOOGLE_API_KEY

const getCoordinates = async (address: string) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?new_forward_geocoder=true&address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  )

  const data = response.data

  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError(422, "Could not find a location for that address")
  }

  const coordinates = data.results[0].geometry.location
}

export default getCoordinates
