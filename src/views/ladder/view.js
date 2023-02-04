import React, { useEffect } from "react";
import { ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { Button } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";


const LadderView = () => {

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
    // const point1 = {lat: 38.54422591158026, lon: -121.74365619216327}
    // const point2 = {lat: 38.544503705511694, lon: -121.75123751808259}
    // lf.CreateLadder({name: "<None>", geoData: point2, city: "Everywhere", matchType: 'SINGLES', zip: '95616'})
    // lf.CreateLadder({name: "Davis 3.5 singles", geoData: point1, city: "Davis, CA", matchType: 'SINGLES', zip: '95616'})
    // lf.AddPlayerToLadder(
    //     {id:'5eb69653-8f4b-42f7-a322-1075b5700f94', email:'jonas@zooark.com'}, 
    //     {id:'efc35a20-a3b5-4652-9205-c25a7337ad83', name: 'Davis 3.5 singles'} 
    // )

    return (
        <>
            {/* <div id="mapcontainer" style={{ height: '500px' }}></div> */}
            <Button>Create new Ladder</Button>
            <Link to="/ladders/new" >Create new ladder</Link>
        </>
    )
}

export default LadderView