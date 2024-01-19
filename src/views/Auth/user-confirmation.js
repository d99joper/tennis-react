import { Flex } from "@aws-amplify/ui-react"
import authAPI from "api/auth"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function UserConfirmation() {
  const [isVerified, setIsVerified] = useState(false)
  const params = useParams()


  useEffect(() => {
    console.log(params)
    authAPI.verifyEmail(params.userid, params.key).then((data) => {
      console.log(data)
      if(data?.player)
        setIsVerified(data.player.verified)
    })

  }, [])

  return (
    <Flex>
      {isVerified === true ? 'This user has been verified' : 'This user is not verified'}
    </Flex>
  )
}

export default UserConfirmation