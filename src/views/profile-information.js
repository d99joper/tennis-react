import { Flex } from "@aws-amplify/ui-react"
import "./profile.css"
import { useEffect, useState } from "react"
import loadGoogleMapsScript from "api/mapsApi"
import { AutoCompletePlaces } from "components/forms"

function ProfileInfo({ ...props }) {
  const [initialCity, setInitialCity] = useState('')
  const [city, setCity] = useState('')
  const [scriptIsLoaded, setScriptIsLoaded] = useState(false)
  /** Collect information like firstName, lastName, location, utr, ntrp */

  useEffect(() => {
    loadGoogleMapsScript(getUserLocation)

    async function getUserLocation() {
      setScriptIsLoaded(true)
      function getCurrentPosition() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error)
          )
        })
      }
      if (navigator.geolocation) {
        // get the position
        const position = await getCurrentPosition()
        const myLngLat = { lat: position.coords.latitude, lng: position.coords.longitude }
        // create a geocoder
        const geocoder = new window.google.maps.Geocoder()
        // make a map with the user's coordiated
        const latLng = new window.google.maps.LatLng(myLngLat.lat, myLngLat.lng);
        // geocode the location and parse out the City, State, Country
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              const addressComponents = results[0].address_components
              const city = addressComponents.find(component => component.types.includes('locality'))
              const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'))
              const country = addressComponents.find(component => component.types.includes('country'))
              const displayName = `${city.long_name}, ${state.short_name}, ${country.short_name}`
              // set the city as the initial city, which is passed to the autocomplete component
              setInitialCity(displayName)
            } else {
              console.log("No results found.")
            }
          } else {
            console.error(`Geocoder failed due to: ${status}`)
          }
        })
      }
    }
  }, [])

  return (
    <Flex className="double-grid">
      First name:
      <input name="firstname" placeholder='First name' />
      Last name:
      <input name="lastname" placeholder='Last name' />
      <AutoCompletePlaces onPlaceChanged={(point) => setCity(point)} initialCity={initialCity} scriptIsLoaded={scriptIsLoaded} />
    </Flex>
  )

}

export default ProfileInfo