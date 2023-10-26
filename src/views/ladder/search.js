import React, { useEffect, useState } from "react";
import { enums, helpers, ladderFunctions as lf } from "helpers";
import { createMap, drawPoints, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
//import { Marker, Popup } from 'react-map-gl';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-map.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { Button, Grid, TabItem, Tabs, Collection, Flex } from "@aws-amplify/ui-react";
import { LocationSearch, MapView } from "@aws-amplify/ui-react-geo";
import { ScaleControl, NavigationControl, GeolocateControl, CircleLayer, Source, Layer } from 'react-map-gl';
import { Geo } from "aws-amplify"
import { Link } from "react-router-dom";
import { Autocomplete, Slider, TextField } from "@mui/material";
import "./ladder.css"
import MarkerWithPopup from "components/layout/MarkerWithPopup";
import { ItemCard } from "components/forms";
//import mapboxgl from "mapbox-gl";


const LadderSearch = () => {

    const [{ latitude, longitude }, setMarkerLocation] = useState({
        latitude: 40,
        longitude: -100,
    });

    const [level, setLevel] = useState([2.0, 6.5])
    //const updateMarker = () => setMarkerLocation({ latitude: latitude + 5, longitude: longitude + 5 });

    // use SF as default location
    const SAN_FRANCISCO = {
        latitude: 37.774,
        longitude: -122.431,
    }

    //const [location, setLocation] = useState({ name: '', id: -1 })
    const [mapCenter, setMapCenter] = useState({ SAN_FRANCISCO })
    // Circle data for the map, then just change the coordinates for a new circle
    const [circleData, setCircleData] = useState({
        type: 'Feature',
        properties: { id: 1, radius: 10 },
        geometry: {
            type: 'Point',
            coordinates: [SAN_FRANCISCO.longitude, SAN_FRANCISCO.latitude]
        }
    })

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
                    setCircleData(prev => ({
                        ...prev,
                        geometry: { type: 'Point', coordinates: [x.coords.longitude, x.coords.latitude] },
                        properties: { id: 1, radius: 100 }
                    }))
                });
            } else {
                console.log("Geolocation is not supported by this browser. Set San Fran as default")
            }
        }
        getLocation()

    }, [])

    function updateMap(e) {
        const map = e.target

        let radius = Math.min(
            Math.max(
                Math.ceil(6500 / Math.pow(2, (map?.transform?.tileZoom ?? 9) - 1)),
                15 // this is the min radius
            ),
            700) // this is the max radius
        console.log("radius", radius)
        console.log(map.getCenter())
        setCircleData(prev => ({
            ...prev,
            geometry: { type: 'Point', coordinates: [map.getCenter().lng, map.getCenter().lat] },
            properties: { id: 1, radius: 270 }
        }))

        lf.FindNearByLadders(map.getCenter(), radius).then(r => {
            //console.log(r)
            setLadders({ ladders: r.ladders, count: r.count })
            let points =
                r.ladders.map(ladder => {
                    return {
                        coordinates: [ladder.location.lon, ladder.location.lat],
                        title: ladder.name,
                        address: ladder.description
                    }
                })
            // if(map.getSource('mySourceName')) {
            //     map.removeLayer('mySourceName-layer-clusters')//mySourceName-layer-unclustered-point
            //     map.removeLayer('mySourceName-layer-cluster-count')
            //     map.removeLayer('mySourceName-layer-unclustered-point')
            //     map.removeSource('mySourceName')
            //     //mySourceName-layer-clusters
            // }
            // drawPoints("mySourceName", // Arbitrary source name
            //     points, // [
            //     //     {
            //     //         coordinates: [ladder.location.lon, ladder.location.lat], // [Longitude, Latitude]
            //     //         title: "Golden Gate Bridge",
            //     //         address: "A suspension bridge spanning the Golden Gate",
            //     //     },
            //     //     // {
            //     //     //     coordinates: [- 122.4770, 37.8105], // [Longitude, Latitude]
            //     //     // },
            //     // ], // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
            //     map,
            //     {
            //         showCluster: true,
            //         unclusteredOptions: {
            //             showMarkerPopup: true,
            //         },
            //         clusterOptions: {
            //             showCount: true,
            //         },
            //     }
            // );
        })
    }

    // function handleSearch(e) {
    //     const searchText = e.target.value
    //     if (searchText.length <= 2) return
    //     console.log(searchText)
    //     Geo.searchByText(
    //         //Geo.searchForSuggestions(
    //         searchText,
    //         searchOptionsWithBiasPosition
    //     ).then((result) => {
    //         let counter = 0;
    //         console.log(result)
    //         let ps = result.map((p) => {
    //             let place = {
    //                 id: counter,
    //                 name: p.label.substring(0, p.label.lastIndexOf(',')),
    //                 point: { lon: p.geometry.point[0], lat: p.geometry.point[1] },
    //                 zip: p.postalCode
    //             }
    //             counter++
    //             return place
    //         })
    //         console.log(ps)
    //         setLadders(ps)
    //         // get list of places close to this

    //     })
    // }

    const circleLayer = {
        id: 'circle-layer',
        type: 'circle',
        paint: {
            'circle-color': '#55FF88', // Circle color (red in this example)
            'circle-radius': {
                type: 'identity',
                property: 'radius',
            },
            'circle-opacity': 0.3,
        },
    };

    const circleSource = {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [circleData],
        },
    }

    return (
        <Flex direction={"row"}>

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
                            footer={<>
                                {`${item.players?.items?.length ?? 0} players`}<br />
                                {`${item.matches?.items?.length ?? 0} matches`}
                            </>
                            }
                            header={
                                item.name ?
                                    <Link to={`/ladders/${item.id}`}>{item.name}</Link>
                                    : 'No ladder found'
                            }
                            description={item.description ?? ''}
                            footerRight={`Level: ${helpers.intToFloat(item.level.min)}${item.level.max !== item.level.min ? '-' + helpers.intToFloat(item.level.max) : ''}`}
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
            <Flex
                maxWidth={'300px'}
                marginTop={20}
                direction={'column'}
                gap={'2rem'}
            >
                <div>Search:</div>
                <div>
                    <LocationSearch minLength='4' types={"place"} limit="1" countries='USA, SWE' showIcon='false' placeholder='City' />
                </div>
                <div>
                    <input type="text" placeholder="Name"></input>
                </div>
                <div style={{maxWidth: '400px'}}>
                    {`Level ${level[0].toFixed(1)}-${level[1].toFixed(1)}`}
                    <Slider
                        getAriaLabel={() => 'Level'}
                        label="Level"
                        min={2}
                        max={6.5}
                        step={0.5}
                        value={level}
                        onChange={(e, num) => setLevel(num)}
                        disableSwap
                        marks={enums.LevelMarks}
                        valueLabelDisplay="auto"
                    />
                </div>
                <div>
                    <Button variation="primary">Search</Button>
                </div>
                <div id="mapContainer" className="mapContainer" >
                    <MapView
                        initialViewState={{
                            latitude: mapCenter.latitude,
                            longitude: mapCenter.longitude,
                            zoom: 9
                        }}
                        minZoom={4}
                        maxZoom={13}
                        onZoomEnd={updateMap}
                        onDragEnd={updateMap}
                        onLoad={updateMap}
                    //onSourceData={updateMarkers}
                    >
                        <GeolocateControl position="bottom-right" />
                        <ScaleControl zoom={10} unit="km" />
                        <NavigationControl position="bottom-right" showCompass={false} />
                        {/* <LocationSearch minLength='4' types={"locality"} countries='USA, SWE' showIcon='false' placeholder='City' /> */}
                        {/* <Source id="circle-source" type="geojson" cluster={true} data={circleSource.data}>
                        <Layer {...circleLayer} source="circle-source" />
                    </Source> */}
                        {ladders?.map(l => {
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
            </Flex>
        </Flex>
    )
}

export default LadderSearch