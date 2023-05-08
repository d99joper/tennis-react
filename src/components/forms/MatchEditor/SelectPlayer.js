import { Flex, Radio, RadioGroupField, TextAreaField, Text, Grid } from '@aws-amplify/ui-react';
import {
  Autocomplete, Select, TextField,
  MenuItem, InputLabel, FormControl,
  Checkbox, FormControlLabel, Button, Typography, Popover, Modal, Box
} from '@mui/material'; //https://mui.com/material-ui/react-autocomplete/
import React, { useEffect, useRef, useState } from 'react';
import { enums, helpers, ladderFunctions as lf, matchFunctions as mf, userFunctions } from '../../../helpers/index';
import SetInput from './SetInput'
import './MatchEditor.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GrCircleInformation } from 'react-icons/gr'
import debounce from 'lodash.debounce'

//import { Dayjs } from 'dayjs';

const SelectPlayer = ({ ladderId, disabledPlayerList = [], disabled, player, onPlayerSelect, ...props }) => {

  const [newPlayer, setNewPlayer] = useState()
  const [searchInput, setSearchInput] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState()
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const ladderPlayers = lf.useLadderPlayersData(ladderId, searchInput)

  function handleSetPlayer(value) {
    onPlayerSelect(value)
  }

  const debouncedHandleInputChange = useRef(
    debounce((newValue) => {
      setNewPlayer(newValue)
      setSearchInput(newValue)
    }, 500)
  ).current

  function handleInputChange(event, newValue) {
    if (!showModal)
      debouncedHandleInputChange(newValue)
  }

  const createPlayer = async () => {
    const player = await userFunctions.createPlayerIfNotExist(newPlayer, email)
    if(player.alreadyExists) {
      setErrorMessage(`A player (${player.name}) with the email ${email} already exists. `)
    } else {
      setShowModal(false)
      ladderPlayers.players.push(player)
      onPlayerSelect(player)
    }
  }
  const handleAddPlayer = () => {
    console.log(newPlayer, email)
    const isValid = validateEmail(email)
    setIsValidEmail(isValid)
    if(isValid)
      createPlayer()
  }

  const validateEmail = (email) => {
    setHasChecked(true)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!email) return true
    return regex.test(email)
  }

  return (
    <React.Fragment>
      <Autocomplete
        // id="player-search"
        required
        options={!ladderPlayers ? [{ name: 'Loading...', id: 0 }] : ladderPlayers.players}
        disableClearable={true}
        disabled={disabled}
        getOptionDisabled={(option) => { return disabledPlayerList?.findIndex(x => x.id === option.id) > -1 }}
        autoSelect={true}
        onChange={(e, value) => { handleSetPlayer(value) }}
        onInputChange={handleInputChange}
        getOptionLabel={option => option.name}
        value={player}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField required variant='outlined' {...params} label={props.label} />}
        noOptionsText={
          ladderId === "-1" ?
            <div>
              The player "{newPlayer}" doesn't seem to exist. <br />

              <Button variant="contained" color="primary" onClick={e => setShowModal(true)}>
                Add "{newPlayer}"
              </Button>
            </div>
            : 'Player not found'
        }
      />
      <Modal
        onClose={() => setShowModal(false)}
        open={showModal}
        aria-labelledby={`Add player `}
        aria-describedby="Add player"
      >
        <Box sx={helpers.modalStyle}>
          <Grid templateRows={"auto"}>

            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'1rem'}>
              Add <i>{newPlayer}</i> to My Tennis Space
            </Typography>

            <Text className='cursorHand'>add email&nbsp;
              <GrCircleInformation fontSize=".75em" variation="info" fontWeight={'100'} onClick={e => setAnchorEl(e.currentTarget)} />
            </Text>
            <TextField
              variant='standard'
              onBlur={e => setIsValidEmail(validateEmail(e.target.value))}
              onChange={e => { 
                const val = e.target.value
                setErrorMessage('')
                setEmail(val); 
                if(hasChecked)
                  setIsValidEmail(validateEmail(val)) 
              }}
              placeholder={`${newPlayer}'s email`}
              style={{ width: "20rem" }}
            />
            {!isValidEmail && <div style={{ color: 'red' }} >* not a valid email</div>}
            {errorMessage && <div style={{ color: 'red' }} >{errorMessage}</div>}
            <Button variant="contained" color="primary" style={{ marginTop: '1rem' }} onClick={handleAddPlayer}>
              Add Player
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                style: { width: '475px' },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography fontSize=".9em" sx={{ p: 2 }}>If you know <i>{newPlayer}'s</i> email address, you can add it to send an invite for the player to join My Tennis Space. <br />If not, you can add the player by name only. If <i>{newPlayer}</i> decides to join in the future, the player has the option to link this match to their profile.</Typography>
            </Popover>
          </Grid>
        </Box>
      </Modal>
    </React.Fragment>
  )
}

export { SelectPlayer }