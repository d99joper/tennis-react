import React from "react";
import { Badge } from "@mui/material";
import { useNotificationsContext } from "contexts/NotificationContext";

const NotificationBadge = ({ children, vertical, horizontal }) => {
  const { notificationCount } = useNotificationsContext();

  return (
    <Badge
      showZero={false}
      badgeContent={notificationCount}
      color="error"
      anchorOrigin={{
        vertical: vertical || "top",
        horizontal: horizontal || "right",
      }}
    >
      {children}
    </Badge>
  );
};

export default NotificationBadge;
