import { Menu, MenuItem, View } from '@aws-amplify/ui-react';
import {Link} from 'react-router-dom';
import React from "react";
import {userFunctions} from '../../helpers';


const MyMenu = (props) => {
    
    return (
        
        <View width="4rem">
            <Menu size="large">
            
                <MenuItem><Link to='/profile'>Ble</Link></MenuItem>
            
            <MenuItem >
                     <Link to="/">Home</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/profile">{props.isLoggedIn === true ? 'My' : ''} Profile</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/about">About</Link>
                </MenuItem>
                {props.isLoggedIn === false ?
                
                    <MenuItem>
                        <Link to="/login">Login</Link>
                    </MenuItem>
                    : null 
                }
                {props.isLoggedIn === true ?
                    <MenuItem onClick={userFunctions.signOut}>
                        Logout
                    </MenuItem>
                    :null
                }
                {props.testing === true ? 
                    <MenuItem >
                        <Link to='/authTest'>Auth Test</Link>
                    </MenuItem>
                    :null
                }
            </Menu>
          </View>    
    );
}

export default MyMenu;
