import {
  Autocomplete, TextField, Button, Typography, Popover, Modal, Box, Dialog, DialogTitle
} from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { helpers, ladderHelper as lf, userHelper } from '../../../helpers/index';
import { GrCircleInformation } from 'react-icons/gr'
import debounce from 'lodash.debounce'
import { AiOutlineAim } from 'react-icons/ai';
//import { playerAPI } from 'api/services';

const SelectWithFetch = ({ allowCreate = false, disabledItemList = [], disabled, selectedItem, initialItems, onItemSelect, fetchFunction, showLocationIcon = false, children, ...props }) => {

  const [newItem, setNewItem] = useState()
  const [showModal, setShowModal] = useState(false)
  const [options, setOptions] = useState(Array.from(initialItems))
  const [value, setValue] = useState(selectedItem || null)
  const [loading, setLoading] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [lngLat, setLngLat] = useState({lng: 0, lat: 0})
  let isFetch = typeof fetchFunction === 'function'
  const [fetchByLocation, setFetchByLocation] = useState(false)

  //console.log(options, initialItems, fetchFunction, props, isFetch)

  let createComponent
  if (!React.isValidElement(children))
    createComponent = 'no component to add'
  else
    createComponent = React.cloneElement(children, { newItem: newItem, callback: handleCreateCallback })

  function optionExists(searchInput) {
    return options.find(x => x.name === searchInput)
  }

  useEffect(() => {
    console.log('resetting options to initial')
    setValue(selectedItem || null)
    isFetch = typeof fetchFunction === 'function'
    setOptions(Array.from(initialItems))
  }, [initialItems, selectedItem])

  function handleCreateCallback(callbackValue) {
    console.log(callbackValue)
    setShowModal(false)
    setValue(callbackValue)
    addToOptions([callbackValue])
    onItemSelect(callbackValue)
  }

  function addToOptions(values) {
    let newOptions = [...options, ...values]
      .filter((x, i, self) => {
        const firstIndex = self.findIndex(obj => obj.id === x.id)
        return i === firstIndex
      }).sort((a, b) => {
        // Sort based on the name property
        return a.name.localeCompare(b.name);
      })
    console.log(newOptions)
    setOptions(newOptions)
  }

  const fetch = useMemo(
    () =>
      debounce((request, callback) => {
        const { input, point } = request
        let foundOption = optionExists(input)
        if (foundOption) {
          console.log('cached', foundOption)
          // If options for this input are already cached, return them
          callback([foundOption])
        } else {
          let radius = 25
          let filter = {
            ...point ? { geo: `${point.lat},${point.lng},${radius}` } : {},
           ...input ? { 'name': input } : {},
          }
          
          if (isFetch) {
            fetchFunction(filter).then((newOptions) => {
              console.log('fetch function results: ', newOptions)
              callback(newOptions)
            })
          }
          // no fetch function, use preloaded options only
          else {
            return []
          }
        }
      }, 200),
    [],
  )


  function handleSetItem(value) {
    onItemSelect(value)
  }

  useEffect(() => {
    let active = true

    isFetch = typeof fetchFunction === 'function'
    if (inputValue === '' && !fetchByLocation) {
      //setOptions(selectedItem ? [selectedItem] : (cachedOptions[''] ?? []));
      console.log('no input value -> return')
      return undefined;
    }

    if (isFetch) {
      fetch({ input: inputValue, point: lngLat.lat !== 0 ? lngLat : null }, (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value]
          }

          if (results) {
            console.log(results)
            // add the results to the options
            // filter out duplicates
            newOptions =
              [...options, ...results]
                .filter((x, i, self) => {
                  const firstIndex = self.findIndex(obj => obj.id === x.id)
                  return i === firstIndex
                }).sort((a, b) => {
                  // Sort based on the name property
                  return a.name.localeCompare(b.name);
                })
            console.log(newOptions)
            setOptions(newOptions)
            document.getElementById("autocomplete_fetch_select").focus()
          }
        }
      })
    }
    //else setOptions(initialItems)

    return () => {
      active = false
      setFetchByLocation(false)
    }
  }, [inputValue, lngLat])

  const handleAddItem = (e, val) => {
    setShowModal(true)
    setNewItem(val)
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position)
          },
          (error) => {
            reject(error)
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    })
  }

  const handleLocation = async () => {
    document.getElementById("autocomplete_fetch_select").blur()
    setFetchByLocation(true)
    try {
      const position = await getCurrentLocation()
      console.log('Latitude:', position.coords.latitude)
      console.log('Longitude:', position.coords.longitude)
      setLngLat({lng:position.coords.longitude,lat:position.coords.latitude})
      
    } catch (error) {
      console.error('Error getting location:', error.message)
    }
  }

  return (
    <React.Fragment>
      <Autocomplete
        id="autocomplete_fetch_select"
        key={props.key}
        required
        options={!options ? [{ name: 'Loading...', id: 0 }] : options}
        disableClearable={false}
        //clearOnBlur={true}
        openOnFocus={true}
        //filterOptions={(x) => x}
        disabled={disabled}
        getOptionDisabled={(option) => { return disabledItemList?.findIndex(x => x.id === option.id) > -1 }}
        autoComplete
        includeInputInList
        filterSelectedOptions
        autoSelect={true}
        onChange={(e, newValue) => {
          //setOptions(newValue ? [newValue, ...options] : options)
          setValue(newValue)
          handleSetItem(newValue)
        }}
        onInputChange={(e, newInputValue) => {
          setInputValue(newInputValue)
        }}
        value={value}//{disabled === true ? selectedItem : value}
        isOptionEqualToValue={(value, option) => value.id === option.id || option?.name === ''}
        getOptionLabel={option => option.name ?? ''}
        inputValue={inputValue}
        sx={{ width: 300 }}
        //renderInput={(params) => <TextField required variant='outlined' {...params} label={props.label} />}
        renderInput={(params) => (
          <Box sx={{flex:true, direction:'row'}}>
            <TextField
              {...params}
              label={props.placeholder ?? "Search"}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? 'Loading...' : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
            {showLocationIcon &&
              <AiOutlineAim 
                size={30} 
                color='green' 
                cursor={'pointer'}
                onClick={handleLocation} 
              />
            }
          </Box>
        )}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )
        }}
        noOptionsText={
          allowCreate && inputValue ?
            <div>
              "{inputValue}" doesn't seem to exist. <br />

              <Button
                variant="contained"
                color="primary"
                //onClick={e => setShowModal(true)}
                onClick={e => handleAddItem(e, inputValue)}
              >
                Add "{inputValue}"
              </Button>
            </div>
            : 'Not found'
        }
      />
      {/* <Dialog
        onClose={() => setShowModal(false)}
        open={showModal}
        aria-labelledby={`Add`}
        aria-describedby="Add"
        padding={'1rem'}
      >
        <DialogTitle>Add {newItem}</DialogTitle>
        <Box sx={helpers.modalStyle}>
          {createComponent}
        </Box>
      </Dialog> */}

      <Modal
        onClose={() => setShowModal(false)}
        open={showModal}
        aria-labelledby={`Add `}
        aria-describedby="Add"
      >
        <Box sx={helpers.modalStyle}>
          {createComponent}
        </Box>
      </Modal>

    </React.Fragment>
  )
}

export { SelectWithFetch }