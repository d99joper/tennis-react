import { Box, Checkbox, Container, Divider, MenuItem, Slider, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import AutoCompletePlaces from "../Autocomplete/AutocompletePlaces";
import { enums, helpers } from "helpers";
import InfoPopup from "../infoPopup";

function UserInformation({ onUpdate, onError, formData, errors, ...props }) {

  // Get the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (v, i) => currentYear - i - 5);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, e)
    onUpdate(name, value)
    // clear error
    onError(name,'')
    // const { name, value } = e.target;
    // const updatedFormData = {  [name]: value}
    //formData[name] = value;
    
    // // reset errors
    // const updatedErrors = {[name]:''}
    // //errors[name] = '';

    // console.log('handleChange',updatedFormData, updatedErrors);
    // onUpdate(updatedFormData, updatedErrors)
  };

  const handlePlaceChanged = (e) => {
    // console.log('place changed', e)
    // console.log('place changed', e.location)
    // console.log('place changed', e.lat, e.lng)
    const updatedFormData = {
      //...formData,
      location: e.location,
      lat: e.lat, 
      lng: e.lng
    }

    const updatedErrors = { location: ''};
    console.log('handlePlaceChanged', updatedFormData, updatedErrors)

    onUpdate('location', e.location);
    onUpdate('lat', e.lat);
    onUpdate('lng', e.lng);
    onError('location', null)
  }
  
  return (
    <>
      <TextField
        name="name"
        label="Name"
        value={formData.name}
        disabled={formData.google_id?.length > 0}
        onChange={handleChange}
        required
        fullWidth
        helperText={errors.name}
        error={Boolean(errors.name)}
        sx={{ mb: 3 }} // Add bottom margin to the TextField
      />
      <TextField
        name="email"
        label="Email"
        value={formData.email}
        disabled={true}
        onChange={handleChange}
        required
        fullWidth
        helperText={errors.email}
        error={Boolean(errors.email) && !helpers.validateEmail(formData.email)}
        sx={{ mb: 3 }} // Add bottom margin to the TextField
      />
      
      <TextField
        select
        name="age"
        label="Birth Year"
        value={formData.age ?? ''}
        onChange={handleChange}
        fullWidth
        helperText={errors.age}
        error={Boolean(errors.age)}
        required
        sx={{ mb: 3 }} // Add bottom margin to the TextField
      >
        {/* Map over the years array to create MenuItem components */}
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>
      <AutoCompletePlaces
        onPlaceChanged={handlePlaceChanged}
        required
        error={Boolean(errors.location)}
        helperText={errors.location}
        initialCity={formData.location ?? ''}
        showGetUserLocation={true}
      />
      <Box sx={{ mt: 2 }}>
        NTRP Level: {helpers.hasValue(formData.ntrp) ? parseFloat(formData.ntrp).toFixed(1) : ''} 
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Slider
            sx={{  mr: 2 }}
            name="ntrp"
            getAriaLabel={() => 'Level'}
            label="Level"
            min={2}
            max={6.5}
            step={0.5}
            value={helpers.hasValue(formData.ntrp) ? +formData.ntrp : 0}
            onChange={handleChange}
            marks={helpers.hasValue(formData.ntrp) ? enums.LevelMarks : null}
            valueLabelDisplay={helpers.hasValue(formData.ntrp) ?  "auto" : "off"}
          />
          <InfoPopup paddingLeft={"0.1rem"}>
            <a
              href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
              target='_blank'
            >
              {`View the USTA NTPR guidelines here >>`}
            </a>
          </InfoPopup>
        </Box>
      </Box>
    </>
  )
}

export default UserInformation
