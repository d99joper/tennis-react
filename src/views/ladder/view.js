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
        // get id from url

        // display a ladder

        // join/leave ladder button (if you leave, you lose all your points but obviously keep your matches)
    }, [])
    

    return (
        <>
            
        </>
    )
}

export default LadderView