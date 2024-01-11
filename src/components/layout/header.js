import React, { useEffect } from "react"
import {  Breadcrumbs, Toolbar, Typography } from '@mui/material'
import { useLocation } from "react-router-dom"
import './layout.css'
import MobileMenu from "./menu-mobile"
import LargeMenu from "./menu-large"

function Header(props) {

  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  let isSmallScreen = window.matchMedia("(max-width: 768px)").matches

  if(props.show === false) return
  return (
    <header>
      
      {isSmallScreen
        ? <MobileMenu {...props} />
        :  <LargeMenu {...props} />//<MiniDrawer /> // 
      }
      <Toolbar />

      <Breadcrumbs className='breadcrumbs'>
        {pathnames.map((elem, index) => {
          return (
            <Typography key={`${elem}_${index}`}>{elem}</Typography>
          )
        })}
      </Breadcrumbs>
    </header>
  );
}
export default Header;