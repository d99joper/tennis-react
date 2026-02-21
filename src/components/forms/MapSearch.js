import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, TextField, Button, Slider, Typography, List, ListItem, ListItemText,
  CircularProgress, FormControlLabel, Checkbox, useMediaQuery, Paper, Chip, Collapse,
  IconButton, InputAdornment, useTheme } from "@mui/material";
import { AutoCompletePlaces } from "components/forms";
import useGoogleMapsApi from "helpers/useGoogleMapsApi";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AuthContext } from "contexts/AuthContext";
import { Link } from "react-router-dom";
import { helpers } from "helpers";
import { Helmet } from "react-helmet-async";
import { FaSearch, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";

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
  const theme = useTheme();
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
  const [count, setCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const { user } = useContext(AuthContext)
  const [markerCluster, setMarkerCluster] = useState(null);
  const [initialCity, setInitialCity] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const zoom = 11;

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const hasActiveFilters = useMemo(() =>
    applyNtrp || applyUtr || applyLocation || (location !== null),
    [applyNtrp, applyUtr, applyLocation, location]
  );

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
          if (user?.city?.lat && user?.city?.lng) {
            setInitialCity(user.city)
          }
        }
      );
    } else if (user?.city) {
      setInitialCity({ 'location': user.city.name, lat: user.city.lat, lng: user.city.lng });
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
  }, [mapsApi, initialCity, map]);

  const updateSearch = useCallback(async () => {
    if (requireLocation && !location) {
      setLocationError('Please provide a location');
      return;
    }
    setIsLoading(true);
    let isBoundsSearch = false;
    let filters = {};
    if (name) filters.name = name;
    if (applyNtrp) filters.ntrp = `${ntrp[0]},${ntrp[1]}`;
    if (applyUtr) filters.utr = `${utr[0]},${utr[1]}`;
    if (location) filters.geo = `${location.lat},${location.lng},${radius}`;
    if (!name && !applyNtrp && !applyUtr && !location) {
      isBoundsSearch = true;
      const bounds = map?.getBounds();
      if (!bounds) { setIsLoading(false); return; }

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const latMin = sw.lat();
      const lngMin = sw.lng();
      const latMax = ne.lat();
      const lngMax = ne.lng();
      filters.bounds = `${latMin},${latMax},${lngMin},${lngMax}`
    }
    const results = await fetchData(filters);
    setData(results.data);
    setCount(results.count || 0)
    setIsLoading(false);
    if (map) {
      updateMapMarkers(results.data, isBoundsSearch);
    }
    // Collapse filters on small screens after search
    if (isSmallScreen) {
      setFiltersOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, applyNtrp, applyUtr, ntrp, utr, location, radius, requireLocation, map, fetchData, isSmallScreen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      updateSearch();
    }
  }, [updateSearch]);

  const updateMapMarkers = (items, isBoundsSearch) => {
    
    //console.log("Items for markers:", items);
    //console.log(items)
    if (!mapsApi || !map) return;
    if (markerCluster) {
      markerCluster.clearMarkers();
    }

    if (!items.length) return; // No items, don't update map

    const roundCoord = (coord, precision = 4) => {
      return parseFloat(Number(coord).toFixed(precision));
    };
    const groupedLocations = {};
    console.log(items[1]);
    items.forEach(item => {
      const latValue = item.lat || item?.city?.lat;
      const lngValue = item.lng || item?.city?.lng;
      
      if (!latValue || !lngValue) {
        console.log('Skipping item with missing coordinates:', item);
        return;
      }
      
      const lat = roundCoord(parseFloat(latValue), 4);
      const lng = roundCoord(parseFloat(lngValue), 4);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.log('Skipping item with invalid coordinates:', item, lat, lng);
        return;
      }
      
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

    // Adjust map center and zoom
    if (newMarkers.length) {
      adjustMapView(newMarkers, isBoundsSearch);
    }

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

  const adjustMapView = (markers, isBoundsSearch) => {
    if (!map || !markers.length) return;

    const bounds = new mapsApi.LatLngBounds();
    let sumLat = 0, sumLng = 0;

    markers.forEach(marker => {
      const { lat, lng } = marker.position;
      bounds.extend(new mapsApi.LatLng(lat, lng));
      sumLat += lat;
      sumLng += lng;
    });

    // Calculate midpoint of all markers
    const center = {
      lat: sumLat / markers.length,
      lng: sumLng / markers.length
    };

    map.setCenter(center);

    const currentZoom = map.getZoom(); // Capture user's current zoom level

    // Fit map bounds to include all markers
    map.fitBounds(bounds);
    // Check if the zoom is too high after fitting bounds
    mapsApi.event.addListenerOnce(map, "bounds_changed", () => {
      const newZoom = map.getZoom();
      if (isBoundsSearch) {
        map.setZoom(Math.min(Math.max(currentZoom, newZoom), 13))
      }
      else {
        if (newZoom > 13) {
          map.setZoom(13);
        }
      }
    });
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', flexGrow: 1 }}>
      <Helmet>
        <title>{title} | MyTennis Space</title>
      </Helmet>

      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      {/* Search bar + filter toggle */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >
        {/* Name search with inline search button */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            label="Search by name"
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch size={14} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
              }
            }}
          />
          <Button
            variant="contained"
            onClick={updateSearch}
            disabled={isLoading}
            sx={{ minWidth: isSmallScreen ? 48 : 100, whiteSpace: 'nowrap' }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : (isSmallScreen ? <FaSearch /> : 'Search')}
          </Button>
        </Box>

        {/* Filter toggle button */}
        <Box
          onClick={() => setFiltersOpen(!filtersOpen)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: theme.palette.text.secondary,
            '&:hover': { color: theme.palette.primary.main },
            transition: 'color 0.2s',
            userSelect: 'none',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Chip label="Active" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
          )}
          <IconButton size="small" sx={{ ml: 'auto' }} aria-label="Toggle filters">
            {filtersOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </IconButton>
        </Box>

        {/* Collapsible Filters */}
        <Collapse in={filtersOpen}>
          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* NTRP Filter */}
            {showNTRP && (
              <Box>
                <FormControlLabel
                  control={<Checkbox size="small" checked={applyNtrp} onChange={() => setApplyNtrp(!applyNtrp)} />}
                  label={<Typography variant="body2">NTRP Range</Typography>}
                />
                <Collapse in={applyNtrp}>
                  <Box sx={{ px: 2, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {ntrp[0].toFixed(1)} - {ntrp[1].toFixed(1)}
                    </Typography>
                    <Slider value={ntrp} min={2.0} max={6.5} step={0.5} onChange={(e, val) => setNtrp(val)} valueLabelDisplay="auto" size="small" />
                  </Box>
                </Collapse>
              </Box>
            )}

            {/* UTR Filter */}
            {showUTR && (
              <Box>
                <FormControlLabel
                  control={<Checkbox size="small" checked={applyUtr} onChange={() => setApplyUtr(!applyUtr)} />}
                  label={<Typography variant="body2">UTR Range</Typography>}
                />
                <Collapse in={applyUtr}>
                  <Box sx={{ px: 2, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {utr[0].toFixed(1)} - {utr[1].toFixed(1)}
                    </Typography>
                    <Slider value={utr} min={1.0} max={17.0} step={0.1} onChange={(e, val) => setUtr(val)} valueLabelDisplay="auto" size="small" />
                  </Box>
                </Collapse>
              </Box>
            )}

            {/* Location Filter */}
            <Box>
              {!requireLocation && (
                <FormControlLabel
                  control={<Checkbox size="small" checked={applyLocation} onChange={() => setApplyLocation(!applyLocation)} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FaMapMarkerAlt size={12} />
                      <Typography variant="body2">Location Filter</Typography>
                    </Box>
                  }
                />
              )}
              <Collapse in={requireLocation || applyLocation}>
                <Box sx={{ px: requireLocation ? 0 : 2, mt: 0.5 }}>
                  <AutoCompletePlaces
                    onPlaceChanged={(location, place) => { setLocation(location, place); setLocationError('') }}
                    showGetUserLocation={true}
                    {...(requireLocation) && { required: true }}
                    helperText={locationError}
                    error={helpers.hasValue(locationError)}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Radius: {radius} miles
                    </Typography>
                    <Slider min={5} max={100} step={5} value={radius} onChange={(e, val) => setRadius(val)} valueLabelDisplay="auto" size="small" />
                  </Box>
                </Box>
              </Collapse>
            </Box>

            {/* Actions */}
            {renderActions && (
              <Box sx={{ mt: 0.5 }}>
                {renderActions()}
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Main content: Map + Results side-by-side (or stacked on mobile) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMediumScreen ? 'column' : 'row',
          gap: 2,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Map */}
        <Paper
          elevation={1}
          sx={{
            flex: isMediumScreen ? 'none' : 1.2,
            borderRadius: 2,
            overflow: 'hidden',
            minHeight: isMediumScreen ? 300 : 450,
            order: isMediumScreen ? 1 : 2,
          }}
        >
          <Box id="map" sx={{ width: '100%', height: '100%', minHeight: isMediumScreen ? 300 : 450 }} />
        </Paper>

        {/* Results */}
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            borderRadius: 2,
            overflow: 'auto',
            maxHeight: isMediumScreen ? 'none' : 'calc(80vh - 200px)',
            minHeight: isMediumScreen ? 'auto' : 300,
            order: isMediumScreen ? 2 : 1,
          }}
        >
          {/* Results header */}
          <Box
            sx={{
              p: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.header,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {count !== null
                ? `${count} result${count !== 1 ? 's' : ''} found${count > 25 ? ' (showing 25)' : ''}`
                : 'Search to see results'
              }
            </Typography>
          </Box>

          {/* Results list */}
          <Box sx={{ p: 1 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : data.length > 0 ? (
              <List disablePadding>
                {data.map(item => (
                  <ListItem
                    key={item.id}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      px: 1.5,
                      py: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    {renderListItem ? renderListItem(item) :
                      <Link to={`/${type}/${item.slug || item.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>}
                          secondary={
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                              {(item.location || item?.city?.name) && (
                                <><FaMapMarkerAlt size={10} /> {item.location ?? item?.city?.name}</>
                              )}
                            </Typography>
                          }
                        />
                      </Link>
                    }
                  </ListItem>
                ))}
              </List>
            ) : count === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">No results found. Try adjusting your search.</Typography>
              </Box>
            ) : null}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MapSearch;
