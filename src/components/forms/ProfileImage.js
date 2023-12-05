import { Avatar } from "@mui/material"
import { helpers } from "helpers"
import { SlUser } from "react-icons/sl"

import React, { createContext, useContext, useState } from 'react'
import { useEffect } from "react";

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
const ProfileImage = ({ player, size, ...props }) => {
  const { setProfileImage, getProfileImage } = useContext(ProfileImageContext);

  useEffect(() => {
    // try to get the stored imagem, if there is one
    const { imageUrlWithRandomNumber, isImageLoaded } = getProfileImage(player.id);

    // Set the profile image when the component mounts and there is an image
    if (!isImageLoaded && imageUrlWithRandomNumber != 'none') {
      setProfileImage(player.id, player.image);
    }
  }, [player, getProfileImage, setProfileImage])

  function stringAvatar() {
    try {
      const { imageUrlWithRandomNumber, isImageLoaded } = getProfileImage(player.id);
      const jsonObj = {
        sx: {
          ...player ? { bgcolor: helpers.stringToColor(player.name) } : null,
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

  return (
    <Avatar {...stringAvatar()} className={props.className} onClick={props.onClick} />
  )
};

export { ProfileImageProvider, ProfileImage };

//
// *****************************************
// profile image using localstorage
// *****************************************
//
// const ProfileImage2 = ({ player, size, ...props }) => {

//   function stringAvatar() {
//     try {
//       // try to get the image from localStorage
//       let imageUrl = localStorage.getItem(`profile_image_${player.id}`)
//       if (!imageUrl) {
//         // there was no image stored, so set the image
//         // it will be in local storage until player logs out, or player updates its image 
//         imageUrl = `${player.image}?dummy=${Math.random()}`
//         localStorage.setItem(`profile_image_${player.id}`, imageUrl)
//       }

//       const jsonObj = {
//         sx: {
//           ...player ? { bgcolor: helpers.stringToColor(player.name) } : null,
//           width: size,
//           height: size,
//           border: 1
//         },
//         ...player && player.image
//           ? { src: imageUrl }
//           : { children: <SlUser {...size ? { size: size * 0.65 } : null} /> }
//       }

//       return jsonObj
//     }
//     catch (e) { console.log(e) }
//   }

//   return (
//     <Avatar {...stringAvatar()} className={props.className} onClick={props.onClick} />
//   )
// }

//export default ProfileImage2