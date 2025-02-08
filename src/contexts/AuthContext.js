import { authAPI, playerAPI } from 'api/services';
import { helpers } from 'helpers';
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user details here
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Validate the token and fetch user details from the server
        //const user = await authAPI.getUser();
        const player_short = await playerAPI.getPlayer(null, true)
        if (helpers.hasValue(player_short)) {
          setUser(player_short);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    fetchUserDetails();
  }, []);

  const login = async (userData) => {
    try {
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      authAPI.signOut();
      setUser(null);
      setIsLoggedIn(false);
      //redirect to home
      navigate('/', { replace: false })
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
