import React from "react";
import { Badge, Box, Avatar } from "@mui/material";
import { ProfileImage } from "components/forms";

const UserInitialsIcon = ({ user, notificationCount }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    const initials = parts.map((part) => part[0].toUpperCase()).join("").substring(0, 2);
    return initials;
  };
  
  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <Badge
        badgeContent={notificationCount}
        color="error"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <ProfileImage player={user} />
        {/* <Avatar
          sx={{ bgcolor: "secondary.main", color: "black", width: 30, height: 30 }}
        >
          {getInitials(user?.name)}
        </Avatar> */}
      </Badge>
    </Box>
  );
};

export default UserInitialsIcon;
