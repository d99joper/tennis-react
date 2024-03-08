import { useEffect, useRef, useState } from "react"
import { Box, Button, Checkbox, Container, Grid, TextField, Typography } from "@mui/material"
import "./court.css"
import { AutoCompletePlaces, ErrorHandler } from "components/forms"
import { helpers } from "helpers"
import { courtAPI } from "api/services"

const CreateCourt = ({ newItem = '', callback, ...props }) => {
  let mapsApi
  const [marker, setMarker] = useState(null)
  const [lngLat, setLngLat] = useState(null)
  const [city, setCity] = useState(null)
  const [zip, setZip] = useState(null)
  const mapRef = useRef(null)
  const [focusName, setFocusName] = useState(newItem !== '')
  const [errorMessage, setErrorMessage] = useState('')
  const [name, setName] = useState(newItem)
  const [infoText, setInfoText] = useState('Court submitted successfully')

  useEffect(() => {
    async function setMap() {
      mapsApi = await helpers.loadGoogleMapsAPI()
      if (!mapRef.current) {
        const getCurrentLocation = () => {
          return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  resolve(position)
                },
                (error) => {
                  resolve(null)
                  //reject(error)
                }
              );
            } else {
              resolve(null)
              //reject(new Error('Geolocation is not supported by this browser.'));
            }
          })
        }
        // get the user's coordinates
        const point = await getCurrentLocation()
        mapRef.current = new mapsApi.Map(document.getElementById('map'), {
          center: { lat: point?.coords?.latitude ?? 38, lng: point?.coords?.longitude ?? -121 },
          zoom: 8,
        })
      }
      const fetchPlaceDetails = (latLng, callback) => {
        const geocoder = new mapsApi.Geocoder();

        // Define geocode request parameters
        const request = {
          location: latLng
        };

        // Perform reverse geocoding
        geocoder.geocode(request, (results, status) => {
          if (status === mapsApi.GeocoderStatus.OK && results.length > 0) {
            callback(results[0]);
          } else {
            console.error('Error fetching address details:', status);
            callback(null);
          }
        });
      };


      mapRef.current.addListener('click', (event) => {
        console.log(event)
        // Extract clicked coordinates
        const clickedLat = event.latLng.lat()
        const clickedLng = event.latLng.lng()

        setLngLat({ lat: clickedLat, lng: clickedLng })

        fetchPlaceDetails({ lat: clickedLat, lng: clickedLng }, (place) => {
          if (place) {
            const addressComponents = place.address_components;
            let city = '';
            let zip = '';

            // Extract city and zip from address components
            addressComponents.forEach((component) => {
              if (component.types.includes('locality')) {
                city = component.long_name;
              } else if (component.types.includes('postal_code')) {
                zip = component.long_name;
              }
            });

            console.log('City:', city);
            console.log('Zip Code:', zip);
            setCity(city)
            setZip(zip)
          }
        });


        if (marker) {
          console.log('update marker')
          marker.setPosition({ lat: clickedLat, lng: clickedLng })
        }
        else {
          console.log('make marker')
          // Create marker at clicked coordinates
          const testMarker = new mapsApi.Marker({
            position: { lat: clickedLat, lng: clickedLng },
            map: mapRef.current,
            title: 'Clicked Location',
          })
          setMarker(testMarker)
        }


        // You can use clickedLat and clickedLng as needed, for example, save them to state or perform other actions
        console.log('Clicked Latitude:', clickedLat);
        console.log('Clicked Longitude:', clickedLng);
      });
    }
    setMap()
  }, [marker])

  function createCourt(e) {
    e.preventDefault()

    if (!marker) {
      setInfoText('Please add a marker to the map.')
      showNotification(true)
      return
    }
    const form = new FormData(document.getElementById('courtForm'))
    const name = form.get("name")
    if (name === '') {
      setInfoText('The name is required')
      showNotification(true)
      return
    }

    const data = {
      name: form.get("name"),
      description: form.get("description"),
      has_lights: form.get("hasLights") === 'on',
      is_public: form.get("isPublic") === 'on',
      number_of_courts: form.get('noCourts'),
      lat: lngLat?.lat ?? 0,
      lng: lngLat?.lng ?? 0,
      //latLng: lngLat,
      city: city,
      zipcode: zip
    }
    
    courtAPI.createCourt(data).then((response) => {
      if (response.error) {
        setErrorMessage(response.message)
      } else {
        if (callback)
          callback({ id: response.id, name: response.name })
        // showSuccess
        setInfoText('Court submitted successfully')
        showNotification()
        resetForm()
      }
    })
  }

  function resetForm() {
    setName('')
    const form = document.getElementById('courtForm')
    form.reset()
    setMarker(null)
  }

  // Function to show notification for a certain duration
  function showNotification(isError) {
    const notification = document.getElementById('notification')
    //notification.style.display = 'block';
    notification.classList.add('show')
    if (isError)
      notification.classList.add('error')

    setTimeout(() => {
      notification.classList.remove('show')
      if (isError)
        notification.classList.remove('error')
    }, 5000); // Duration in milliseconds (10 seconds)
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom onClick={() => showNotification()}>Create Court</Typography>

      <div id="notification" className="notification">
        {infoText}
      </div>

      <form
        id="courtForm"
        className="create-court-form"
        //onSubmit={(e) => createCourt(e)} 
        onFocus={() => setFocusName(false)} >

        <TextField
          name="name"
          label="Name"
          fullWidth
          required
          value={name}
          autoFocus={focusName}
          onBlur={() => setFocusName(false)}
          onFocus={() => setFocusName(true)}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField name="description" label="Description" multiline rows={4} fullWidth />
        <div id='map' style={{ width: '100%', height: '50vh', border: '1px solid grey' }}></div>
        {/* <AutoCompletePlaces
          label="City"
          fullWidth
          required
          onPlaceChanged={() => { }}
          showGetUserLocation={true}
        /> */}
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Checkbox name="hasLights" label="Has Lights" /> Has lights
          </Grid>
          <Grid item>
            <Checkbox name="isPublic" label="Open to the public" /> Courts are open to the public
          </Grid>
          <Grid item>
            <TextField name="noCourts" type='number' label="Number of courts" />
          </Grid>
          <Grid item>
            <Button variant="contained" type="button" onClick={(e) => createCourt(e)} color="primary">Submit</Button>
          </Grid>
        </Grid>
        <ErrorHandler error={errorMessage} />
      </form>
    </Container>
  )
}

export default CreateCourt