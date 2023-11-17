import React from "react"
import WebMenu from './menu-large'
import { AppBar, Breadcrumbs, Toolbar, Typography } from '@mui/material'
import { useLocation } from "react-router-dom"
import './layout.css'
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi"
import { userHelper } from "helpers"
import MobileMenu from "./menu-mobile"
import MiniDrawer from "./test"
import LargeMenu from "./menu-large"

function Header(props) {

  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  let isSmallScreen = window.matchMedia("(max-width: 768px)").matches

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