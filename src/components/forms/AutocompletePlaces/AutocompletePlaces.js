import { useRef, useEffect } from "react"
import "./AutocompletePlaces.css"

const AutoCompletePlaces = () => {
  const autoCompleteRef = useRef()
  const inputRef = useRef()
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location", "name", "formatted_address", "url"], //"address_components", 
    types: ['(cities)'],
  }

  function updateMap(lat=38.55, lng=-121.73) {
    const myLatLng = { lat: lat, lng: lng };
    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: myLatLng,
    });
  
    new window.google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
    });
  }
  
  //window.initMap = initMap;

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    )
    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace()
      console.log(place)
      
      updateMap(place.geometry.location.lat(),place.geometry.location.lng())
      console.log(place)
    })
    updateMap()
  }, [])
  return (
    <div>
      <label>enter address: </label>
      <input ref={inputRef} />
      <div id="map" style={{minHeight: '500px', minWidth: '600px', border: '1px solid black'}}></div>
    </div>
  )
}
export default AutoCompletePlaces

