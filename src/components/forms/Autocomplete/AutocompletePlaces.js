import { useRef, useEffect, useState } from "react"
import "./AutocompletePlaces.css"
import { helpers } from "helpers"
import { MdOutlineMyLocation } from "react-icons/md"
import Grid from "@mui/material/Grid2"
import { TextField } from "@mui/material"

const AutoCompletePlaces = ({ onPlaceChanged, initialCity = '', label, showGetUserLocation = false, hasError, ...props }) => {

  const [textValue, setTextValue] = useState(initialCity);
  const [lastCity, setLastCity] = useState(initialCity);

  const autoCompleteRef = useRef()
  const inputRef = useRef()
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location", "name", "formatted_address", "url"], //"address_components",
    types: ['(cities)'],
  }
  let mapsApi

  useEffect(() => {

    function callback(place) {
      const location = place.geometry ? place.geometry.location : null;
      const address = place.formatted_address || inputRef.current.value; // Get the address or fallback to the typed-in value


      setTextValue(address); // Update the textValue with the selected address
      setLastCity(address);

      if (onPlaceChanged && typeof onPlaceChanged === 'function') {
        onPlaceChanged({
          location: address,
          lat: location ? location.lat() : null,
          lng: location ? location.lng() : null,
        });
      }
    }

    async function setAutoCompleteRef() {
      mapsApi = await helpers.loadGoogleMapsAPI()

      autoCompleteRef.current = new mapsApi.places.Autocomplete(
        inputRef.current,
        options
      )

      autoCompleteRef.current.addListener("place_changed", async function () {
        const place = await autoCompleteRef.current.getPlace()
        //console.log(place)
        callback(place)
      })
    }

    setAutoCompleteRef()

    const inputElement = inputRef.current

    const removeCity = (e) => {
      if (e.target.value.length === 0) {
        console.log('removeCity')
        callback({ location: '', lat: {}, lng: {} })
      }
    }
    inputElement.addEventListener("input", removeCity)

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('input', removeCity);
      }
    };

  }, [initialCity])

  function getUserCity() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          function getDisplayName(placesApi) {
            const geocoder = new placesApi.Geocoder()
            // make a map with the user's coordiated
            const latLng = new placesApi.LatLng(position.coords.latitude, position.coords.longitude)
            // geocode the location and parse out the City, State, Country
            geocoder.geocode({
              location: latLng
            }, (results, status) => {
              if (status === "OK") {
                if (results[0]) {
                  const addressComponents = results[0].address_components
                  const city = addressComponents.find(component => component.types.includes('locality'))
                  const state = addressComponents.find(component => component.types.includes('administrative_area_level_1'))
                  const country = addressComponents.find(component => component.types.includes('country'))
                  const displayName = `${city?.long_name ?? ''}, ${state?.short_name ?? ''}, ${country?.short_name ?? ''}`
                  // set the city as the initial city, which is passed to the autocomplete component
                  //inputRef.current.value = displayName
                  setTextValue(displayName);
                  if (onPlaceChanged && typeof onPlaceChanged === 'function')
                    onPlaceChanged({ location: displayName, lat: position.coords.latitude, lng: position.coords.longitude })
                } else {
                  console.log("No results found.")
                }
              } else {
                console.error(`Geocoder failed due to: ${status}`)
              }
            })
          }

          let city
          if (mapsApi) {
            city = getDisplayName(mapsApi)
          }
          else {
            helpers.loadGoogleMapsAPI().then((map) => {
              city = getDisplayName(map)
            })
          }
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
  }

  return (
    <Grid container spacing={1} alignItems={'center'}>
      <Grid size={showGetUserLocation ? 11 : 12}> {/* Adjust xs value as needed */}
        {/* <div className={`outlined-input`}> */}
        <TextField
          inputRef={inputRef}
          type="text"
          required={props.required}
          error={props.error}
          helperText={[props.helperText]}
          name='location'
          fullWidth
          onChange={(e) => {
            setTextValue(e.target.value)
          }}
          onBlur={() => {
            if (textValue.trim() !== '') {
              console.log('onBlur: Restoring last city', lastCity);
              setTextValue(lastCity);
            }
          }}
          label={label || 'Location'}
          value={textValue}
        //onChange={() => {console.log('change', inputRef.current.value)}}
        />
        {/* <label htmlFor="location">{label ?? ''}</label>
        </div> */}

      </Grid>
      {showGetUserLocation && (
        <Grid size={1}>
          <MdOutlineMyLocation
            className="cursorHand"
            color={'#66f'}
            size={24}
            onClick={getUserCity}
          />
        </Grid>
      )}
    </Grid>
  )
}
export default AutoCompletePlaces

