import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';
import { notificationAPI } from 'api/services';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
    }
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    await notificationAPI.markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
  };

  return (
    <Box>
      <Typography variant="h5">Notifications</Typography>
      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem>
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography variant="body2">{notification.message}</Typography>
                    {notification.url && (
                      <Link href={notification.url} target="_blank" rel="noopener">
                        View Details
                      </Link>
                    )}
                  </>
                }
              />
              {!notification.is_read && (
                <Button
                  variant="outlined"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;
