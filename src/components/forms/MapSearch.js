import React, { useContext, useEffect, useState } from "react";
import { Box, TextField, Button, Slider, Typography, List, ListItem, ListItemText, CircularProgress, FormControlLabel, Checkbox, useMediaQuery, Grid2 } from "@mui/material";
import { AutoCompletePlaces, ProfileImage } from "components/forms";
import useGoogleMapsApi from "helpers/useGoogleMapsApi";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AuthContext } from "contexts/AuthContext";
import { Link } from "react-router-dom";
import { helpers } from "helpers";
import useComponentWidth from "helpers/useComponentWidth";
import { Helmet } from "react-helmet-async";

const MapSearch = ({
  title,
  fetchData,
  renderInfoWindow,
  showNTRP,
  showUTR,
  requireLocation,
  renderActions,
  renderListItem,
  type,
  onMapsApiLoaded
}) => {
  const mapsApi = useGoogleMapsApi();
  const [name, setName] = useState("");
  const [applyLocation, setApplyLocation] = useState(false);
  const [applyNtrp, setApplyNtrp] = useState(false);
  const [applyUtr, setApplyUtr] = useState(false);
  const [ntrp, setNtrp] = useState([2.0, 5.0]);
  const [utr, setUtr] = useState([2.0, 10.0]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [radius, setRadius] = useState(15);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const { user } = useContext(AuthContext)
  const [markerCluster, setMarkerCluster] = useState(null);
  const [initialCity, setInitialCity] = useState(null);
  const zoom = 11;

  // Use custom width hook
  const [containerRef, containerWidth] = useComponentWidth();

  // Media query for responsiveness
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

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
    } else setInitialCity({ location: "Sacramento, CA", lat: 38.5816, lng: -121.4944 });
  }, [user]);

  useEffect(() => {
    if (mapsApi && onMapsApiLoaded && initialCity) {
      onMapsApiLoaded(mapsApi); // 🔥 Send mapsApi up to CourtsLanding
    }
  }, [mapsApi, onMapsApiLoaded, initialCity]);

  useEffect(() => {
    if (mapsApi && !map && initialCity) {
      const newMap = new mapsApi.Map(document.getElementById("map"), {
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
      setMap(newMap);
      setInfoWindow(new mapsApi.InfoWindow());
    }
  }, [mapsApi, initialCity]);

  const updateSearch = async () => {
    if (requireLocation && !location) {
      setLocationError('Please provide a location');
      return;
    }
    setIsLoading(true);
    let filters = {};
    if (name) filters.name = name;
    if (applyNtrp) filters.ntrp = `${ntrp[0]},${ntrp[1]}`;
    if (applyUtr) filters.utr = `${utr[0]},${utr[1]}`;
    if (location) filters.geo = `${location.lat},${location.lng},${radius}`;
    else {
      const bounds = map.getBounds();
      if (!bounds) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const latMin = sw.lat();
      const lngMin = sw.lng();
      const latMax = ne.lat();
      const lngMax = ne.lng();
      filters.bounds = `${latMin},${latMax},${lngMin},${lngMax}`
    }
    const results = await fetchData(filters);
    setData(results);
    setIsLoading(false);

    if (map) {
      map.setCenter({ lat: initialCity.lat, lng: initialCity.lng });
      map.setZoom(zoom);
      updateMapMarkers(results);
    }
  };

  const updateMapMarkers = (items) => {
    //console.log(items)
    if (!mapsApi || !map) return;
    if (markerCluster) {
      markerCluster.clearMarkers();
    }

    const roundCoord = (coord, precision = 4) => {
      return parseFloat(Number(coord).toFixed(precision));
    };
    const groupedLocations = {};
    items.forEach(item => {
      const lat = roundCoord(item.lat, 4);  // Adjust precision as needed
      const lng = roundCoord(item.lng, 4);
      const key = `${lat},${lng}`;
      if (!groupedLocations[key]) groupedLocations[key] = [];
      groupedLocations[key].push(item);
    });

    const newMarkers = Object.keys(groupedLocations).map(key => {
      const [lat, lng] = key.split(",").map(Number);
      const itemsAtLocation = groupedLocations[key];
      let totalCount = 0;
      let isPublic = true;
      itemsAtLocation.forEach(item => {
        totalCount += item.number_of_courts ?? 1;
        if (type === 'courts') {
          isPublic = item.is_public;
        }
      })
      // const marker = new mapsApi.Marker({
      //   position: { lat, lng },
      //   //map,
      //   label: { text: String(totalCount), color: "white", fontSize: "10px" },
      // });
      const marker = new mapsApi.marker.AdvancedMarkerElement({
        position: { lat, lng },
        content: new mapsApi.marker.PinElement({
          background: isPublic ? "red" : "blue",
          borderColor: isPublic ? "red" : "white",
          glyphColor: "white",
          scale: 1,
          glyph: String(totalCount),
        }).element,
      });
      marker.itemCount = totalCount;

      marker.addListener("click", () => {
        infoWindow.setContent(renderInfoWindow(itemsAtLocation));
        infoWindow.open(map, marker);
      });

      return marker;
    });

    const renderer = {
      render: ({ markers, position }) => {
        const totalItems = markers.reduce((sum, marker) => sum + (marker.itemCount || 1), 0);
        //console.log(totalItems)
        return new mapsApi.Marker({
          label: { text: String(totalItems), color: "white", backgroundColor: 'blue', fontSize: "10px" },
          position,
          // adjust zIndex to be above other markers
          zIndex: Number(mapsApi.Marker.MAX_ZINDEX) + 1,
        })
      }
    }
    const newMarkerCluster = new MarkerClusterer({ map, markers: newMarkers, renderer: renderer });
    setMarkerCluster(newMarkerCluster);
  };

  return (
    <Box ref={containerRef} display="flex" flexDirection={"column"} height="100vh" sx={{ flexGrow: 1 }}>
      <Helmet>
        <title>Search | MyTennis Space</title>
      </Helmet>
      <Typography variant="h6">{title}</Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={8}>
          <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
        </Grid2>
        {showNTRP && (
          <Grid2 size={8}>
            <FormControlLabel
              control={<Checkbox checked={applyNtrp} onChange={() => setApplyNtrp(!applyNtrp)} />}
              label="Apply NTRP Filter"
            />
            {applyNtrp &&
              <>
                <Typography>NTRP Range</Typography>
                <Slider value={ntrp} min={2.0} max={6.5} step={0.5} onChange={(e, val) => setNtrp(val)} valueLabelDisplay="auto" />
              </>
            }
          </Grid2>
        )}
        {showUTR && (
          <Grid2 size={8}>
            <FormControlLabel
              control={<Checkbox checked={applyUtr} onChange={() => setApplyUtr(!applyUtr)} />}
              label="Apply UTR Filter"
            />
            {applyUtr && (
              <>
                <Typography>UTR Range</Typography>
                <Slider value={utr} min={1.0} max={17.0} step={0.1} onChange={(e, val) => setUtr(val)} valueLabelDisplay="auto" />
              </>
            )}
          </Grid2>
        )}
        <Grid2 size={8}>
          {!requireLocation &&
            <FormControlLabel
              control={<Checkbox checked={applyLocation} onChange={() => setApplyLocation(!applyLocation)} />}
              label="Apply Location Filter"
            />
          }
          {(requireLocation || applyLocation) && (
            <>
              <AutoCompletePlaces
                onPlaceChanged={(location, place) => { setLocation(location, place); setLocationError('') }}
                showGetUserLocation={true}
                {...(requireLocation) && { required: true }}
                helperText={locationError}
                error={helpers.hasValue(locationError)}
              />
              <Typography>Radius: {radius} miles</Typography>
              <Slider min={5} max={100} step={5} value={radius} onChange={(e, val) => setRadius(val)} valueLabelDisplay="auto" />
            </>
          )}
        </Grid2>
        <Grid2 size={12}>
          <Button variant="contained" fullWidth onClick={updateSearch} sx={{ mt: 2 }}>Search</Button>
        </Grid2>
        <Grid2 size={12}>
          {renderActions && renderActions()}
        </Grid2>
      </Grid2>

      {/* Results and Map - Split Dynamically */}
      <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"} width={"100%"} height="100vh" sx={{ pt: 2 }}>

        {/* Results List */}
        <Box width={"100%"} p={2} overflow="auto">
          {isLoading ? <CircularProgress /> : (
            <List>
              {data.map(item => (
                <ListItem key={item.id}>
                  {renderListItem ? renderListItem(item) :
                    <Link to={`/${type}/${item.id}`}>
                      <ListItemText primary={item.name} secondary={item.location ?? item?.city} />
                    </Link>
                  }
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Map */}
        <Box width={"100%"} id="map" sx={{ height: "100%" }}></Box>
      </Box>
    </Box >
  );
};

export default MapSearch;
