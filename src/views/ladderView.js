import React from "react";
//import { ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { ConsoleLogger } from "@aws-amplify/core";

async function initializeMap() {
    // const el = document.createElement("div");
    // el.setAttribute("id", "map");
    // document.body.appendChild(el);
//38.55811189268456, -121.7512721677313
    const map = await createMap({
        container: "map",
        center: [-121.7512721677313,38.55811189268456], // [Longitude, Latitude]
        zoom: 13,
    })
    console.log(map)
    map.addControl(createAmplifyGeocoder());

//     const geocoder = createAmplifyGeocoder();
// document.getElementById("map").appendChild(geocoder.onAdd())
}

initializeMap();

const LadderView = () => {

    //lf.CreateLadder({name: "Davis 4.0", location: "Davis, CA"})
   // lf.AddPlayerToLadder({id:'5eb69653-8f4b-42f7-a322-1075b5700f94'}, {id:'bb62b979-4f2b-4e86-a357-c921c8d1bfe8'} )
    
    return (
    <>
        <div id="map" style={{height: '500px'}}></div>
        Ladders
    </>
    )
}

export default LadderView