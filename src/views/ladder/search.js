import React, { useEffect, useState } from "react";
import { helpers, ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import { Marker, Popup } from 'react-map-gl';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { MapView, Button, Grid, TabItem, Tabs, LocationSearch, Collection } from "@aws-amplify/ui-react";
import { ScaleControl, NavigationControl, GeolocateControl } from 'react-map-gl';
import { Geo } from "aws-amplify"
import { Link } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import "./ladder.css"
import MarkerWithPopup from "components/layout/MarkerWithPopup";
import { ItemCard } from "components/forms";


const LadderSearch = () => {

    const [{ latitude, longitude }, setMarkerLocation] = useState({
        latitude: 40,
        longitude: -100,
    });

    const updateMarker = () =>
        setMarkerLocation({ latitude: latitude + 5, longitude: longitude + 5 });



    const SAN_FRANCISCO = {
        latitude: 37.774,
        longitude: -122.431,
    }
    const [location, setLocation] = useState({ name: '', id: -1 })
    const [mapCenter, setMapCenter] = useState({ SAN_FRANCISCO })
    const [{ ladders, count }, setLadders] = useState({ ladders: [], count: 0 })
    const searchOptionsWithBiasPosition = {
        countries: ['USA'], // Alpha-3 country codes
        maxResults: 10, // 50 is the max and the default
        types: ['locality'],
        biasPosition: [
            -121.74365619216327,
            38.54422591158026
        ], // Coordinates point to act as the center of the search
        minLength: 2
        //searchAreaConstraints: [SWLongitude, SWLatitude, NELongitude, NELatitude], // Bounding box to search inside of
        //searchIndexName:  the string name of the search index
    }

    useEffect(() => {
        console.log(ladders)
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(x => {
                    setMapCenter({ latitude: x.coords.latitude, longitude: x.coords.longitude })
                });
            } else {
                console.log("Geolocation is not supported by this browser. Set San Fran as default")
            }
        }
        getLocation()
    }, [])

    function updateMarkers(e) {
        const map = e.target
        if (e.isSourceLoaded && !map._zooming) {
            // console.log(e)
            // console.log("_zooming", map._zooming)
            // console.log("loaded", map.loaded())
            // console.log("isZooming", map.isZooming())
            //map.setZoom(12)
            console.log(map.getCenter())
            lf.FindNearByLadders(map.getCenter()).then(r => {
                //console.log(r)
                setLadders({ ladders: r.ladders, count: r.count })
                r.ladders.forEach(ladder => {
                    // const marker = new maplibregl.Marker({
                    //     color: 'greem',
                    //     draggable: true
                    // }).setLngLat([ladder.location.lon + 1, ladder.location.lat + 1])
                    //     .addTo(map)
                    //console.log(marker)
                })
            })
        }
    }

    function handleSearch(e) {
        const searchText = e.target.value
        if (searchText.length <= 2) return
        console.log(searchText)
        Geo.searchByText(
            //Geo.searchForSuggestions(
            searchText,
            searchOptionsWithBiasPosition
        ).then((result) => {
            let counter = 0;
            console.log(result)
            let ps = result.map((p) => {
                let place = {
                    id: counter,
                    name: p.label.substring(0, p.label.lastIndexOf(',')),
                    point: { lon: p.geometry.point[0], lat: p.geometry.point[1] },
                    zip: p.postalCode
                }
                counter++
                return place
            })
            console.log(ps)
            setLadders(ps)
            // get list of places close to this

        })
    }

    return (
        <>
            <Tabs defaultIndex={0}
                justifyContent="flex-start">
                <TabItem title="Map search">
                    <Grid templateColumns={'2fr auto'}>

                        <div className="collectionContainer">
                            <Collection
                                type="list"
                                items={ladders}
                                direction='column'
                                justifyContent={'space-between'}
                            >
                                {(item, index) => (
                                    <ItemCard
                                        key={`${item.id}_list${index}`}
                                        footer={`${item.players.length ?? 0} players`}
                                        header={item.name ?? 'No ladder found'}
                                        description={item.description ?? ''}
                                        footerRight={`Level: ${helpers.intToFloat(item.level.min)}${item.level.max !== item.level.min ? '-'+helpers.intToFloat(item.level.max) :''}`}
                                    />
                                )}
                            </Collection>
                            <p>
                                <span>
                                    Can't find a suitable ladder?
                                    <Link to="/ladders/new">
                                        <Button>Create a new ladder</Button>
                                    </Link>
                                </span>
                            </p>
                        </div>
                        <div id="mapContainer" className="mapContainer" >
                            <MapView
                                initialViewState={{
                                    latitude: mapCenter.latitude,
                                    longitude: mapCenter.longitude,
                                    zoom: 10
                                }}
                                onSourceData={updateMarkers}
                            >
                                <GeolocateControl position="bottom-right" />
                                <ScaleControl />
                                <NavigationControl position="bottom-right" showCompass={false} />
                                <LocationSearch minLength='4' types={"locality"} countries='USA, SWE' showIcon='false' placeholder='City' />

                                {ladders.map(l => {
                                    return (
                                        <MarkerWithPopup
                                            key={`${l.id}_marker`}
                                            latitude={l.location.lat}
                                            longitude={l.location.lon}
                                            ladder={l}
                                        />
                                    )
                                })}
                            </MapView>
                        </div>
                    </Grid>
                </TabItem>
                <TabItem title="Text search">
                    <Grid>
                        <div className="form-group">
                            <LocationSearch proximity={mapCenter} minLength='2' types={"locality"} countries='USA, SWE' showIcon='false' placeholder='City' />
                        </div>
                        {/* <Autocomplete
                            id="city"
                            name="city"
                            required
                            options={!places ? [{ name: 'Loading...', id: -1 }] : places}
                            autoSelect={true}
                            onChange={(e, value) => { setLocation(value) }}
                            getOptionLabel={option => option.name}
                            value={location}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                                <div className="form-group">
                                    <TextField {...params} label="city" type="text" name="city" placeholder="City" onChange={handleSearch} required />
                                </div>
                            )}
                        /> */}
                    </Grid>
                </TabItem>
            </Tabs>
            
        </>
    )
}

export default LadderSearch