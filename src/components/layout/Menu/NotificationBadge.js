import React from "react";
import { Badge } from "@mui/material";
import { SlUser } from "react-icons/sl";
import useNotifications from "helpers/useNotifications";

const NotificationBadge = () => {
  const { notificationCount, isPolling } = useNotifications();

  return (
    <Badge
      badgeContent={notificationCount}
      color={isPolling ? "warning" : "error"} // Different color for polling
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <SlUser size="1.5rem" />
    </Badge>
  );
};

export default NotificationBadge;
