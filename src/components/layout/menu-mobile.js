import { Link } from 'react-router-dom';
import React, { useState } from "react";
import { userHelper } from '../../helpers';
import { 
    AppBar, 
    Divider, 
    IconButton, 
    List, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    styled, 
    SwipeableDrawer, 
    Toolbar,
} from '@mui/material';
import { BsSearch } from 'react-icons/bs'
import { SlUser } from 'react-icons/sl';
import {
    AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineHome,
    AiOutlineQuestionCircle, AiOutlineSetting, 
} from 'react-icons/ai'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi';
//import './layout.css'
import { GiWhistle } from 'react-icons/gi';


const MobileMenu = (props) => {
    const [open, setOpen] = useState(false)

    document.getElementById("app").style.marginLeft = '0px';

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

        <AppBar position="static" elevation={0} open={open} sx={{ backgroundColor: 'transparent' }}>
            <Toolbar className={"banner"}>
                <div className='banner-title'>
                    <h1>My Tennis Space</h1>
                </div>
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
                    open={open}
                    onClose={handleDrawerOpenClose}
                    onOpen={(e) => setOpen(true)}
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
                    <List onClick={handleDrawerOpenClose} sx={{
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
                        {props.isLoggedIn !== true &&
                            <ListItemButton title="Login" component={Link} to="/login">
                                <ListItemIcon>
                                    <BiLogInCircle size={'1.5rem'} />
                                </ListItemIcon>
                                <ListItemText primary={open && 'Login'} />
                            </ListItemButton>
                        }
                        {props.isLoggedIn === true &&
                            <ListItemButton title="Logout" className='cursorHand' onClick={userHelper.signOut}>
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
                <div className='banner-settings'>
                    {props.isLoggedIn === true ?
                        <BiLogOutCircle title="Logout" size={'1.5rem'} className="cursorHand" onClick={userHelper.signOut} />
                        :
                        <BiLogInCircle title="Login" size={'1.5rem'} className="cursorHand" onClick={() => console.log('poop')} component="Link" to="/login" />
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default MobileMenu;
