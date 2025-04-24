import { useRef, useEffect, useState } from "react";
import "./AutocompletePlaces.css";
import { MdOutlineMyLocation } from "react-icons/md";
import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";
import useGoogleMapsApi from "helpers/useGoogleMapsApi";
import { helpers } from "helpers";

const AutoCompletePlaces = ({
  onPlaceChanged,
  initialCity = '',
  label,
  showGetUserLocation = false,
  useFullAddress = false,
  ...props
}) => {
  const [textValue, setTextValue] = useState(
    typeof initialCity === "string" ? initialCity : initialCity.location || ""
  );
  const [lastCity, setLastCity] = useState(textValue);
  const mapApi = useGoogleMapsApi();

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location", "formatted_address", "address_components"],
    types: useFullAddress ? ["geocode"] : ["(cities)"],
  };

  useEffect(() => {
    if (!mapApi) return;

    function callback(place) {
      if (!place.geometry || !place.address_components) return;

      const location = place.geometry.location;
      const fullAddress = place.formatted_address;
      let city = "";
      let state = "";
      let zip = "";
      // const location = place.geometry.location;
      // const city = place.address_components.find(c => c.types.includes("locality"))?.long_name || "";
      // const state = place.address_components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";
      place.address_components.forEach((component) => {
        if (component.types.includes("locality")) city = component.long_name;
        if (component.types.includes("administrative_area_level_1")) state = component.short_name;
        if (component.types.includes("postal_code")) zip = component.long_name;
      });
      //const formattedAddress = `${city}, ${state}`;
      const formattedAddress = useFullAddress ? fullAddress : `${city}, ${state}`;
      setTextValue(formattedAddress);
      setLastCity(formattedAddress);

      if (onPlaceChanged && typeof onPlaceChanged === "function") {
        onPlaceChanged({
          location: formattedAddress,
          city_name: helpers.extractCityFromPlace(place),
          lat: location.lat(),
          lng: location.lng(),
          zip: zip
        }, place);
      }
    }

    function setAutoCompleteRef() {
      if (!mapApi.places) {
        console.error("Google Maps Places API is not available.");
        return;
      }

      autoCompleteRef.current = new mapApi.places.Autocomplete(inputRef.current, options);
      autoCompleteRef.current.addListener("place_changed", async function () {
        const place = await autoCompleteRef.current.getPlace();
        callback(place);
      });
    }

    setAutoCompleteRef();

    if (typeof initialCity === "object" && initialCity.lat && initialCity.lng) {
      const geocoder = new mapApi.Geocoder();
      const latLng = new mapApi.LatLng(initialCity.lat, initialCity.lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          const addressComponents = results[0].address_components;
          const city = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
          const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";
          const formattedAddress = `${city}, ${state}`;

          setTextValue(formattedAddress);
          setLastCity(formattedAddress);

          if (onPlaceChanged) {
            onPlaceChanged({
              location: formattedAddress,
              city_name: helpers.extractCityFromPlace(results[0]),
              lat: initialCity.lat,
              lng: initialCity.lng,
            });
          }
        } else {
          console.error("Geocoder failed:", status);
        }
      });
    }

    return () => {
      if (autoCompleteRef.current) {
        autoCompleteRef.current = null;
      }
    };
  }, [mapApi, initialCity]);

  // Allow external updates (e.g., when marker is moved)
  useEffect(() => {
    if (typeof initialCity === "string" && initialCity !== textValue) {
      setTextValue(initialCity);
    }
  }, [initialCity]);

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
            const city = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
            const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "";
            const formattedAddress = `${city}, ${state}`;

            setTextValue(formattedAddress);
            setLastCity(formattedAddress);

            if (onPlaceChanged && typeof onPlaceChanged === "function") {
              onPlaceChanged({
                location: formattedAddress,
                city_name: helpers.extractCityFromPlace(results[0]),
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
      <Grid size={showGetUserLocation ? 11 : 12}>
        <TextField
          autoComplete="off"
          data-lpignore="true"
          slotProps={{
            input: { autoComplete: "off", "data-lpignore": true } // Prevent LastPass from filling this field
          }}
          inputRef={inputRef}
          type="text"
          required={props.required}
          error={props.error}
          helperText={props.helperText}
          name='location'
          fullWidth
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={() => {
            if (textValue.trim() !== '') {
              setTextValue(lastCity);
            }
          }}
          label={label || 'Location'}
          value={textValue}
        />
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
  );
};

export default AutoCompletePlaces;
