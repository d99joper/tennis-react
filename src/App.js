import { withAuthenticator, Menu, MenuItem, View, Link, Flex, Heading } from '@aws-amplify/ui-react';
import { Amplify, Auth } from 'aws-amplify';
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from 'react-router-dom';
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import './App.css';
 import Profile from './profile'
import NoPage from "./NoPage";
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function Home() {
    return <Heading level={2}>Home</Heading>;
  }
  
  function About() {
    return <Heading level={2}>About</Heading>;
  }
  
//   function Profile() {
//     return <Heading level={2}>Profile</Heading>;
//   }

function App({ signOut }) {
  

  return (
    <div className="App">
        <View width="4rem">
            <Router>
            
                <Menu size="large">
                    <MenuItem>
                        <Link href="/">Home</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href="/profile">My Profile</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href="/about">About</Link>
                    </MenuItem>
                </Menu>
            
                {/* <Flex>
                    <ReactRouterLink to="/" component={Link}>Home</ReactRouterLink>
                    <ReactRouterLink to="/about" component={Link}>About</ReactRouterLink>
                    <ReactRouterLink to="/users" component={Link}>Users</ReactRouterLink>
                </Flex> */}

                <Routes>
                    <Route path="/about" element={<About />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Home />} />
          <Route path="*" element={<NoPage />} />
                </Routes>
            </Router>
        </View>

    <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
  export default withAuthenticator(App, {
    socialProviders: ['amazon','facebook','google']
  });