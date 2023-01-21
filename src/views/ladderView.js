import React, { useEffect } from "react";
import { ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling


const LadderView = () => {

    useEffect(() => {
        async function initializeMap() {
            // const el = document.createElement("div");
            // el.setAttribute("id", "map");
            const container = await document.getElementById("mapcontainer")
            if (container) {
                console.log(container)
                //container.appendChild(el);
                const map = await createMap({
                    container: "mapcontainer",
                    center: [-121.7512721677313, 38.55811189268456], // [Longitude, Latitude]
                    zoom: 13,
                })
                console.log(map)
                map.addControl(createAmplifyGeocoder());
            }
            //     const geocoder = createAmplifyGeocoder();
            // document.getElementById("map").appendChild(geocoder.onAdd())
        }

        initializeMap();
    }, [])
    const point = {lat: 38.55811189268456, lon: -121.7512721677313}
    //lf.CreateLadder({name: "<None>", geoData: point, city: "Davis, CA", zip: '95616'})
    // lf.AddPlayerToLadder({id:'5eb69653-8f4b-42f7-a322-1075b5700f94'}, {id:'bb62b979-4f2b-4e86-a357-c921c8d1bfe8'} )

    return (
        <>
            <div id="mapcontainer" style={{ height: '500px' }}></div>
            Ladders
        </>
    )
}

export default LadderView