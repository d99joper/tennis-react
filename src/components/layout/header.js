import React, { useEffect, useState } from "react"
import './layout.css'
import ResponsiveMenu from "./Menu/responsiveMenu"
import notificationAPI from "api/services/notifications";
import { onNotificationReceived, removeNotificationListener } from "../../firebase/notificationService";
import { Box } from "@mui/material";

function Header(props) {

  //const [notificationCount, setNotificationCount] = useState(0);
  // const location = useLocation()
  // const pathnames = location.pathname.split('/').filter((x) => x)


  if (props.show === false) return
  return (
    <Box>
      <ResponsiveMenu {...props}  />

      {/* <Breadcrumbs className='breadcrumbs'>
        {pathnames.map((elem, index) => {
          console.log(elem)
          return (
            <Typography key={`${elem}_${index}`}>{elem}</Typography>
          )
        })}
      </Breadcrumbs> */}
    </Box>
  );
}
export default Header;