import { Box } from "@mui/material"
import authAPI from "api/auth"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

function UserConfirmation() {
  const [isVerified, setIsVerified] = useState(false)
  const [player, setPlayer] = useState({})
  const params = useParams()


  useEffect(() => {
    console.log(params)
    authAPI.verifyEmail(params.userid, params.key).then((data) => {
      console.log(data)
      if(data?.player) {
        setPlayer(data.player)
        setIsVerified(data.player.verified)
      }
    })

  }, [])

  return (
    <Box display={'flex'}>
      {isVerified === true ? 
        <>
          This user has been verified. Please continue to the <Link to={{ pathname: '/login', state: {player:player} }}>Login.</Link>
        </>
        : 'This user is not verified'}
    </Box>
  )
}

export default UserConfirmation