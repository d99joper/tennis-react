import React, { useEffect } from "react";
import { ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { Button } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";


const LadderSearch = () => {

    useEffect(() => {
        // async function initializeMap() {
        //     // const el = document.createElement("div");
        //     // el.setAttribute("id", "map");
        //     const container = await document.getElementById("mapcontainer")
        //     if (container) {
        //         //console.log(container)
        //         //container.appendChild(el);
        //         const map = await createMap({
        //             container: "mapcontainer",
        //             center: [-121.7512721677313, 38.55811189268456], // [Longitude, Latitude]
        //             zoom: 13,
        //         })
        //         //console.log(map)
        //         map.addControl(createAmplifyGeocoder());
        //     }
        //     // const geocoder = createAmplifyGeocoder();
        //     // document.getElementById("map").appendChild(geocoder.onAdd())
        // }

        // initializeMap();
    }, [])
    

    return (
        <>
            {/* <div id="mapcontainer" style={{ height: '500px' }}></div> */}
            
            <Link to="/ladders/new" >Create new ladder</Link>
        </>
    )
}

export default LadderSearch