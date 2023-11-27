import { useRef, useEffect } from "react"
import "./AutocompletePlaces.css"
import { Flex } from "@aws-amplify/ui-react"

const AutoCompletePlaces = ({ onPlaceChanged, ...props }) => {
  const autoCompleteRef = useRef()
  const inputRef = useRef()
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location", "name", "formatted_address", "url"], //"address_components", 
    types: ['(cities)'],
  }
  let map

  function updateMap(lat = 38.55, lng = -121.73) {
    const myLatLng = { lat: lat, lng: lng };
    map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: myLatLng,
    });

    onPlaceChanged(myLatLng)

    new window.google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
    });
  }

  function initMap() {
    console.log('hello initMap')
    map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: { lat: 38, lng: -121 },
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
      console.log(script)
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

        updateMap(place.geometry.location.lat(), place.geometry.location.lng())
      })
      updateMap()
    }
  }, [])

  return (
    <Flex direction={"column"} gap="1rem">
      <div>
        <label>enter address: </label>
        <input ref={inputRef} />
      </div>
      <div id="map" style={{ minHeight: '500px', minWidth: '600px', border: '1px solid black' }}></div>
    </Flex>
  )
}
export default AutoCompletePlaces

