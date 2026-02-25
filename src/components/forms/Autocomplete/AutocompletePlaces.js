import { useRef, useEffect, useState } from "react";
import "./AutocompletePlaces.css";
import { MdOutlineMyLocation } from "react-icons/md";
import { FormHelperText, Grid } from "@mui/material";
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
  const mapApi = useGoogleMapsApi();
  const containerRef = useRef(null);
  const autocompleteElementRef = useRef(null);
  // Track last confirmed place text so getUserCity can update the element
  const [lastCity, setLastCity] = useState(
    typeof initialCity === "string" ? initialCity : initialCity?.location || ""
  );

  useEffect(() => {
    if (!mapApi || !containerRef.current) return;
    if (!mapApi.places?.PlaceAutocompleteElement) {
      console.error("PlaceAutocompleteElement is not available in this Maps API version.");
      return;
    }

    // Clean up any previously mounted element
    containerRef.current.innerHTML = "";

    const element = new mapApi.places.PlaceAutocompleteElement({
      componentRestrictions: { country: "us" },
      types: useFullAddress ? ["geocode"] : ["(cities)"],
    });

    // Match placeholder/label to the old TextField label
    element.setAttribute("placeholder", label || "Location");

    containerRef.current.appendChild(element);
    autocompleteElementRef.current = element;

    element.addEventListener("gmp-placeselect", async (event) => {
      const place = event.place;
      await place.fetchFields({
        fields: ["location", "formattedAddress", "addressComponents"],
      });

      let city = "", state = "", zip = "";
      place.addressComponents?.forEach((component) => {
        if (component.types.includes("locality")) city = component.longText;
        if (component.types.includes("administrative_area_level_1")) state = component.shortText;
        if (component.types.includes("postal_code")) zip = component.longText;
      });

      const formattedAddress = useFullAddress
        ? place.formattedAddress
        : `${city}, ${state}`;

      setLastCity(formattedAddress);

      if (onPlaceChanged && typeof onPlaceChanged === "function") {
        onPlaceChanged(
          {
            location: formattedAddress,
            city_name: city,
            lat: place.location.lat(),
            lng: place.location.lng(),
            zip,
          },
          place
        );
      }
    });

    // Seed the initial value if provided as a string
    const initial = typeof initialCity === "string" ? initialCity : initialCity?.location || "";
    if (initial) {
      element.value = initial;
    }

    // If initialCity is a lat/lng object, reverse-geocode it
    if (typeof initialCity === "object" && initialCity?.lat && initialCity?.lng) {
      const geocoder = new mapApi.Geocoder();
      geocoder.geocode(
        { location: { lat: initialCity.lat, lng: initialCity.lng } },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const ac = results[0].address_components;
            const c = ac.find((x) => x.types.includes("locality"))?.long_name || "";
            const s = ac.find((x) => x.types.includes("administrative_area_level_1"))?.short_name || "";
            const addr = `${c}, ${s}`;
            setLastCity(addr);
            if (autocompleteElementRef.current) {
              autocompleteElementRef.current.value = addr;
            }
            onPlaceChanged?.({
              location: addr,
              city_name: c,
              lat: initialCity.lat,
              lng: initialCity.lng,
            });
          }
        }
      );
    }

    return () => {
      autocompleteElementRef.current = null;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
    // Re-run only when mapApi loads; initialCity handled separately below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapApi]);

  // Sync initialCity string prop changes (e.g. parent resets the field)
  useEffect(() => {
    if (typeof initialCity === "string" && autocompleteElementRef.current) {
      autocompleteElementRef.current.value = initialCity;
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
        geocoder.geocode(
          {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
          (results, status) => {
            if (status === "OK" && results[0]) {
              const ac = results[0].address_components;
              const city = ac.find((c) => c.types.includes("locality"))?.long_name || "";
              const state = ac.find((c) => c.types.includes("administrative_area_level_1"))?.short_name || "";
              const formattedAddress = `${city}, ${state}`;

              setLastCity(formattedAddress);
              if (autocompleteElementRef.current) {
                autocompleteElementRef.current.value = formattedAddress;
              }

              onPlaceChanged?.({
                location: formattedAddress,
                city_name: helpers.extractCityFromPlace(results[0]),
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            }
          }
        );
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
  }

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={showGetUserLocation ? 11 : 12}>
        <div
          ref={containerRef}
          className={`gmp-autocomplete-wrapper${props.error ? " gmp-autocomplete-error" : ""}`}
          data-required={props.required ? "true" : undefined}
        />
        {props.helperText && (
          <FormHelperText error={props.error}>{props.helperText}</FormHelperText>
        )}
      </Grid>
      {showGetUserLocation && (
        <Grid size={1}>
          <MdOutlineMyLocation
            className="cursorHand"
            color={"#66f"}
            size={24}
            onClick={getUserCity}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default AutoCompletePlaces;
