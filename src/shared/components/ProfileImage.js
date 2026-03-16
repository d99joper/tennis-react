import { Avatar, Box, Typography, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
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

// UserProfile component to use wherever you need it in your app.
// player can be a regular player { id, name, slug, image_urls }
// or a doubles schedule entry { id, name, type: 'doubles', player1: {...}, player2: {...} }
const ProfileImage = ({ player, size, asLink = false, showName = false, showAvatar = true, ...props }) => {
  const { setProfileImage, getProfileImage } = useContext(ProfileImageContext);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const textVariant = isSmall ? 'body2' : 'body1';

  useEffect(() => {
    // Skip image loading for doubles entries
    if (player.type === 'doubles') return;
    const { imageUrlWithRandomNumber, isImageLoaded } = getProfileImage(player.id);
    if (!isImageLoaded && imageUrlWithRandomNumber != 'none') {
      setProfileImage(player.id, props.useFullImage ? player.image_urls?.full : player.image_urls?.thumbnail);
    }
  }, [player, getProfileImage, setProfileImage, props.useFullImage]);

  // Doubles schedule entry: two individually-linked names, no avatar
  if (player.type === 'doubles' && player.player1 && player.player2) {
    const sep = <Typography variant={textVariant} component="span">&amp;</Typography>;
    if (asLink) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          <Link to={`/players/${player.player1.slug}`}>{player.player1.name}</Link>
          {sep}
          <Link to={`/players/${player.player2.slug}`}>{player.player2.name}</Link>
        </Box>
      );
    }
    return (
      <Typography variant={textVariant} component="span">
        {player.player1.name} &amp; {player.player2.name}
      </Typography>
    );
  }

  function stringAvatar() {
    try {
      const { imageUrlWithRandomNumber, isImageLoaded } = getProfileImage(player.id);
      return {
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
    }
    catch (e) { console.log(e) }
  }

  const avatar = showAvatar
    ? <Avatar {...stringAvatar()} className={props.className} onClick={props.onClick} />
    : null;

  const content = (showAvatar || showName)
    ? (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        {avatar}
        {showName && player.name}
      </Box>
    )
    : avatar;

  if (asLink) return (
    <Link to={"/players/" + player.slug}>
      {content}
    </Link>
  );

  return content;
};

export { ProfileImageProvider, ProfileImageContext, ProfileImage };
