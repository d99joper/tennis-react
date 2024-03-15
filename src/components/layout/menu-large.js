import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer'
import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar
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

const LargeMenu = (props) => {
  //console.log("largeMenu")
  //const theme = useTheme()
  const [open, setOpen] = useState(true);
  const drawerWidth = 240
  const prevLocation = useLocation()
  const navigate = useNavigate()

  const handleDrawerOpenClose = () => {
    console.log('open-close', !open)
    setOpen(!open);
  }

  useEffect(() => {
    function updateDrawer() {
      document.body.style.paddingLeft = open ? '240px' : '60px'// `${marginSizes[currentScreen][strOpen].margin}px` //open ? drawerWidth : 0
    }

    function handleResize() {
      updateDrawer()
    }
    // Add event listener
    window.addEventListener("resize", handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)

  }, [open])

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })
    (({ theme, open }) => ({
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.leavingScreen,
      }),
      ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    }));

  //const Drawer = styled(MuiDrawer)(
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
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
    <AppBar position="fixed" open={open} className='banner'>
      <Toolbar>
        <div className='banner-title'>
          <h1>My Tennis Space</h1>
        </div>
        <div className='banner'>
          <Drawer
            variant={"permanent"}
            open={open}
          >
            <DrawerHeader>
              <span className={'drawer-puller'} onClick={handleDrawerOpenClose} >
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
              <span>
                <Link to={`/profile/${props.currentUser?.id}`} className='bannerLink'>{props.currentUser?.name}</Link>
              </span>
              <Link  className='bannerLink' onClick={handleLogout}>
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
