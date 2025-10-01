import { Avatar, Box } from "@mui/material"
import { helpers } from "helpers"
import { SlUser } from "react-icons/sl"

import React, { createContext, useContext, useState } from 'react'
import { useEffect } from "react";
import { Link } from "react-router-dom";

// Create a context to manage the state
const ProfileImageContext = createContext();

// PlayerImageContextProvider component to wrap around the app
const ProfileImageProvider = ({ children }) => {

  const [profiles, setProfiles] = useState({})

  const setProfileImage = (profileId, imageUrl) => {
    setProfiles((prevProfiles) => ({
      ...prevProfiles,
      [profileId]: { // only set the loaded to true if there is an imageUrl provided
        imageUrlWithRandomNumber: imageUrl ? `${imageUrl}?${Math.random()}` : 'none',
        isImageLoaded: imageUrl ? true : false,
      },
    }))
  }

  const getProfileImage = (profileId) => {
    return profiles[profileId] || {};
  };

  return (
    <ProfileImageContext.Provider value={{ setProfileImage, getProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  )
}

// UserProfile component to use wherever you need it in your app
const ProfileImage = ({ player, size, asLink=false, showName=false, ...props }) => {
  const { setProfileImage, getProfileImage } = useContext(ProfileImageContext);
  //console.log('ProfileImage render for player:', player)
  useEffect(() => {
    // try to get the stored imagem, if there is one
    const { imageUrlWithRandomNumber, isImageLoaded } = getProfileImage(player.id);
    // Set the profile image when the component mounts and there is an image
    //console.log(imageUrlWithRandomNumber, isImageLoaded, player)
    if (!isImageLoaded && imageUrlWithRandomNumber != 'none') {
      //console.log('set player', player.image_urls)
      setProfileImage(player.id, props.useFullImage ? player.image_urls?.full : player.image_urls?.thumbnail);
    }
  }, [player, getProfileImage, setProfileImage])

  function stringAvatar() {
    try {
      const { imageUrlWithRandomNumber, isImageLoaded } = getProfileImage(player.id);

      //console.log(imageUrlWithRandomNumber, isImageLoaded)
      const jsonObj = {
        sx: {
          ...player ? { bgcolor: helpers.stringToColor(player.id) } : null,
          width: size,
          height: size,
          border: 1
        },
        ...isImageLoaded
          ? { src: imageUrlWithRandomNumber }
          : { children: <SlUser {...size ? { size: size } : null} /> }
      }

      return jsonObj
    }
    catch (e) { console.log(e) }
  }
  const avatar = <Avatar {...stringAvatar()} className={props.className} onClick={props.onClick} />
  
  const boxAvatar = (
    <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', gap:1}}>
      {avatar} {player.name}
    </Box>
  )
  
  if (asLink === true) return (
    <Link to={"/players/"+player.slug} >
      {showName === true ? boxAvatar : <>{avatar}</>}
    </Link>
  )
  
  if (showName === true) return boxAvatar

  return avatar
  
};

export { ProfileImageProvider, ProfileImageContext, ProfileImage };
