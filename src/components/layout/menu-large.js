import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer'
import {
  AppBar,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  useMediaQuery
} from '@mui/material';
import { BsSearch } from 'react-icons/bs'
import { SlUser } from 'react-icons/sl';
import {
  AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineHome,
  AiOutlineQuestionCircle, AiOutlineSetting
} from 'react-icons/ai'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { GiWhistle } from 'react-icons/gi';
import { Flex } from '@aws-amplify/ui-react';
import authAPI from 'api/auth';
import { useTheme } from '@emotion/react';

const drawerWidthLarge = 240;
const drawerWidthSmall = 60;

const LargeMenu = (props) => {
  //console.log("largeMenu")
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerWidth, setDrawerWidth] = useState(isLargeScreen ? drawerWidthLarge : drawerWidthSmall);
  const [open, setOpen] = useState(isLargeScreen);
  const prevLocation = useLocation()
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
    setDrawerWidth((prev) => (prev === drawerWidthLarge ? drawerWidthSmall : drawerWidthLarge));
  };

  useEffect(() => {
    setDrawerWidth(open ? drawerWidthLarge : drawerWidthSmall);
    const appDiv = document.getElementById("app");
    if (appDiv) {
      appDiv.style.marginLeft = `${drawerWidth}px`; // Dynamically adjust the margin of the #app container
    }
  }, [drawerWidth, open]);


  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: drawerWidth,
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    //...theme.mixins.toolbar,
  }));

  //const Drawer = styled(MuiDrawer)(
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      position: 'fixed',
      // transition: theme.transitions.create("width", {
      //   easing: theme.transitions.easing.sharp,
      //   duration: 1000,
      // }),
      // "& .MuiDrawer-paper": {
      //   width: drawerWidth,
      //   transition: theme.transitions.create("width", {
      //     easing: theme.transitions.easing.sharp,
      //     duration: 1000,
      //   }),
      // },
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

  function handleLogout() {
    authAPI.signOut()
    navigate(prevLocation.pathname)
    //window.location.reload(false)
  }

  function handleLogin(e) {
    e.preventDefault()
    console.log(prevLocation)
    navigate(`/login?redirectTo=${prevLocation.pathname}`)
  }

  return (
    <AppBar position="static" elevation={0} open={open} sx={{ backgroundColor: 'transparent' }}>
      <Toolbar className='banner'>
        <div className='banner-title'>
          <h1>My Tennis Space</h1>
        </div>
        <div className='banner'>
          <Drawer
            variant={"permanent"}
            open={open}
            anchor='left'
          >
            <DrawerHeader>
              <span className={'drawer-puller'} onClick={handleDrawerToggle} >
                {open ?
                  <IconButton>
                    <AiOutlineMenuFold size="1.5rem" />
                  </IconButton>
                  :
                  <IconButton>
                    <AiOutlineMenuUnfold size="1.5rem" />
                  </IconButton>
                }
              </span>
            </DrawerHeader>
            <Divider />
            <List sx={{
              minWidth: 0
            }} >
              <ListItemButton title="Home" component={Link} to="/">
                <ListItemIcon>
                  <AiOutlineHome size={'1.5rem'} />
                </ListItemIcon>
                <ListItemText primary={open && 'Home'} />
              </ListItemButton>
              {props.isLoggedIn === true &&
                <ListItemButton title="My Profile" component={Link} to="/profile">
                  <ListItemIcon>
                    <SlUser size={'1.5rem'} />
                  </ListItemIcon>
                  <ListItemText primary={open && 'My Profile'} />
                </ListItemButton>
              }
              <ListItemButton title="Search" component={Link} to="/search">
                <ListItemIcon>
                  <BsSearch size={'1.5rem'} />
                </ListItemIcon>
                <ListItemText primary={open && 'Search'} />
              </ListItemButton>
              <ListItemButton title="FAQ" component={Link} to="/faq">
                <ListItemIcon>
                  <AiOutlineQuestionCircle size={'1.5rem'} />
                </ListItemIcon>
                <ListItemText primary={open && 'FAQ'} />
              </ListItemButton>
              <ListItemButton title="Rules" component={Link} to="/rules">
                <ListItemIcon>
                  <GiWhistle size={'1.5rem'} />
                </ListItemIcon>
                <ListItemText primary={open && 'Rules'} />
              </ListItemButton>
              {/* <ListItemButton title="Contact" component={Link} to="/contact">
                                <ListItemIcon>
                                    <AiOutlineMail size={'1.5rem'} />
                                </ListItemIcon>
                                <ListItemText primary={open && 'Contact'} />
                            </ListItemButton> */}
              {props.isLoggedIn !== true &&
                <ListItemButton title="Login" component={Link} to="/login" onClick={handleLogin}>
                  <ListItemIcon>
                    <BiLogInCircle size={'1.5rem'} />
                  </ListItemIcon>
                  <ListItemText primary={open && 'Login'} />
                </ListItemButton>
              }
              {props.isLoggedIn === true &&
                <ListItemButton title="Logout" className='cursorHand' onClick={handleLogout}>
                  <ListItemIcon>
                    <BiLogOutCircle size={'1.5rem'} />
                  </ListItemIcon>
                  <ListItemText primary={open && 'Logout'} />
                </ListItemButton>
              }{props.currentUser?.isAdmin === true &&
                <ListItemButton title="Admin" component={Link} to="/adminTasks">
                  <ListItemIcon>
                    <AiOutlineSetting size={'1.5rem'} />
                  </ListItemIcon>
                  <ListItemText primary={open && 'Admin'} />
                </ListItemButton>
              }
            </List>
          </Drawer>

        </div>
        <div className='banner-settings'>
          {props.isLoggedIn === true ?
            <Flex direction={"row"} gap="1rem">
              {isLargeScreen &&
                <span>
                  <Link to={`/profile/${props.currentUser?.id}`} className='bannerLink'>{props.currentUser?.name}</Link>
                </span>
              }
              <Link className='bannerLink' onClick={handleLogout}>
                <BiLogOutCircle
                  title="Logout"
                  size={'1.5rem'}
                  className="cursorHand"
                />
                <small> logout</small>
              </Link>
            </Flex>
            :
            <Link to="/login" className='bannerLink' onClick={handleLogin}>
              <BiLogInCircle
                title="Login"
                size={'1.5rem'}
                className="cursorHand"
                component="Link"
                to="/login"
              />
              <small> login</small>
            </Link>
          }
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default LargeMenu;
