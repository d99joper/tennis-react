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
  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    )
    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace()
      console.log({ place })
    })
  }, [])
  return (
    <div>
      <label>enter address: </label>
      <input ref={inputRef} />
    </div>
  )
}
export default AutoCompletePlaces

