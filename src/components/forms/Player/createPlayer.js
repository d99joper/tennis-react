import { playerAPI } from "api/services";
import { helpers } from "helpers";
import { useState } from "react";

const { Grid, Typography, TextField, Button, Popover, Grid2 } = require("@mui/material");
const { GrCircleInformation } = require("react-icons/gr");

const CreatePlayer = ({ newItem='', callback, ...props }) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const [email, setEmail] = useState()
  const [isValidEmail, setIsValidEmail] = useState(true)
  //const [hasChecked, setHasChecked] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const createPlayer = async () => {
    let pEmail = email !== "" ? email : newItem.replace(/\s+/g, '.') + '@mytennis.space'
    const playerResponse = await playerAPI.createPlayer({name: newItem, email: pEmail})  
    
    if (playerResponse.error) {
      setErrorMessage(playerResponse.message)
    } else {
      callback({id: playerResponse.id, name: playerResponse.name})
    }
  }
  const handleAddPlayer = () => {
    const isValid = helpers.validateEmail(email)
    setIsValidEmail(isValid)
    if (isValid)
      createPlayer()
  }

  // const validateEmail = (email) => {
  //   setHasChecked(true)
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //   if (!email) return true
  //   return regex.test(email)
  // }

  return (
    <Grid2 container direction={'column'}>
      <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'1rem'}>
        Add "<u>{newItem}</u>" to My Tennis Space
      </Typography>

      <Typography className='cursorHand'>add email&nbsp;
        <GrCircleInformation fontSize=".75em" variation="info" fontWeight={'100'} onClick={e => setAnchorEl(e.currentTarget)} />
      </Typography>
      <TextField
        variant='standard'
        onBlur={e => setIsValidEmail(helpers.validateEmail(e.target.value))}
        onChange={e => {
          const val = e.target.value
          setErrorMessage('')
          setEmail(val);
          setIsValidEmail(helpers.validateEmail(val))
        }}
        placeholder={`${newItem}'s email`}
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
        <Typography fontSize=".9em" sx={{ p: 2 }}>If you know <i>{newItem}'s</i> email address, you can add it to send an invite for the player to join My Tennis Space. <br />If not, you can add the player by name only. If <i>{newItem}</i> decides to join in the future, the player has the option to link this match to their profile.</Typography>
      </Popover>
    </Grid2>
  )
}

export default CreatePlayer