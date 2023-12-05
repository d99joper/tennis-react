import { useRef, useEffect, useState } from "react"
import "./AutocompletePlaces.css"
import { Flex } from "@aws-amplify/ui-react"
import { Button, MenuItem, Select } from "@mui/material"

const AutoCompletePlaces = ({ onPlaceChanged, ...props }) => {
  const [radius, setRadius] = useState(15)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const autoCompleteRef = useRef()
  const inputRef = useRef()
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location", "name", "formatted_address", "url"], //"address_components", 
    types: ['(cities)'],
  }
  let map

  function updateSearch() {//lat = 38.55, lng = -121.73) {
    //const myLatLng = { lat: lat, lng: lng };
    map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: radius === 15 ? 12 : radius === 25 ? 11 : radius === 50 ? 10 : 9,
      center: mapCenter,
    });

    onPlaceChanged(mapCenter, radius)

    new window.google.maps.Marker({
      position: mapCenter,
      map,
      title: "Hello World!",
    });
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error)
      )
    })
  }

  async function initMap() {
    console.log('hello initMap')
    let myLngLat = {lat: 38.54422591158026, lng:-121.74365619216327}
    if (navigator.geolocation) {
      const position = await getCurrentPosition()
      console.log(position)
      myLngLat = { lat: position.coords.latitude, lng: position.coords.longitude }
      setMapCenter(myLngLat)
      // });
    } else {
      console.log("Geolocation is not supported by this browser. Set San Fran as default")
    }

    map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: myLngLat,
    });
  }
  window.initMap = initMap;

  useEffect(() => {
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
        setAutoCompleteRef()
      })

      return () => {
        // clean up the script when the component in unmounted
        //document.body.removeChild(script)
      }
    }
    else
      setAutoCompleteRef()

    function setAutoCompleteRef() {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      )
      autoCompleteRef.current.addListener("place_changed", async function () {
        const place = await autoCompleteRef.current.getPlace()
        console.log(place)
        setMapCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
      })
      //updateSearch()
    }
  }, [mapCenter])

  const handleChange = (event) => {
    setRadius(event.target.value)
  }

  function filterSearch() {
    updateSearch()
  }

  return (
    <Flex direction={"column"} gap="1rem" paddingTop={'1rem'} >
      <Flex direction={"column"}>
        <div>
          <label>City: </label>
          <input ref={inputRef} />
        </div>
        <div>
          Radius: &nbsp;
          <Select
            variant="standard"
            value={radius}
            id="radiusSelect"
            onChange={handleChange}
          >
            <MenuItem value={15}>15 miles</MenuItem>
            <MenuItem value={25}>25 miles</MenuItem>
            <MenuItem value={50}>50 miles</MenuItem>
            <MenuItem value={75}>75 miles</MenuItem>
            <MenuItem value={100}>100 miles</MenuItem>
          </Select>
        </div>
        <div>
          <Button onClick={filterSearch}>Search</Button>
        </div>
      </Flex>
      <div id="map" style={{ minHeight: '500px', minWidth: '600px', border: '1px solid black' }}></div>
    </Flex>
  )
}
export default AutoCompletePlaces

