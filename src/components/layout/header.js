import React, { useEffect } from "react"
import {  Box, Breadcrumbs, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { useLocation } from "react-router-dom"
import './layout.css'
import MobileMenu from "./menu-mobile"
import LargeMenu from "./menu-large"
import { useTheme } from "@emotion/react"

function Header(props) {

  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if(props.show === false) return
  return (
    <>
      
      {isSmallScreen
        ? <MobileMenu {...props} />
        :  <LargeMenu {...props} />
      }
      {/* <Toolbar /> */}

      {/* <Breadcrumbs className='breadcrumbs'>
        {pathnames.map((elem, index) => {
          console.log(elem)
          return (
            <Typography key={`${elem}_${index}`}>{elem}</Typography>
          )
        })}
      </Breadcrumbs> */}
    </>
  );
}
export default Header;