const loadGoogleMapsScript = (callback) => {

  if (window.google && window.google.maps) {
    callback() // Execute the callback directly
    return
  }

  let script = document.getElementById("placesScript")


  if (!script) {
    console.log('load the script')
    // Define a dummy initMap function
    window.initMap = () => {}
    script = document.createElement("script");
    const apiKey = process.env.REACT_APP_PLACES_API_KEY

    script.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      apiKey +
      "&libraries=places&callback={initMap}"
    script.id = "placesScript"
    script.async = false
    script.crossOrigin = "anonymous"

    document.body.appendChild(script)

    script.addEventListener("load", () => {
      console.log('script is loaded, callback', window.google.maps)
      callback() // Call the provided callback after the script is loaded
    })
    //script.addEventListener("load", callback);
    script.addEventListener("readystatechange", function () {
      if (script.readyState === "complete" || script.readyState === "loaded") {
        callback();
      }
    });
  }
}

export default loadGoogleMapsScript