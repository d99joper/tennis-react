import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Grid2 as Grid,
  Button,
  LinearProgress,
} from '@mui/material';
import { AiOutlineMail, AiOutlineCheck, AiOutlineDelete, AiOutlineMessage } from 'react-icons/ai';
import { useNotificationsContext } from 'contexts/NotificationContext';
import { Link } from 'react-router-dom';
import notificationAPI from 'api/services/notifications';
import requestAPI from 'api/services/request';
import { ProfileImage } from 'components/forms';
import { useSnackbar } from 'contexts/snackbarContext';
import { Helmet } from 'react-helmet-async';
import MyModal from 'components/layout/MyModal';
import Conversation from 'components/forms/Conversations/conversations';
import { AuthContext } from 'contexts/AuthContext';

const NotificationsView = () => {
  const [loading, setLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { notifications, notificationCount, markAsRead, deleteNotification, updateNotification } = useNotificationsContext();
  //const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { showSnackbar } = useSnackbar();
  const { user, isLoggedIn } = useContext(AuthContext);

  const handleSelectNotification = async (notification) => {
    if (selectedNotification?.id !== notification.id) {
      setLoading(true)
      try {
        setSelectedNotification(notification);
        const details = await notificationAPI.getNotification(notification.id);
        setSelectedNotification(details)
        //check if there is a selected notification already
        if (selectedNotification && !selectedNotification.is_read &&
          String(selectedNotification.id) !== String(notification.id)) {
          // mark it as read, but don't remove it from the list
          markAsRead(selectedNotification.id, true);
        }
      }
      catch (e) {
        console.log('failed to get notification')
      }
      finally {
        setLoading(false)
      }
    }
  };

  const handleAction = async (approve) => {

    try {
      const response = await requestAPI.processRequest(selectedNotification.id, approve)
      const newStatus = approve ? 'approved' : 'denied';
      updateNotification({ ...selectedNotification, status: newStatus });
      setSelectedNotification({ ...selectedNotification, status: newStatus });
      showSnackbar(response.data.message, "success")
      //setSnackbar({ open: true, message: response.data.message });
    }
    catch (e) {
      showSnackbar("Failed to process the request", "error")
      //setSnackbar({ open: true, message: 'Failed to process the request' });
    }
  }

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  return (
    <Grid container spacing={2}>
      <Helmet>
        <title>Messages | MyTennis Space</title>
      </Helmet>
      {/* Notification Lists */}
      <Grid size={{ xs: 4 }}>
        <Box p={2} borderRight="1px solid #ccc" sx={{ overflow: 'auto', maxHeight: '80vh', }}>
          <Typography variant="h6">Unread Notifications ({notificationCount})</Typography>
          <List>
            {unreadNotifications.map(notification => (
              <ListItem
                key={notification.id}
                onClick={() => handleSelectNotification(notification)}
                sx={{
                  backgroundColor: selectedNotification?.id === notification.id ? '#d0e9cf' : '#f9f9f9',
                  cursor: 'pointer',
                  mb: 1,
                  border: selectedNotification?.id === notification.id ? '1px solid rgb(0, 58, 22)' : '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <ListItemText
                  primary={
                    <span style={{ fontWeight: notification.tempRead ? 'normal' : 'bold' }}>
                      {notification.title}
                    </span>
                  }
                  secondary={new Date(notification.created_at).toLocaleString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                />
                <AiOutlineMail size={20} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Read Notifications</Typography>
          <List>
            {readNotifications.map(notification => (
              <ListItem
                key={notification.id}
                onClick={() => handleSelectNotification(notification)}
                sx={{
                  backgroundColor: selectedNotification?.id === notification.id ? '#d0e9cf' : '#f9f9f9',
                  cursor: 'pointer',
                  mb: 1,
                  border: selectedNotification?.id === notification.id ? '1px solid rgb(0, 58, 22)' : '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <ListItemText
                  primary={notification.title}
                  secondary={new Date(notification.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>

      {/* Notification Content */}
      <Grid size={{ xs: 8 }}>
        <Box display="flex" flexDirection="column" p={2}>
          {selectedNotification && (
            <Box display="flex" alignItems="center" borderBottom="1px solid #ccc" pb={2} mb={2}>
              <IconButton
                onClick={() => markAsRead(selectedNotification.id)}
                disabled={selectedNotification.is_read}
              >
                <AiOutlineCheck size={20} />
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <IconButton
                onClick={() => {
                  selectedNotification.is_read = true;
                  selectedNotification.tempRead = true;
                  deleteNotification(selectedNotification.id)
                }}
              >
                <AiOutlineDelete size={20} />
              </IconButton>
            </Box>
          )}
          {selectedNotification && (
            <Box>
              <Typography variant="h6">
                {selectedNotification.type === 'message' && selectedNotification.sender
                  ? <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Typography>Message From </Typography>
                    <Link to={"/players/" + selectedNotification.sender.slug} target='_blank' >
                      {selectedNotification.sender.name}
                    </Link>
                  </Box>
                  : selectedNotification.title
                }
              </Typography>
              <Typography variant="body2">
                {selectedNotification.message}
              </Typography>
              {loading ? <LinearProgress /> :
                <>
                  {selectedNotification.related_object && (
                    <Box>
                      <Link to={selectedNotification.related_object.url} style={{ marginRight: 10 }} target='_blank'>
                        Go to {selectedNotification.related_object.name}
                      </Link>
                      {selectedNotification.type === 'join_request' &&
                        <Link to={'/players/' + selectedNotification.sender.slug} style={{ marginRight: 10 }} target='_blank'>
                          <Box sx={{ display: "flex", mt: 1, alignItems: "center", gap: 1 }}>
                            <ProfileImage player={selectedNotification.sender} size={30} />
                            <Typography>{selectedNotification.sender.name}</Typography>
                          </Box>
                        </Link>
                      }
                    </Box>

                  )
                  }
                  {selectedNotification.type === 'message' && isLoggedIn && (
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      <AiOutlineMessage
                        onClick={() => setShowChatModal(true)}
                        color='green'
                        size={25}
                        cursor={'pointer'}
                      />
                      <Typography sx={{cursor:'pointer', color: 'green'}} onClick={() => setShowChatModal(true)}>See chat</Typography>
                    </Box>
                  )}
                </>
              }

              {/* Actions */}
              {selectedNotification.type === 'join_request' && (
                <Box mt={2}>
                  {selectedNotification?.status === "pending" ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAction(true)}
                        style={{ marginRight: 10 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleAction(false)}
                      >
                        Deny
                      </Button>
                    </>
                  ) : (
                    <Typography>
                      <i>This request has been {selectedNotification?.status || "processed"}</i>
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
          <MyModal
            showHide={showChatModal}
            onClose={() => setShowChatModal(false)}
            title={`Send ${selectedNotification?.name} a message`}
          >
            Send a message
            <Conversation player1={user} player2={selectedNotification?.sender} />
          </MyModal>
        </Box>
      </Grid>
      {/* 
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      /> */}
    </Grid>

  );
};

export default NotificationsView;
