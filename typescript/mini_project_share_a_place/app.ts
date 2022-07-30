import axios from "axios"
const form = document.querySelector("form")!
const addressInput = document.getElementById("address")! as HTMLInputElement

const GOOGLE_API_KEY = "abcdef..."

function searchAddressHandler(e: Event) {
  e.preventDefault()
  const enteredAddress = addressInput.value

  type googleGeoResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[]
    status: "OK" | "ZERO_RESULTS"
  }

  //send address to google's API
  axios
    .get<googleGeoResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status === "OK") {
        const coordinates = response.data.results[0].geometry.location
        const map = new google.maps.Map(document.getElementById("map")!, {
          center: coordinates,
          zoom: 10,
        })
        new google.maps.Marker({ position: coordinates, map: map })
      } else {
        throw new Error("could not fetch location!")
      }
    })
    .catch((e: Error) => {
      console.log(e)
    })
}

form.addEventListener("submit", searchAddressHandler)
