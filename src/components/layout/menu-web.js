import { Menu, MenuItem, View } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import MuiAppBar from '@mui/material/AppBar';
import { userFunctions } from '../../helpers'
import { Box, CssBaseline, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, makeStyles, Popover, styled, SwipeableDrawer, Toolbar, Typography, useTheme } from '@mui/material';
import { Global } from '@emotion/react';
import { BsLadder, BsSearch } from 'react-icons/bs'
import { SlUser } from 'react-icons/sl';
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineHome, 
         AiOutlineQuestionCircle, AiOutlineMail, AiOutlineSetting, AiOutlineInfoCircle } from 'react-icons/ai'
import {BiLogInCircle, BiLogOutCircle} from 'react-icons/bi'
// import bannerImage from '../../images/banner_tennis.jpg'
import bannerImage from '../../images/tennisbanner.png'
//import './layout.css'
import { GiWhistle } from 'react-icons/gi';

const WebMenu = (props) => {
console.log("webMenu")
    const smallScreen = 768
    const mediumScreen = 900
    const userScreen = window.innerWidth
    const marginSizes = {
        large: { open: { margin: 200, drawer: 200 }, close: { margin: 60, drawer: 60 } },
        medium: { open: { margin: 200, drawer: 200 }, close: { margin: 60, drawer: 60 } },
        small: { open: { margin: 0, drawer: 200 }, close: { margin: 0, drawer: 0 } }
    }
    const initialUserScreen = userScreen <= smallScreen ? 'small' : userScreen <= mediumScreen ? 'medium' : 'large'
    const [open, setOpen] = useState(initialUserScreen === 'small' ? false : true)
    const [screenSize, setScreenSize] = useState(initialUserScreen)
    const [drawerWidth, setDrawerWidth] = useState(marginSizes[initialUserScreen].open)
    //console.log(initialUserScreen)
    const [anchorEl, setAnchorEl] = useState(null)
    const [popoverText, setPopoverText] = useState('')

    const handlePopoverOpen = (event, text) => {
        if(drawerWidth < 80) {
            setAnchorEl(event.currentTarget)
            setPopoverText(text)
        }
    };

    const handlePopoverClose = () => {
        if(drawerWidth < 80) {
            setAnchorEl(null)
            setPopoverText('')
        }
    }

    const openPopover = Boolean(anchorEl)

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }))

    // const popoverStyles = makeStyles((theme) => ({
    //     customPopover: {
    //         backgroundColor: 'white'
    //     }
    // }))
    // const classes = popoverStyles()

    const handleDrawerOpenClose = () => {
        console.log('open-close', !open)
        setOpen(!open);
    }

    useEffect(() => {
        function updateDrawer() {
            const strOpen = open ? 'open' : 'close'
            const currentScreen = window.innerWidth <= smallScreen ? 'small' : window.innerWidth <= mediumScreen ? 'medium' : 'large'
            setScreenSize(currentScreen)
            setDrawerWidth(marginSizes[currentScreen][strOpen].drawer)
            document.body.style.marginLeft = `${marginSizes[currentScreen][strOpen].margin}px`
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

    return (

        <div 
            // className='banner'
        >
            {!open && screenSize === 'small' &&
                <div className={'drawer-puller'} onClick={handleDrawerOpenClose}>
                    <IconButton>
                        <AiOutlineMenuUnfold color='white' size="1.5rem" />
                    </IconButton>
                </div>
            }
            <Popover
                id="mouse-over-popover"
                PaperProps={{style:{backgroundColor: '#ebffeb'}}}
                sx={{
                    pointerEvents: 'none',
                    color: 'white'
                }}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{popoverText}</Typography>
            </Popover>
            <SwipeableDrawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#c8e6c9',
                        overflow: 'hidden'
                    },
                }}
                anchor='left'
                variant={"persistent"}
                open={true}
                onClose={(e) => { console.log('onClose', e) }}
                onOpen={(e) => { console.log('onOpen', e) }}
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
                        <ListItemIcon 
                            onMouseEnter={(e) => handlePopoverOpen(e, 'Home')}
                            onMouseLeave={handlePopoverClose}
                        >
                            <AiOutlineHome size={'1.5rem'}  />
                        </ListItemIcon>
                        <ListItemText primary={open && 'Home'} />
                    </ListItemButton>
                    {props.isLoggedIn === true &&
                        <ListItemButton title="My Profile" component={Link} to="/profile">
                            <ListItemIcon
                            onMouseEnter={(e) => handlePopoverOpen(e, 'My Profile')}
                            onMouseLeave={handlePopoverClose}
                        >
                            <SlUser size={'1.5rem'} />
                            </ListItemIcon>
                            <ListItemText primary={open && 'My Profile'} />
                        </ListItemButton>
                    }
                    {/* <ListItemButton title="Ladders" component={Link} to="/ladders">
                        <ListItemIcon>
                            <BsLadder size={'1.75rem'} />
                        </ListItemIcon>
                        <ListItemText primary={open && 'Ladders'} />
                    </ListItemButton> */}
                    <ListItemButton title="Search" component={Link} to="/search">
                        <ListItemIcon
                            onMouseEnter={(e) => handlePopoverOpen(e, 'Search for players and ladders')}
                            onMouseLeave={handlePopoverClose}
                        >
                            <BsSearch size={'1.5rem'} />
                        </ListItemIcon>
                        <ListItemText primary={open && 'Search'} />
                    </ListItemButton>
                    {/* <ListItemButton title="About" component={Link} to="/about">
                        <ListItemIcon>
                            <AiOutlineInfoCircle size={'1.5rem'} />
                        </ListItemIcon>
                        <ListItemText primary={open && 'About'} />
                    </ListItemButton> */}
                    <ListItemButton title="FAQ" component={Link} to="/faq">
                        <ListItemIcon
                            onMouseEnter={(e) => handlePopoverOpen(e, 'FAQ')}
                            onMouseLeave={handlePopoverClose}
                        >
                            <AiOutlineQuestionCircle size={'1.5rem'} />
                        </ListItemIcon>
                        <ListItemText primary={open && 'FAQ'} />
                    </ListItemButton>
                    <ListItemButton title="Rules" component={Link} to="/rules">
                        <ListItemIcon
                            onMouseEnter={(e) => handlePopoverOpen(e, 'Rules')}
                            onMouseLeave={handlePopoverClose}
                        >
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
                        <ListItemButton title="Login" component={Link} to="/login">
                            <ListItemIcon
                                onMouseEnter={(e) => handlePopoverOpen(e, 'Login')}
                                onMouseLeave={handlePopoverClose}
                            >
                            <BiLogInCircle size={'1.5rem'} />
                            </ListItemIcon>
                            <ListItemText primary={open && 'Login'} />
                        </ListItemButton>
                    }
                    {props.isLoggedIn === true &&
                        <ListItemButton title="Logout" className='cursorHand' onClick={userFunctions.signOut}>
                            <ListItemIcon
                                onMouseEnter={(e) => handlePopoverOpen(e, 'Logout')}
                                onMouseLeave={handlePopoverClose}
                            >
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
            </SwipeableDrawer>
        </div>
    );
}

export default WebMenu;
