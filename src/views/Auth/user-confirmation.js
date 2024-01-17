import { Flex } from "@aws-amplify/ui-react"
import authAPI from "api/auth"
import { useEffect, useState } from "react"

function UserConfirmation () {
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const confirmationKey = window.location.pathname.split('/').pop();
    authAPI.verifyEmail(confirmationKey).then((data) => {
      console.log(data)
      setIsVerified(true)
    })
  },[])

  return (
    <Flex>
      {isVerified === true ? 'You have been verified' : 'You are not verified'}
    </Flex>
  )
}

export default UserConfirmation