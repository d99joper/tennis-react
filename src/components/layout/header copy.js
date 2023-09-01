import React from "react"
import WebMenu from './menu-large'
import { AppBar, Breadcrumbs, Toolbar, Typography } from '@mui/material'
import { useLocation } from "react-router-dom"
import './layout.css'
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi"
import { userFunctions } from "helpers"
import MobileMenu from "./menu-mobile"

function Header(props) {

  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  let isSmallScreen = window.matchMedia("(max-width: 768px)").matches

  return (
    <header>
      <AppBar className={"banner"}>
        <Toolbar>
          <div className='banner-title'>
            <h1>My Tennis Space</h1>
          </div>
          {isSmallScreen
            ? <MobileMenu {...props} />
            : <WebMenu {...props} />
          }

          <div className='banner-settings'>
            {props.isLoggedIn === true ?
              <BiLogOutCircle title="Logout" size={'1.5rem'} className="cursorHand" onClick={userFunctions.signOut} />
              :
              <BiLogInCircle title="Login" size={'1.5rem'} className="cursorHand" onClick={() => console.log('poop')} component="Link" to="/login" />
            }
          </div>
        </Toolbar>
      </AppBar>
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