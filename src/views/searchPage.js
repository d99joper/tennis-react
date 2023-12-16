import { Collection, Flex, Card, Text, View } from "@aws-amplify/ui-react"
import { Button, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, Slider } from "@mui/material"
import { ladderAPI, playerAPI } from "api/services"
import { AutoCompletePlaces, ItemCard, ProfileImage } from "components/forms"
import { enums, userHelper } from "helpers"
import React, { useEffect, useRef } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

const SearchPage = (props) => {

  const [radius, setRadius] = useState(15)
  const [matchType, setMatchType] = useState(enums.MATCH_TYPE.SINGLES)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [levelNTRP, setLevelNTRP] = useState([2.0, 5.0])
  const [levelUTR, setLevelUTR] = useState([4.0, 9.0])
  const [initialCity, setInitialCity] = useState('')
  const [scriptIsLoaded, setScriptIsLoaded] = useState(false)
  const [ladders, setLadders] = useState([])
  const [players, setPlayers] = useState([])
  const [totalCount, setTotalCount] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSearch, setSelectedSearch] = useState('players')
  const [filters, setFilters] = useState([])
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
    setMapCenter(geoPoint)
  }
  async function initMap() {
    //console.log('hello initMap')
    // set the 
    // map = new window.google.maps.Map(document.getElementById("map"), {
    // 	zoom: 10,
    // 	center: mapCenter,
    // })
  }
  window.initMap = initMap;

  useEffect(() => {

    async function setMap() {
      function getCurrentPosition() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error)
          )
        })
      }
      async function getUserLocation() {
        // if the user lets us use their location
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
      map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: myLngLat,
      });
      //updateSearch(myLngLat)
    }

    // check if script was already created
    let script = document.getElementById("placesScript")

    if (!script) {
      script = document.createElement("script")
      const apiKey = process.env.REACT_APP_PLACES_API_KEY

      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places&callback=initMap"
      script.id = 'placesScript'
      script.async = false

      // script.integrity =
      //   "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"

      script.crossOrigin = "anonymous"
      //console.log(script)
      //head.insertBefore(script, head.firstChild);
      document.body.appendChild(script)

      script.addEventListener('load', () => {
        setScriptIsLoaded(true)
        setMap()
      })

      return () => {
        // clean up the script when the component in unmounted
        //document.body.removeChild(script)
      }
    } else {
      setScriptIsLoaded(true)
      setMap()
    }
  }, [])

  function updateSearch(myLngLat) { //lat = 38.55, lng = -121.73) {

    function updateMapMarkers(places) {
      console.log('mapresults', places)
      places.forEach(x => {
        if (x.lng && x.lat) {
          new window.google.maps.Marker({
            position: { lat: parseFloat(x.lat), lng: parseFloat(x.lng) },
            map: map,
            title: x.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }
          })
        }
      })
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

    if(filters.includes('geo')) {
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
      ...name && selectedSearch === 'players' ? { 'name': name } : {},
      // ...firstName && selectedSearch === 'players' ? { 'first-name': firstName } : {},
      // ...lastName && selectedSearch === 'players' ? { 'last-name': lastName } : {},
      ...email && selectedSearch === 'players' ? { 'email': email } : {}
    }

    if (selectedSearch === 'players') {
      console.log('call getPlayers', filter)
      playerAPI.getPlayers(filter).then((playerResults) => {
        console.log(playerResults.players)
        if(filters.includes('geo')) 
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
        if(filters.includes('geo')) 
          updateMapMarkers(ladderResults.ladders)
        setIsLoading(false)
        //console.log(ladderResults)
        // for each ladder, set a marker on the map
      })
    }


  }
  const handleRadiusChange = (event) => {
    setRadius(event.target.value)
  }
  const handleSearchTypeChange = (event) => {
    setSelectedSearch(event.target.value)
  }
  return (
    <Flex direction={"column"}>
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
          <div>
            <Button variant="contained" onClick={updateSearch}>Search</Button>
          </div>
        </RadioGroup>
      </FormControl>
      <Flex direction={"row"} gap=".5rem">
        <Flex direction={"column"} gap="1rem" >
          <Flex direction={"column"} gap={"0.5rem"} width={"450px"}>
            {selectedSearch === 'players' &&
              <>
                <div>
                  Name:  &nbsp;
                  <input id="search_name" />
                </div>
                <div>
                  Email:  &nbsp;
                  <input id="search_email" />
                </div>
              </>
            }
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
            <div>
              Search on UTR level
              <Checkbox
                checked={filters.includes('utr')}
                value={'utr'}
                onChange={() => handleFilterChange('utr')}
              />
            </div>
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
          </Flex>
          <Divider />
          <div>RESULTS:</div>
          {isLoading ?
            <CircularProgress size={140} />
            :
            selectedSearch === 'players' && totalCount >= 0 &&
            <>
              {`${totalCount} player${totalCount > 1 ? 's' : ''} found`}
              <Collection
                type="list"
                items={players}
                direction='column'
                justifyContent={'space-between'}
              >
                {(player, index) => (
                  <Link to={"/profile/" + player.id} key={player.id + '_' + index}>
                    <Card key={`player_card_${index}`}
                      //backgroundColor={'blue.10'}
                      variation="outlined"
                      padding={".3rem"}
                      borderRadius={'medium'}>
                      <Flex direction={'row'}>
                        <View className={"profileImageContainer_small"}>
                          <ProfileImage player={player} size={60} />
                        </View>
                        <Flex direction={'column'} gap="0.1rem">
                          <Text as='span'>
                            {userHelper.SetPlayerName(player, null, nameRef.current?.value)}
                          </Text>
                          {player.location && <Text as='div'>{player.location}</Text>}
                          {player.NTRP && <Text as='div'>NTRP: {player.NTRP}</Text>}
                        </Flex>
                      </Flex>
                    </Card>
                  </Link>
                )}
              </Collection>
            </>
          }
          {selectedSearch === 'ladders' &&
            <>
              {`${totalCount} ladder${ladders.length > 1 ? 's' : ''} found`}
              <Collection
                type="list"
                items={ladders}
                direction='column'
                justifyContent={'space-between'}
              >
                {(ladder, index) => (
                  <ItemCard
                    key={`${ladder.id}_list${ladder}`}
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
              </Collection>
            </>
          }
        </Flex>
        <Flex direction={"column"} >
          <div id="map" style={{ minHeight: '400px', minWidth: '400px', border: '1px solid black' }}></div>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SearchPage