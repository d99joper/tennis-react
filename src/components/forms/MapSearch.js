import React, { useContext, useEffect, useState } from "react";
import { Box, TextField, Button, Slider, Typography, List, ListItem, ListItemText, CircularProgress, FormControlLabel, Checkbox } from "@mui/material";
import { AutoCompletePlaces, ProfileImage } from "components/forms";
import useGoogleMapsApi from "helpers/useGoogleMapsApi";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AuthContext } from "contexts/AuthContext";
import { Link } from "react-router-dom";

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
  const [initialCity, setInitialCity] = useState({ location: "Sacramento, CA", lat: 38.5816, lng: -121.4944 });

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
  }, [user]);

  useEffect(() => {
    if (mapsApi && onMapsApiLoaded) {
      onMapsApiLoaded(mapsApi); // 🔥 Send mapsApi up to CourtsLanding
    }
  }, [mapsApi, onMapsApiLoaded]);

  useEffect(() => {
    if (mapsApi && !map) {
      const newMap = new mapsApi.Map(document.getElementById("map"), {
        center: { lat: initialCity.lat, lng: initialCity.lng },
        zoom: 10,
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
    if(requireLocation && !location) {
      setLocationError('Please provide a location');
      return;
    }
    setIsLoading(true);
    let filters = {};
    if (name) filters.name = name;
    if (applyNtrp) filters.ntrp = `${ntrp[0]},${ntrp[1]}`;
    if (applyUtr) filters.utr = `${utr[0]},${utr[1]}`;
    if (location) filters.geo = `${location.lat},${location.lng},${radius}`;

    const results = await fetchData(filters);
    setData(results);
    setIsLoading(false);

    if (map) {
      map.setCenter({ lat: initialCity.lat, lng: initialCity.lng });
      map.setZoom(5);
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
        if(type==='courts') {
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
        console.log(totalItems)
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
    <Box display="flex" height="100vh">
      <Box width="30%" p={2}>
        <Typography variant="h6">{title}</Typography>
        <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
        {showNTRP && (<>
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
        </>)}
        {showUTR && (<>
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
        </>)}
        {!requireLocation &&
          <FormControlLabel
            control={<Checkbox checked={applyLocation} onChange={() => setApplyLocation(!applyLocation)} />}
            label="Apply Location Filter"
          />
        }
        {(requireLocation || applyLocation) && (
          <>
            <AutoCompletePlaces 
              onPlaceChanged={(location, place) => {setLocation(location, place); setLocationError('')}} 
              showGetUserLocation={true} 
              {...(requireLocation) && {required:true}}
              helperText={locationError}
              error={locationError}
            />
            <Typography>Radius: {radius} miles</Typography>
            <Slider min={5} max={100} step={5} value={radius} onChange={(e, val) => setRadius(val)} valueLabelDisplay="auto" />
          </>
        )}
        <Button variant="contained" fullWidth onClick={updateSearch} sx={{ mt: 2 }}>Search</Button>

        {renderActions && renderActions()}

        <List>
          {isLoading ? <CircularProgress /> : data.map(item => (
            <ListItem key={item.id}>
              {renderListItem ? renderListItem(item) :
                <Link to={`/${type}/${item.id}`}>
                  <ListItemText primary={item.name} secondary={item.location ?? item?.city} />
                </Link>
              }
            </ListItem>
          ))}
        </List>
      </Box>
      <Box width="70%" id="map" sx={{ height: "80vh" }}></Box>
    </Box >
  );
};

export default MapSearch;
