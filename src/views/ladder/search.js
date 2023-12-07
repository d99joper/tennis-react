import { Collection, Flex } from "@aws-amplify/ui-react"
import { Button, MenuItem, Select, Slider } from "@mui/material"
import { ladderAPI } from "api/services"
import { AutoCompletePlaces, ItemCard } from "components/forms"
import { enums, helpers } from "helpers"
import { useEffect } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

const LadderSearch = () => {
	const [radius, setRadius] = useState(15)
	const [matchType, setMatchType] = useState(enums.MATCH_TYPE.SINGLES)
	const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
	const [level, setLevel] = useState([2.0, 5.0])
	const [initialCity, setInitialCity] = useState('')
	const [scriptIsLoaded, setScriptIsLoaded] = useState(false)
	const [ladders, setLadders] = useState([])
	const [totalCount, setTotalCount] = useState(0)

	let map

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
			updateSearch(myLngLat)
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
		if(!myLngLat?.lat)
		myLngLat = mapCenter

		map = new window.google.maps.Map(document.getElementById("map"), {
			zoom: radius === 15 ? 10 : radius === 25 ? 9 : radius === 50 ? 8 : radius === 75 ? 7 : 7,
			center: myLngLat,
		});
		let filter = [
			...myLngLat ? [{ name: 'geo', point: myLngLat, radius: radius }] : [],
			...matchType ? [{ name: 'match_type', matchType: matchType }] : [],
			...level ? [{ name: 'level', level_min: level[0], level_max: level[1] }] : []
		]
		console.log(filter)
		ladderAPI.getLadders(filter).then((ladderResults) => {
			setLadders(ladderResults.ladders)
			setTotalCount(ladderResults.total_count)
			//console.log(ladderResults)
			// for each ladder, set a marker on the map
			ladderResults.ladders.forEach(l => {
				if(l.lng && l.lat) {
					new window.google.maps.Marker({
						position: {lat: parseFloat(l.lat), lng: parseFloat(l.lng)},
						map: map,
						title: l.name,
						icon: {
							url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png', 
							scaledSize: new window.google.maps.Size(40, 40), 
						}
					})
				}
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
		})
	}
	const handleRadiusChange = (event) => {
		setRadius(event.target.value)
	}

	return (
		<Flex direction={"row"} gap=".5rem">
			<Flex direction={"column"} gap="1rem" paddingTop={'1rem'} >
				<Flex direction={"column"}>
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
					<div style={{ width: '80%' }}>
						NTRP Level:  &nbsp;
						<Slider
							getAriaLabel={() => 'Level'}
							label="Level"
							min={2}
							max={6.5}
							step={0.5}
							value={level}
							onChange={(e) => setLevel(e.target.value)}
							marks={enums.LevelMarks}
							valueLabelDisplay="auto"
						/>
					</div>
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
					<div>
						<Button variant="contained" onClick={updateSearch}>Search</Button>
					</div>
				</Flex>
				<div id="map" style={{ minHeight: '400px', minWidth: '400px', border: '1px solid black' }}></div>
			</Flex>

			<Flex direction={"column"}>
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
			</Flex>
		</Flex>
	)
}

export default LadderSearch