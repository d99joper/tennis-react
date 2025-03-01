import { useRef, useEffect, useState } from "react"
import "./AutocompletePlaces.css"
import { MdOutlineMyLocation } from "react-icons/md"
import Grid from "@mui/material/Grid2"
import { TextField } from "@mui/material"
import useGoogleMapsApi from "helpers/useGoogleMapsApi"

const AutoCompletePlaces = ({ onPlaceChanged, initialCity = '', label, showGetUserLocation = false, hasError, ...props }) => {

  const [textValue, setTextValue] = useState(initialCity);
  const [lastCity, setLastCity] = useState(initialCity);
  const mapApi = useGoogleMapsApi();

  const autoCompleteRef = useRef()
  const inputRef = useRef()
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location", "name", "formatted_address", "url"], //"address_components",
    types: ['(cities)'],
  }

  useEffect(() => {
    if (!mapApi) return; // Ensure Google Maps API is loaded before using it.

    function callback(place) {
      const location = place.geometry ? place.geometry.location : null;
      const address = place.formatted_address || inputRef.current.value;

      setTextValue(address);
      setLastCity(address);

      if (onPlaceChanged && typeof onPlaceChanged === "function") {
        onPlaceChanged({
          location: address,
          lat: location ? location.lat() : null,
          lng: location ? location.lng() : null,
        });
      }
    }

    function setAutoCompleteRef() {
      if (!mapApi.places) {
        console.error("Google Maps Places API is not available.");
        return;
      }

      autoCompleteRef.current = new mapApi.places.Autocomplete(
        inputRef.current,
        options
      );

      autoCompleteRef.current.addListener("place_changed", async function () {
        const place = await autoCompleteRef.current.getPlace();
        callback(place);
      });
    }

    setAutoCompleteRef();

    const inputElement = inputRef.current;
    inputElement.addEventListener("input", removeCity);

    function removeCity(e) {
      if (e.target.value.length === 0) {
        callback({ location: "", lat: null, lng: null });
      }
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("input", removeCity);
      }
    };
  }, [mapApi, initialCity]); // ✅ Depend on `mapApi` so it runs only when API is available.


  function getUserCity() {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        if (!mapApi) {
          console.error("Google Maps API is not loaded yet.");
          return;
        }

        const geocoder = new mapApi.Geocoder();
        const latLng = new mapApi.LatLng(position.coords.latitude, position.coords.longitude);

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results[0]) {
            const addressComponents = results[0].address_components;
            const city = addressComponents.find((c) => c.types.includes("locality"));
            const state = addressComponents.find((c) => c.types.includes("administrative_area_level_1"));
            const country = addressComponents.find((c) => c.types.includes("country"));
            const displayName = `${city?.long_name ?? ""}, ${state?.short_name ?? ""}, ${country?.short_name ?? ""}`;

            setTextValue(displayName);

            if (onPlaceChanged && typeof onPlaceChanged === "function") {
              onPlaceChanged({
                location: displayName,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            }
          } else {
            console.error("Geocoder failed:", status);
          }
        });
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
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

