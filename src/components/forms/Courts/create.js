import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AutoCompletePlaces, ErrorHandler } from "components/forms";
import { courtAPI } from "api/services";
import useGoogleMapsApi from "helpers/useGoogleMapsApi";
import { AuthContext } from "contexts/AuthContext";
import { helpers } from "helpers";

const CreateCourt = ({ mapsApi: parentMapsApi, newItem = "", callback, ...props }) => {
  const markerRef = useRef(null);
  //const [courts, setCourts] = useState([]);
  const infoWindowRef = useRef(null);
  const [lngLat, setLngLat] = useState(null);
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState(""); // Store address
  const [name, setName] = useState(newItem);
  const [hasLights, setHasLights] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [noCourts, setNoCourts] = useState(1);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(AuthContext);
  const [infoText, setInfoText] = useState("");
  const mapRef = useRef(null);
  const [initialCity, setInitialCity] = useState(null);
  const internalMapsApi = useGoogleMapsApi();
  const mapsApi = parentMapsApi || internalMapsApi; // Use parent-provided or fallback
  const mapContainerRef = useRef(null);
  //const cachedCourtsRef = useRef(new Map()); 
  const prevBoundsRef = useRef(null);
  const zoom = 11;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInitialCity({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          if (user?.location) {
            setInitialCity(user.location);
          }
        }
      );
    } else if (user?.location) {
      setInitialCity(user.location);
    }
    else setInitialCity({ location: "Sacramento, CA", lat: 38.5816, lng: -121.4944 });
  }, [user]);

  //  Function to reverse geocode lat/lng
  const fetchPlaceDetails = (mapsApi, { lat, lng }, callback) => {
    if (!mapsApi) return;

    const geocoder = new mapsApi.Geocoder();
    console.log(`🔍 Geocoding lat: ${lat}, lng: ${lng}`);

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      console.log(`📍 Geocoder status: ${status}`);

      if (status === "OK" && results.length > 0) {
        console.log("✅ Geocoded result:", results[0]);
        callback(results[0]); // Return first result
      } else {
        console.error("❌ Geocoding failed:", status);
        callback(null);
      }
    });
  };

  useEffect(() => {
    if (!mapsApi || !mapContainerRef.current || !initialCity) return;
    if (mapRef.current) return; // Prevent multiple instances

    console.log("🗺️ Initializing Google Map...");

    // Initialize map
    mapRef.current = new mapsApi.Map(mapContainerRef.current, {
      center: { lat: initialCity.lat, lng: initialCity.lng },
      zoom: zoom,
      mapId: process.env.REACT_APP_MAP_ID,
      options: {
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        cameraControl: false,
        scaleControl: true
      }
    });

    mapRef.current.addListener("idle", () => {
      handleMapIdle();
      //fetchCourts();
    });

    // Move marker when clicking on map
    mapRef.current.addListener("click", (event) => {
      console.log("🖱️ Map clicked!", event.latLng.lat());
      const clickedLat = Number(event.latLng.lat());
      const clickedLng = Number(event.latLng.lng());
      console.log(clickedLat, clickedLng)
      setLngLat({ lat: clickedLat, lng: clickedLng });

      fetchPlaceDetails(mapsApi, { lat: clickedLat, lng: clickedLng }, (place) => {
        if (place) {
          console.log("📍 New address:", place.formatted_address);
          setAddress(place.formatted_address);
          updateCityAndZip(place);
        }
      });

      //  Move existing marker instead of creating a new one
      if (markerRef.current) {
        markerRef.current.setPosition({ lat: clickedLat, lng: clickedLng });
      } else {
        createMarker(clickedLat, clickedLng);
      }
    });

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up map...");
      if (mapRef.current) {
        mapsApi.event.clearInstanceListeners(mapRef.current);
      }
    };
  }, [mapsApi, initialCity]);

  let fetchTimeout = null;
  const handleMapIdle = async () => {
    if (!mapRef.current) return;

    if (fetchTimeout) clearTimeout(fetchTimeout)

    fetchTimeout = setTimeout(async () => {
      const bounds = mapRef.current.getBounds();
      if (!bounds) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const latMin = sw.lat();
      const lngMin = sw.lng();
      const latMax = ne.lat();
      const lngMax = ne.lng();

      // Check if the new bounds extend beyond the previous bounds
      if (
        prevBoundsRef.current &&
        latMin >= prevBoundsRef.current.latMin &&
        latMax <= prevBoundsRef.current.latMax &&
        lngMin >= prevBoundsRef.current.lngMin &&
        lngMax <= prevBoundsRef.current.lngMax
      ) {
        console.log("📌 No need to fetch - bounds are within previous max.");
        return;
      }

      console.log("🔄 Fetching new courts...");
      prevBoundsRef.current = { latMin, latMax, lngMin, lngMax };

      try {
        let filters = {}
        filters.bounds = `${latMin},${latMax},${lngMin},${lngMax}`
        const results = await courtAPI.getCourts(filters);
        console.log("Fetched courts:", results.courts);

        addCourtMarkers(results.courts);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    }, 500); //  Wait 500ms after last movement before fetching
  };

  //  Function to create a new marker
  const createMarker = (lat, lng) => {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.error("❌ Invalid lat/lng values:", lat, lng);
      return; // Prevent setting an invalid position
    }

    lat = parseFloat(lat); // Ensure lat is a number
    lng = parseFloat(lng); // Ensure lng is a number

    if (markerRef.current) {
      console.log('marker exists, move it', lat, lng)
      markerRef.current.setPosition({ lat, lng });
      return;
    }

    const newMarker = new mapsApi.Marker({
      position: { lat, lng },
      map: mapRef.current,
      title: "Selected Location",
      draggable: true,
    });

    //  Marker drag event: Reverse geocode new position
    newMarker.addListener("dragend", (e) => {
      console.log("📌 Marker dragged!");
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLngLat({ lat: lat, lng: lng });

      fetchPlaceDetails(mapsApi, { lat, lng }, (place) => {
        if (place) {
          console.log("📍 New address from drag:", place.formatted_address);
          setAddress(place.formatted_address);
          updateCityAndZip(place);
        }
      });
    });
    console.log('time to set the marker', newMarker)
    markerRef.current = newMarker
    //setMarker(newMarker);
  };

  // const fetchCourts = async () => {
  //   if (!mapRef.current) return;

  //   const bounds = mapRef.current.getBounds();
  //   if (!bounds) return;

  //   const sw = bounds.getSouthWest();
  //   const ne = bounds.getNorthEast();

  //   try {
  //     const results = await courtAPI.getCourts({
  //       latMin: sw.lat(),
  //       lngMin: sw.lng(),
  //       latMax: ne.lat(),
  //       lngMax: ne.lng(),
  //     });

  //     console.log("Fetched courts:", results.courts);
  //     //setCourts(results.courts);
  //     addCourtMarkers(results.courts);
  //   } catch (error) {
  //     console.error("Error fetching courts:", error);
  //   }
  // };

  //  Add markers for fetched courts
  const addCourtMarkers = (courts) => {
    if (!mapsApi || !mapRef.current) return;

    if (!infoWindowRef.current)
      infoWindowRef.current = new mapsApi.InfoWindow();

    courts.forEach((court) => {
      const lat = Number(court.lat);
      const lng = Number(court.lng);
      const marker = new mapsApi.marker.AdvancedMarkerElement({
        position: { lat, lng },
        map: mapRef.current,
        content: new mapsApi.marker.PinElement({
          background: "green",
          borderColor: "white",
          glyphColor: "yellow",
          scale: 1,
          //glyph: court.name.charAt(0).toUpperCase(), // Show first letter of court name
        }).element,
      });

      marker.addListener("click", () => {
        let infoContent = `
      <div style='width: 220px; padding: 8px; border-radius: 6px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);'>
      
        <h3 style='margin: 0; font-size: 16px; color: #333;'>${court.name}</h3>
        <p style='margin: 5px 0; font-size: 14px; color: #666;'>
          ${court?.number_of_courts ? court.number_of_courts + ' courts' : ""} | 
          ${court?.is_public ? ' open to the public' : ' private'}
        </p>
        <p style='margin: 5px 0; font-size: 14px; color: #666;'>
        ${helpers.truncateText(court.description, 100)}
        </p>
      </div>
      `;
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapRef.current, marker);

      });
    });
  };

  const createCourt = (e) => {
    e.preventDefault();
    if (!markerRef.current) {
      setInfoText("Please set the location on the map.");
      return;
    }

    if (!name) {
      setInfoText("The name is required.");
      return;
    }

    const data = {
      name,
      description: description,
      has_lights: hasLights,
      is_public: isPublic,
      number_of_courts: parseInt(noCourts, 10) || 1,
      lat: lngLat?.lat ?? 0,
      lng: lngLat?.lng ?? 0,
      city,
      zipcode: zip,
    };
    console.log(data)
    courtAPI.createCourt(data).then((response) => {
      if (response.error) {
        setErrorMessage(response.message);
      } else {
        if (callback) callback({ id: response.id, name: response.name });
        setInfoText("Court submitted successfully");
        resetForm();
      }
    });
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLngLat(null);
    setAddress("");
    setCity("");
    setZip("");
    setHasLights(false);
    setIsPublic(true);
    setNoCourts(1);
    if (markerRef.current) {
      markerRef.current.setMap(null); // Remove from the map
      markerRef.current = null; // Reset reference
    }
  };

  const updateCityAndZip = (place) => {
    let cityName = "";
    let zipCode = "";
    place.address_components.forEach((component) => {
      if (component.types.includes("locality")) cityName = component.long_name;
      if (component.types.includes("postal_code")) zipCode = component.long_name;
    });

    setCity(cityName);
    setZip(zipCode);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Create Court
      </Typography>

      <Box component={'form'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} id="courtForm" onSubmit={createCourt} >
        <TextField
          name="name"
          label="Court Name"
          fullWidth
          autoComplete="off"
          slotProps={{
            input: { "data-lpignore": "true" } // Prevent LastPass from filling this field
          }}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          name="description"
          label="Description"
          value={description}
          multiline
          rows={3}
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
        />

        <AutoCompletePlaces
          useFullAddress={true}
          label="Enter Address"
          fullWidth
          initialCity={address}
          //onChange={(e) => setAddress(e.target.value)}
          onPlaceChanged={(simpleLocation, place) => {
            console.log(place.geometry.location.lat(), place.formatted_address)
            if (place?.geometry?.location) {
              setLngLat({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              });
              setAddress(place.formatted_address);
              updateCityAndZip(place);
              createMarker(place.geometry.location.lat(), place.geometry.location.lng());
            }
          }}
        />

        <Box ref={mapContainerRef} sx={{ width: "100%", height: "50vh", border: "1px solid gray", my: 2 }} />

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={hasLights} onChange={(e) => setHasLights(e.target.checked)} />}
              label="Has Lights"
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
              label="Open to Public"
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="noCourts"
              type="number"
              label="Number of Courts"
              fullWidth
              value={noCourts}
              onChange={(e) => setNoCourts(e.target.value)}
            />
          </Grid>
        </Grid>

        <Button variant="contained" type="submit" color="primary" sx={{ mt: 2 }}>
          Submit
        </Button>
        {infoText && <Typography>{infoText}</Typography>}
        <ErrorHandler error={errorMessage} />
      </Box>
    </Container>
  );
};

export default CreateCourt;
