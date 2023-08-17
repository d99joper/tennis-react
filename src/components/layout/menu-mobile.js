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

const MobileMenu = (props) => {
    console.log("mobileMenu")

    const [open, setOpen] = useState(false)
    //console.log(initialUserScreen)
    const [anchorEl, setAnchorEl] = useState(null)
    
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }))
    
    const handleDrawerOpenClose = () => {
        console.log('open-close', !open)
        setOpen(!open);
    }

    return (

        <>
            <div className={'drawer-puller banner-hamburger-icon'} onClick={handleDrawerOpenClose} >
                <IconButton >
                    <AiOutlineMenuUnfold color='white' size="1.5rem" />
                </IconButton>
            </div>
            <SwipeableDrawer
                sx={{
                    width: 200,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 200,
                        boxSizing: 'border-box',
                        backgroundColor: '#c8e6c9',
                        overflow: 'hidden'
                    },
                }}
                anchor='left'
                // variant={"temporary"}
                open={open}
                onClose={(e) => setOpen(false) }
                onOpen={(e) => setOpen(true) }
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
                            <AiOutlineHome size={'1.5rem'}  />
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
                    {props.isLoggedIn !== true &&
                        <ListItemButton title="Login" component={Link} to="/login">
                            <ListItemIcon>
                            <BiLogInCircle size={'1.5rem'} />
                            </ListItemIcon>
                            <ListItemText primary={open && 'Login'} />
                        </ListItemButton>
                    }
                    {props.isLoggedIn === true &&
                        <ListItemButton title="Logout" className='cursorHand' onClick={userFunctions.signOut}>
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
            </SwipeableDrawer>
        </>
    );
}

export default MobileMenu;
