import { Box, FormControl, FormHelperText, InputLabel, MenuItem, NativeSelect, Slider, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import AutoCompletePlaces from "../Autocomplete/AutocompletePlaces";
import { enums, helpers } from "helpers";
import InfoPopup from "../infoPopup";
import NTRPLevels from "views/NTRPLevels";

function UserInformation({ onUpdate, onError, formData, errors, ...props }) {

  const [data, setData] = useState(formData);

  // make sure the data updates if/when the parent data updates
  useEffect(() => {
    setData(formData)
  }, [formData])

  // Get the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (v, i) => currentYear - i - 5);

  const handleChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value, e)
    onUpdate(name, value)
    // clear error
    onError(name, '')
  };

  const handlePlaceChanged = (e) => {
    console.log('place changed', e)
    // console.log('place changed', e.location)
    // console.log('place changed', e.lat, e.lng)
    const updatedFormData = {
      //...formData,
      city_name: e.city_name,
      location: e.location,
      lat: e.lat,
      lng: e.lng
    }

    const updatedErrors = { location: '' };
    console.log('handlePlaceChanged', updatedFormData, updatedErrors)

    onUpdate('location', e.location);
    onUpdate('city_name', e.city_name);
    onUpdate('lat', e.lat);
    onUpdate('lng', e.lng);
    onError('location', null)
  }

  return (
    <>
      <TextField
        name="firstName"
        label="First Name"
        value={data.firstName}
        disabled={data.google_id?.length > 0}
        onChange={handleChange}
        required
        fullWidth
        helperText={errors.firstName}
        error={Boolean(errors.firstName)}
        sx={{ mb: 3 }} // Add bottom margin to the TextField
      />
      <TextField
        name="lastName"
        label="Last Name"
        value={data.lastName}
        disabled={data.google_id?.length > 0}
        onChange={handleChange}
        required
        fullWidth
        helperText={errors.lastName}
        error={Boolean(errors.lastName)}
        sx={{ mb: 3 }} // Add bottom margin to the TextField
      />
      <TextField
        name="email"
        label="Email"
        value={data.email}
        disabled={true}
        onChange={handleChange}
        required
        fullWidth
        helperText={errors.email}
        error={Boolean(errors.email) && !helpers.validateEmail(data.email)}
        sx={{ mb: 3 }} // Add bottom margin to the TextField
      />

      <TextField
        select
        name="age"
        label="Birth Year"
        value={data.age ?? ''}
        onChange={handleChange}
        onBlur={() => {
          if (data.age && years.length > 0) { }
        }}
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
        initialCity={data.location ?? ''}
        showGetUserLocation={true}
      />
      <Box sx={{ mt: 2 }}>
        <InfoPopup paddingLeft={"0.1rem"} size={20}>
          <NTRPLevels />
          <a
            href='https://www.usta.com/content/dam/usta/pdfs/NTRP%20General%20Characteristics.pdf'
            target='_blank'
          >
            {`View the USTA NTPR guidelines here >>`}
          </a>
        </InfoPopup> NTRP Level: {helpers.hasValue(data.ntrp) ? parseFloat(data.ntrp).toFixed(1) : ''}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Slider
            sx={{ mr: 2 }}
            name="ntrp"
            getAriaLabel={() => 'Level'}
            label="Level"
            min={2}
            max={6.5}
            step={0.5}
            value={helpers.hasValue(data.ntrp) ? +data.ntrp : 0}
            onChange={handleChange}
            marks={helpers.hasValue(data.ntrp) ? enums.LevelMarks : null}
            valueLabelDisplay={helpers.hasValue(data.ntrp) ? "auto" : "off"}
          />

        </Box>
      </Box>
    </>
  )
}

export default UserInformation
