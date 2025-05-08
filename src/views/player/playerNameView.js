import React from "react";
import { Box, Typography } from "@mui/material";
import { ProfileImage } from "../../components/forms/ProfileImage";
import { Link } from "react-router-dom";

const PlayerNameView = ({ player, asLink = false, size = 30 }) => {

  const boxContent = (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }} >
      <ProfileImage player={player} size={size} />
      <Typography>{player.name}</Typography>
    </Box >
  )
  
  return (
    asLink 
    ? (
      <Link to={"/players/"+player.slug}>{boxContent}</Link>
    )
    : boxContent
    
  );
};

export default PlayerNameView