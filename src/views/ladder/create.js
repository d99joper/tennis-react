import React, { useEffect } from "react";
import { ladderFunctions as lf } from "helpers";
import { createMap, createAmplifyGeocoder } from "maplibre-gl-js-amplify";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import { Button, Flex, LocationSearch } from "@aws-amplify/ui-react";
import "./ladder.css"
import { Geo } from "aws-amplify"
import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

const LadderCreate = () => {

    useEffect(() => {
   
    }, [])
    console.log("Ladder Create")

    const [city, setCity] = useState({name:'', id: -1})
    const [places, setPlaces] = useState([])
    // const geocoder = createAmplifyGeocoder();
    // document.getElementById("search").appendChild(geocoder.onAdd());

    const searchOptionsWithBiasPosition = {
        countries: ['USA'], // Alpha-3 country codes
        maxResults: 10, // 50 is the max and the default
        //types: ['locality'],
        biasPosition: [
          -121.74365619216327,
          38.54422591158026
        ], // Coordinates point to act as the center of the search
        maxLength: 4
        //searchAreaConstraints: [SWLongitude, SWLatitude, NELongitude, NELatitude], // Bounding box to search inside of
        //searchIndexName:  the string name of the search index
      }

      //console.log(geoTest)
      function onCreate(e) {
          e.preventDefault();
          
          const form = new FormData(e.target);
          
          const data = {
              name: form.get("name"),
              city: form.get("city"),
              zip: form.get("zip"),
            };
            console.log(data)
        }
        
        function handleSearch(e) {
            const searchText = e.target.value
            if(searchText.length <= 2) return 
            console.log(searchText)
            Geo.searchByText(
            //Geo.searchForSuggestions(
                searchText, 
                searchOptionsWithBiasPosition).then((result) => {
                let counter = 0;
                console.log(result)
                let ps = result.map((p) => {
                    let place = {name: p.municipality, id: counter}
                    counter++
                    return place
                })
                console.log(ps)
                setPlaces(ps)
            })
    }
    const options = {
        types: ['locality'],
        countries: ['USA'],
        placeholder: 'City',
        minLength: 4
    }

    return (
        <>
            Create a new ladder
            <Flex as="form"
                maxWidth='500px'
                direction="column"
                gap="1rem" 
                onSubmit={onCreate}
            >
                <input type={'text'} id={'search'} />
                <LocationSearch minLength='4' types={"locality"} countries='USA, SWE' showIcon='false' placeholder='City' /> 
                <Autocomplete
                        id="city"
                        required
                        options={!places ? [{ name: 'Loading...', id: -1 }] : places}
                        autoSelect={true}
                        onChange={(e, value) => { setCity(value); console.log(city)}}
                        getOptionLabel={option => option.name}
                        value={city}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="City" onChange={handleSearch} />}
                    />
                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="city" placeholder="City" />
                <input type="text" name="zip" placeholder="Zip" />
                <Button type="submit" variation="primary">
                    Create
                </Button>
            </Flex>
        </>
    )
}

export default LadderCreate