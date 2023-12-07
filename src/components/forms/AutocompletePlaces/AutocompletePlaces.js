import { useRef, useEffect } from "react"
import "./AutocompletePlaces.css"

const AutoCompletePlaces = ({ onPlaceChanged, initialCity, scriptIsLoaded, ...props }) => {
  const autoCompleteRef = useRef()
  const inputRef = useRef()
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location", "name", "formatted_address", "url"], //"address_components", 
    types: ['(cities)'],
  }

  function setAutoCompleteRef() {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    )

    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace()
      //console.log(place)
      onPlaceChanged({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
    })
  }

  useEffect(() => {
    if (scriptIsLoaded)
      setAutoCompleteRef()

    inputRef.current.value = initialCity

  }, [initialCity])

  return (
    <div>
      <label>City: </label>
      <input ref={inputRef} />
    </div>
  )
}
export default AutoCompletePlaces

