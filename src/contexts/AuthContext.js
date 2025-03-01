import { authAPI, playerAPI, subscriptionAPI } from 'api/services';
import { helpers } from 'helpers';
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user details here
  const [loading, setLoading] = useState(true);  // Add loading state
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        // Validate the token and fetch user details from the server
        //const user = await authAPI.getUser();
        console.log('check if player is logged in')
        let currentUser = await playerAPI.getPlayer(null, true)
        if (helpers.hasValue(currentUser)) {
          setIsLoggedIn(true);
          const currentSubscription = await subscriptionAPI.getPlayerSubscription();
          if (currentSubscription?.is_active) {
            switch (currentSubscription?.plan.name.toLowerCase()) {
              case "pro":
                currentUser.isProSubscriber = true
                break;
              case "basic":
                currentUser.isBasicSubscriber = true
                break;
              default:
                break;
            }
          }
          setUser(currentUser);
          console.log('current user', currentUser)
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
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
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading  }}>
      {children}
    </AuthContext.Provider>
  );
};
