import React, { useEffect, useState } from "react";
import { helpers, ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
//import { Marker, Popup } from 'react-map-gl';
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { MapView, Button, Grid, TabItem, Tabs, LocationSearch, Collection } from "@aws-amplify/ui-react";
import { ScaleControl, NavigationControl, GeolocateControl, CircleLayer } from 'react-map-gl';
import { Geo } from "aws-amplify"
import { Link } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import "./ladder.css"
import MarkerWithPopup from "components/layout/MarkerWithPopup";
import { ItemCard } from "components/forms";
import mapboxgl from "!mapbox-gl";


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

    function updateMap(e) {
        const map = e.target
        let radius = Math.min(
            Math.max(
                Math.ceil(6500/Math.pow(2,(map?.transform?.tileZoom ?? 9)-1)),
                15 // this is the min radius
            ),
            700) // this is the max radius
        console.log("radius", radius)
        console.log(map.getCenter())

        map.addLayer({
            id: "ladder-circle",
            type: "circle",
            source: {type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: {
                        type: 'Feature',
                        properties: { id: '1', radius: radius },
                        geometry: {
                        type: 'Point',
                        coordinates: map.getCenter(),
                        },
                    },
            }},
            paint: {
                "circle-color": "#ffff00",
                "circle-radius": radius,
                "circle-stroke-color": "#333333",
                "circle-stroke-width": 2,
            }
        })
        lf.FindNearByLadders(map.getCenter(), radius).then(r => {
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
                    <LocationSearch minLength='4' types={"locality"} countries='USA, SWE' showIcon='false' placeholder='City' />

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
        </Grid>
    )
}

export default LadderSearch