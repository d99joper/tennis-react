import React, { useEffect, useState } from "react";
import { ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { MapView, Button, TabItem, Tabs, LocationSearch } from "@aws-amplify/ui-react";
import { Geo } from "aws-amplify"
import { Link } from "react-router-dom";
import { Grid, Autocomplete, TextField } from "@mui/material";
import "./ladder.css"


const LadderSearch = () => {

    // const map = {}

    // async function initializeMap() {
    //     const el = document.createElement("div");
    //     el.setAttribute("id", "map");
    //     document.body.appendChild(el);

    //     map = await createMap({
    //         container: "map",
    //         center: [-123.1187, 49.2819], // [Longitude, Latitude]
    //         zoom: 11,
    //     })

    //     map.addControl(createAmplifyGeocoder());
    // }

    // initializeMap();

    const [location, setLocation] = useState({ name: '', id: -1 })
    const [places, setPlaces] = useState([])
    const SAN_FRANCISCO = {
        latitude: 37.774,
        longitude: -122.431,
    }
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

    function handleSearch(e) {
        const searchText = e.target.value
        if (searchText.length <= 2) return
        console.log(searchText)
        Geo.searchByText(
            //Geo.searchForSuggestions(
            searchText,
            searchOptionsWithBiasPosition).then((result) => {
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
                setPlaces(ps)
                // get list of places close to this 
            }
            )
    }

    // useEffect(() => {
    //     async function initializeMap() {
    //         // const el = document.createElement("div");
    //         // el.setAttribute("id", "map");
    //         const container = await document.getElementById("mapcontainer")
    //         if (container) {
    //             //console.log(container)
    //             //container.appendChild(el);
    //             const map = await createMap({
    //                 container: "mapcontainer",
    //                 center: [-121.7512721677313, 38.55811189268456], // [Longitude, Latitude]
    //                 zoom: 13,
    //             })
    //             //console.log(map)
    //             map.addControl(createAmplifyGeocoder());
    //         }
    //         // const geocoder = createAmplifyGeocoder();
    //         // document.getElementById("map").appendChild(geocoder.onAdd())
    //     }

    //     initializeMap();
    // }, [])


    return (
        <>
            <Tabs defaultIndex={0}
                justifyContent="flex-start">
                <TabItem title="Map search">
                    <div id="mapcontainer" >
                        <MapView
                            initialViewState={{
                                latitude: 37.8,
                                longitude: -122.4,
                                zoom: 14,
                                width: 100
                            }}
                        >
                            <LocationSearch minLength='4' types={"locality"} countries='USA, SWE' showIcon='false' placeholder='City' />
                        </MapView>

                    </div>
                </TabItem>
                <TabItem title="Text search">
                    <Grid>
                        <div className="form-group">
                            <LocationSearch proximity={SAN_FRANCISCO} minLength='2' types={"locality"} countries='USA, SWE' showIcon='false' placeholder='City' />
                        </div>
                        <Autocomplete
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
                        />
                    </Grid>
                </TabItem>
            </Tabs>
            <div id="searchResults">
                List results here
            </div>
            If you can't find a suitable ladder, you can <Link to="/ladders/new">create new ladder</Link>
        </>
    )
}

export default LadderSearch