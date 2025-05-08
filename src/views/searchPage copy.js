import { Box, Button, Card, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, List, MenuItem, Radio, RadioGroup, Select, Slider, Typography } from "@mui/material"
import { courtAPI, ladderAPI, playerAPI } from "api/services"
import { AutoCompletePlaces, ItemCard, ProfileImage } from "components/forms"
import { enums, helpers, userHelper } from "helpers"
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import ball_icon from 'images/tennis_ball.png'

const SearchPage = (props) => {

  const [radius, setRadius] = useState(15)
  const [matchType, setMatchType] = useState(enums.MATCH_TYPE.SINGLES)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [levelNTRP, setLevelNTRP] = useState([2.0, 5.0])
  const [levelUTR, setLevelUTR] = useState([3.0, 10.0])
  const [initialCity, setInitialCity] = useState('')
  const [scriptIsLoaded, setScriptIsLoaded] = useState(false)
  const [ladders, setLadders] = useState([])
  const [players, setPlayers] = useState([])
  const [courts, setCourts] = useState([])
  const [markers, setMarkers] = useState([])
  const [totalCount, setTotalCount] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSearch, setSelectedSearch] = useState('players')
  const [isInitialMapSet, setIsInitialMapSet] = useState(false)
  const [mapApi, setMapApi] = useState()
  const [filters, setFilters] = useState([])
  const [highlightedItem, setHighlightedItem] = useState(null)
  const nameRef = useRef()


  let map

  const handleFilterChange = (filter) => {
    // Check if the filter is already in the array
    const isFilterSelected = filters.includes(filter)

    // If it's selected, remove it; otherwise, add it
    if (isFilterSelected) {
      setFilters(filters.filter(f => f !== filter))
    } else {
      setFilters([...filters, filter])
    }
  }

  function handlePlaceChanged(geoPoint) {
    console.log('new place', geoPoint)
    setMapCenter({ lat: geoPoint.lat, lng: geoPoint.lng })
  }

  useEffect(() => {
    async function getMapApi() {
      const m = await helpers.loadGoogleMapsAPI()
      console.log(m)
      setMapApi(m)
    }
    if (!mapApi)
      getMapApi()
  }, [])

  useEffect(() => {

    async function setInitialMap() {
      if (!isInitialMapSet) {
        function getCurrentPosition() {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              position => resolve(position),
              error => reject(error)
            )
          })
        }

        setIsInitialMapSet(true)
        async function getUserLocation() {
          console.log("mapApi", mapApi)
          // if the user lets us use their location
          if (navigator.geolocation) {
            // get the position
            const position = await getCurrentPosition()
            const myLngLat = { lat: position.coords.latitude, lng: position.coords.longitude }
            // create a geocoder
            const geocoder = new mapApi.Geocoder() //window.google.maps.Geocoder()
            // make a map with the user's coordiated
            const latLng = new mapApi.LatLng(myLngLat.lat, myLngLat.lng)//window.google.maps.LatLng(myLngLat.lat, myLngLat.lng);
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
                  console.log("No results found.");
                }
              } else {
                console.error(`Geocoder failed due to: ${status}`);
              }
            });
            // set the map center based on the user's position
            setMapCenter(myLngLat)
            return myLngLat
            // });
          } else {
            console.log("Geolocation is not supported by this browser. Set San Fran as default")
            return { lat: 38.54422591158026, lng: -121.74365619216327 }
          }
        }
        let myLngLat = await getUserLocation()

        // set the 
        map = new mapApi.Map(document.getElementById("map"), {
          zoom: 10,
          center: myLngLat,
        });
        //updateSearch(myLngLat)
      }
    }
    if (mapApi)
      setInitialMap()

  }, [mapApi])

  function updateSearch(myLngLat) { //lat = 38.55, lng = -121.73) {

    function updateMapMarkers(places) {
      console.log('mapresults', places)
      //setMarkers([])
      let newMarkers = []
      places.forEach(x => {
        if (x.lng && x.lat) {
          const marker = new window.google.maps.Marker({
            position: { lat: parseFloat(x.lat), lng: parseFloat(x.lng) },
            map: map,
            title: x.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }
          })
          const infoWindow = new window.google.maps.InfoWindow({
            content: x.name
          })
          marker.addListener('click', () => {
            console.log('clicked marker')
            infoWindow.open(map, marker)
            setHighlightedItem(x.id)
          })
          newMarkers.push(marker)
        }
      })
      setMarkers(newMarkers)
    }
    setIsLoading(true)
    if (!myLngLat?.lat)
      myLngLat = mapCenter

    const nameInput = document.getElementById("search_name")
    nameRef.current = nameInput
    let email, name //firstName, lastName,
    if (nameInput) {
      name = nameInput.value
      // const nameParts = nameInput.value.split(' ')
      // firstName = nameParts[0]
      // lastName = nameParts[1]
    }
    const emailInput = document.getElementById("search_email")
    if (emailInput)
      email = emailInput.value

    if (filters.includes('location')) {
      map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: radius === 15 ? 10 : radius === 25 ? 9 : radius === 50 ? 8 : radius === 75 ? 7 : 7,
        center: myLngLat,
      })
      new window.google.maps.Circle({
        strokeColor: 'green', // Red outline color
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'green', // Red fill color
        fillOpacity: 0.25,
        map: map,
        center: myLngLat,
        radius: radius * 1609.34,
      })
    }
    let filter = {
      ...myLngLat && filters.includes('location') ? { geo: `${myLngLat.lat},${myLngLat.lng},${radius}` } : {},
      ...matchType && selectedSearch === 'ladders' ? { 'match-type': matchType } : {},
      ...levelNTRP && filters.includes('ntrp') ? { 'level-min': levelNTRP[0] } & { 'level-max': levelNTRP[1] } : {},
      ...levelNTRP && filters.includes('ntrp') ? { 'level-ntrp': `${levelNTRP[0]},${levelNTRP[1]}` } : {},
      ...levelUTR && filters.includes('utr') ? { 'level-utr': `${levelUTR[0]},${levelUTR[1]}` } : {},
      ...name ? { 'name': name } : {},
      // ...firstName && selectedSearch === 'players' ? { 'first-name': firstName } : {},
      // ...lastName && selectedSearch === 'players' ? { 'last-name': lastName } : {},
      ...email && selectedSearch === 'players' ? { 'email': email } : {}
    }

    if (selectedSearch === 'players') {
      console.log('call getPlayers', filter)
      playerAPI.getPlayers(filter).then((playerResults) => {
        console.log(playerResults.players)
        //if(filters.includes('location')) 
        updateMapMarkers(playerResults.players)
        setPlayers(playerResults.players)
        setTotalCount(playerResults.total_count)
        setIsLoading(false)
      })
    }
    if (selectedSearch === 'ladders') {
      ladderAPI.getLadders(filter).then((ladderResults) => {
        setLadders(ladderResults.ladders)
        setTotalCount(ladderResults.total_count)
        //if(filters.includes('location')) 
        updateMapMarkers(ladderResults.ladders)
        setIsLoading(false)
        //console.log(ladderResults)
        // for each ladder, set a marker on the map
      })
    }
    if (selectedSearch === 'courts') {
      courtAPI.getCourts(filter).then((results) => {
        console.log(results)
        setCourts(results.courts)
        setTotalCount(results.total_count)
        updateMapMarkers(results.courts)
        setIsLoading(false)
      })
    }
  }
  const handleRadiusChange = (event) => {
    setRadius(event.target.value)
  }
  const handleSearchTypeChange = (event) => {
    setSelectedSearch(event.target.value)
    const nameInput = document.getElementById("search_name")
    nameRef.current = nameInput
    if (nameInput)
      nameInput.value = ''
  }

  const highlighCard = (e, item) => {
    markers.forEach(marker => {
      if (marker.getPosition().equals(new window.google.maps.LatLng(item.lat, item.lng))) {
        if (e.type === 'mouseenter' || e.type === 'click') {
          marker.setIcon('http://maps.gstatic.com/mapfiles/ms2/micons/grn-pushpin.png')
          setHighlightedItem(item.id)
        }
      }
      else {
        //setHighlightedItem(null)
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
      }
    })
    // const marker = markers.find(marker => marker.getPosition().equals(new window.google.maps.LatLng(item.lat, item.lng)))

    // if (marker) {
    //   // const icon = {
    //   //   url: ball_icon, // Path to your icon image
    //   //   scaledSize: new window.google.maps.Size(25, 25), // Specify the desired width and height
    //   // }
    //   if(e.type === 'mouseenter') {
    //     marker.setIcon('http://maps.gstatic.com/mapfiles/ms2/micons/ylw-pushpin.png')
    //     setHighlightedItem(item.id)
    //   } else
    //     marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
    // }
  }

  return (
    <Box display={'flex'} flexDirection={"column"}>
      <FormControl>
        <FormLabel id="search-radio-buttons-group-label">Search for</FormLabel>
        <RadioGroup
          row
          onChange={handleSearchTypeChange}
          aria-labelledby="search-radio-buttons-group-label"
          value={selectedSearch}
          name="search-radio-buttons-group"
        >
          <FormControlLabel value="players" control={<Radio />} label="Players" />
          <FormControlLabel value="ladders" control={<Radio />} label="Ladders" />
          <FormControlLabel value="courts" control={<Radio />} label="Courts" />
        </RadioGroup>
      </FormControl>
      <div>
        <Button variant="contained" onClick={updateSearch}>Search</Button>
      </div>
      <Box display={'flex'} flexDirection={"row"} gap=".5rem">
        <Box display={'flex'} flexDirection={"column"} gap="1rem" >
          <Box display={'flex'} flexDirection={"column"} gap={"0.5rem"} width={"450px"}>
            <div>
              Name:  &nbsp;
              <input id="search_name" />
            </div>
            {/* {selectedSearch === 'players' &&
              <>
                <div>
                  Email:  &nbsp;
                  <input id="search_email" />
                </div>
              </>
            } */}
            <div>
              Search on location
              <Checkbox
                checked={filters.includes('location')}
                value={'location'}
                onChange={() => handleFilterChange('location')}
              />
            </div>
            {filters.includes('location') &&
              <>
                <AutoCompletePlaces onPlaceChanged={handlePlaceChanged} initialCity={initialCity} scriptIsLoaded={scriptIsLoaded} />
                <div>
                  Radius: &nbsp;
                  <Select
                    variant="standard"
                    value={radius}
                    id="radiusSelect"
                    onChange={handleRadiusChange}
                  >
                    <MenuItem value={15}>15 miles</MenuItem>
                    <MenuItem value={25}>25 miles</MenuItem>
                    <MenuItem value={50}>50 miles</MenuItem>
                    <MenuItem value={75}>75 miles</MenuItem>
                    <MenuItem value={100}>100 miles</MenuItem>
                  </Select>
                </div>
              </>
            }
            {selectedSearch !== 'courts' &&
              <>
                <div>
                  Search on NTPR level
                  <Checkbox
                    checked={filters.includes('ntrp')}
                    value={'ntrp'}
                    onChange={() => handleFilterChange('ntrp')}
                  />
                </div>
                {filters.includes('ntrp') &&
                  <div style={{ width: '80%' }}>
                    NTRP Level:  &nbsp;
                    <Slider
                      getAriaLabel={() => 'Level'}
                      label="Level"
                      min={2}
                      max={6.5}
                      step={0.5}
                      value={levelNTRP}
                      onChange={(e) => setLevelNTRP(e.target.value)}
                      marks={enums.LevelMarks}
                      valueLabelDisplay="auto"
                    />
                  </div>
                }
                {selectedSearch === 'players' &&
                  <div>
                    Search on UTR level
                    <Checkbox
                      checked={filters.includes('utr')}
                      value={'utr'}
                      onChange={() => handleFilterChange('utr')}
                    />
                  </div>
                }
                {filters.includes('utr') &&
                  <div style={{ width: '80%' }}>
                    UTR Level: {`${levelUTR[0]}-${levelUTR[1]}`} &nbsp;
                    <Slider
                      getAriaLabel={() => 'Level'}
                      label="Level"
                      min={1.0}
                      max={17.0}
                      step={0.1}
                      value={levelUTR}
                      onChange={(e) => setLevelUTR(e.target.value)}
                      //marks={enums.LevelMarks}
                      valueLabelDisplay="auto"
                    />
                  </div>
                }
                {selectedSearch === 'ladders' &&
                  <div>
                    Match type: &nbsp;
                    <Select
                      variant="standard"
                      value={matchType}
                      onChange={e => setMatchType(e.target.value)}
                    >
                      <MenuItem value={enums.MATCH_TYPE.SINGLES}>Singles</MenuItem>
                      <MenuItem value={enums.MATCH_TYPE.DOUBLES}>Doubles</MenuItem>
                    </Select>
                  </div>
                }
              </>
            }
          </Box>
          <Divider />
          <div style={{ overflowY: "auto" }}>RESULTS:</div>
          {isLoading ?
            <CircularProgress size={140} />
            :
            selectedSearch === 'players' && totalCount >= 0 &&
            <>
              {`${totalCount} player${totalCount > 1 ? 's' : ''} found`}
              <List
                type="list"
                items={players}
                direction='column'
                justifyContent={'space-between'}
              >
                {(player, index) => (
                  <Link to={"/players/" + player.slug} key={player.id + '_' + index}>
                    <Card display={'flex'} flexD key={`player_card_${index}`}
                      //backgroundColor={'blue.10'}
                      variation="outlined"
                      padding={".3rem"}
                      borderRadius={'medium'}>
                      <Box display={'flex'} flexDirection={'row'}>
                        {/* <View className={"profileImageContainer_small"}> */}
                        <ProfileImage player={player} size={80} />
                        {/* </View> */}
                        <Box display={'flex'} flexDirection={'column'} gap="0.1rem">
                          <Typography as='span'>
                            {userHelper.SetPlayerName(player, null, nameRef.current?.value)}
                          </Typography>
                          {player.location &&
                            <Typography as='div'>{player.location}</Typography>}
                          {player.NTRP &&
                            <Typography as='div'>NTRP: {player.NTRP}</Typography>}
                          {player.cached_utr?.singles > 0 &&
                            <Typography as='div'>UTR: {player.cached_utr.singles > 0 ? player.cached_utr.singles : 'UR'}</Typography>}
                        </Box>
                      </Box>
                    </Card>
                  </Link>
                )}
              </List>
            </>
          }
          {selectedSearch === 'courts' &&
            <>
              {`${totalCount} court${courts.length > 1 ? 's' : ''} found`}
              <List
                type="list"
                items={courts}
                direction={'column'}
                justifyContent={'space-between'}
              >
                {(court, index) => (
                  <ItemCard
                    onHover={(e) => highlighCard(e, court)}
                    onClick={(e) => highlighCard(e, court)}
                    highlight={highlightedItem === court.id}
                    key={`${court.id}_list${court}`}
                    header={
                      <b>{court.name}</b>
                    }
                    description={court.description}
                    footer={<>
                      {`${court.number_of_courts} courts`}<br />
                      {court.has_lights ? 'Has lights' : 'No lights'}
                    </>
                    }
                  />
                )}
              </List>
            </>
          }
          {selectedSearch === 'ladders' &&
            <>
              {`${totalCount} ladder${ladders.length > 1 ? 's' : ''} found`}
              <List
                type="list"
                items={ladders}
                direction='column'
                justifyContent={'space-between'}
              >
                {(ladder, index) => (
                  <ItemCard
                    onHover={(e) => highlighCard(e, ladder)}
                    onClick={(e) => highlighCard(e, ladder)}
                    key={`${ladder.id}_list${ladder}`}
                    highlight={highlightedItem === ladder.id}
                    footer={<>
                      {`${ladder.counts.players} players`}<br />
                      {`${ladder.counts.matches} matches`}
                    </>
                    }
                    header={
                      ladder.name ?
                        <Link to={`/ladders/${ladder.id}`}>{ladder.name}</Link>
                        : 'No ladder found'
                    }
                    description={ladder.description ?? ''}
                    footerRight={`Level: ${ladder.level_min}${ladder.level_max !== ladder.level_min ? '-' + ladder.level_max : ''}`}
                  />
                )}
              </List>
            </>
          }
        </Box>
        <Box display={'flex'} flexDirection={"column"} height={"100vh"} overflow={"hidden"} >
          <div id="map" style={{ minHeight: '400px', minWidth: '400px', border: '1px solid black' }}></div>
        </Box>
      </Box>
    </Box>
  )
}

export default SearchPage