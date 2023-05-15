import React, { useEffect } from "react";
import { enums, ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { Button, Flex, Grid, LocationSearch } from "@aws-amplify/ui-react";
import "./ladder.css"
import { Geo } from "aws-amplify"
import { useState } from "react";
import { Autocomplete, TextField, Slider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LadderCreate = () => {

    let navigate = useNavigate()

    useEffect(() => {

    }, [])
    console.log("Ladder Create")

    const [location, setLocation] = useState({ name: '', id: -1 })
    const [places, setPlaces] = useState()
    const [level, setLevel] = useState([2.0, 6.5])
    

    // const geocoder = createAmplifyGeocoder();
    // document.getElementById("search").appendChild(geocoder.onAdd());

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
    const options = {
        types: ['locality'],
        countries: ['USA'],
        placeholder: 'City',
        minLength: 4
    }

    //console.log(geoTest)
    function onCreate(e) {
        e.preventDefault();

        const form = new FormData(e.target);

        const ladder = {
            name: form.get("name"),
            city: location.name,
            description: form.get("description"),
            level: {min: level[0], max: level[1]},
            location: location.point,
            zip: location.zip,
            matchType: form.get("matchType")
        }
        console.log(ladder)
        //ask to confirm
        if (window.confirm("Are you sure you want to create this ladder?"))
            lf.CreateLadder(ladder).then((id) => {
                navigate('/ladders/'+id)
            })
    }

    function createOtherLadder() {
        const point1 = { lat: 38.54422591158026, lon: -121.74365619216327 }
        const point2 = { lat: 38.544503705511694, lon: -121.75123751808259 }
        lf.CreateLadder({ id: -1, name: "<None>", description: "A ladder for matches that don't belong to any other ladder. A good repository for friendly matches, or USTA matches.", level: {min:1.0, max:7.0},  location: point2, city: "Everywhere", matchType: 'SINGLES', zip: '95616' })

        // lf.CreateLadder({name: "Davis 3.5 singles", location: point1, city: "Davis, CA", matchType: 'SINGLES', zip: '95616'})
        // lf.AddPlayerToLadder(
        //     {id:'5eb69653-8f4b-42f7-a322-1075b5700f94', email:'jonas@zooark.com'}, 
        //     {id:'efc35a20-a3b5-4652-9205-c25a7337ad83', name: 'Davis 3.5 singles'} 
        // )
    }

    function handleChange(event, numbers) {
        console.log(numbers)
        setLevel(numbers)
    }

    return (
        <>
            Create a new ladder
            <Grid as="form"
                gap="1rem"
                width={300}
                onSubmit={onCreate}
            >
                <div className="form-group">
                    {/* <label for="name">Name:</label> */}
                    <input type="text" name="name" placeholder="Name" required />
                </div>
                <div className="form-group">
                    {/* <label for="name">Name:</label> */}
                    <input type="text" name="description" placeholder="Description" required />
                </div>
                <div className="form-group">
                    <Slider
                        getAriaLabel={()=>'Level'}
                        label="Level"
                        min={2}  
                        max={6.5}  
                        step={0.5}
                        value={level}
                        onChange={handleChange}
                        disableSwap
                        marks={enums.LevelMarks}
                        valueLabelDisplay="auto"
                    />
                </div>
                <div className="form-group">
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
                </div>
                <div className="form-group">
                    <label>Type:</label>
                    <select name="matchType" id="matchType">
                        <option value="SINGLES">Singles</option>
                        <option value="DOUBLES">Doubles</option>
                    </select>
                </div>
                <Button type="submit" variation="primary">
                    Create
                </Button>
            </Grid>

            {/* <Button onClick={createOtherLadder}>Create Other Ladder</Button> */}
        </>
    )
}

export default LadderCreate