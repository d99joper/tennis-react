import { Flex } from "@aws-amplify/ui-react"
import { Card, CardContent, CircularProgress, Typography } from "@mui/material"
import { playerAPI } from "api/services"
import { ProfileImage } from "components/forms"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

function UserMerge() {
  const [isMerged, setIsMerged] = useState(false)
  const [player, setPlayer] = useState({})
  const params = useParams()


  useEffect(() => {
    console.log(params)
    playerAPI.mergePlayers(params.userid, params.mergeId, params.key).then((data) => {
      console.log(data)
      if (data?.player) {
        setPlayer(data.player)
        setIsMerged(data.status === 'success')
      }
    })

  }, [])

  return (
    <Flex>
      {isMerged === true ?
        <>
          The profiles have been merged into the profile below. 
          <Card sx={{ backgroundColor: 'whitesmoke' }}>
            <CardContent>
              <div>
                <ProfileImage player={player} size={75}
                  className={`image`}
                />
                <Link to={"/players/" + player.id}>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                  >
                    {player.name}
                  </Typography>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
        : <CircularProgress />
      }
    </Flex>
  )
}

export default UserMerge