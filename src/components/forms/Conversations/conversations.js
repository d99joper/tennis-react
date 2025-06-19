import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { AiOutlineSend } from "react-icons/ai";
import notificationAPI from "api/services/notifications";
import { ProfileImage } from "components/forms";
import { AuthContext } from "contexts/AuthContext";

const Conversation = ({ player1, player2 }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const {user} = useContext(AuthContext)

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await notificationAPI.getConversation(player2.id);
        setMessages(response.messages);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [player2]);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      setSending(true);
      await notificationAPI.createNotification({
        'recipient_id': player2.id, 
        'message': messageText,
        'title': 'Message from ' + user.name,
        'type': 'message'
      });
      setMessageText("");

      // Refresh messages
      const response = await notificationAPI.getConversation(player2.id);
      setMessages(response.messages);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" maxWidth={500} p={2} boxShadow={3} borderRadius={2} bgcolor="background.paper">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <ProfileImage player={player2} size={40} />
          <Typography variant="h6" ml={2}>{player2.name}</Typography>
        </Box>
      </Box>

      {/* Message List */}
      <Box flex={1} overflow="auto" maxHeight={400} border="1px solid #ddd" borderRadius={2} p={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          messages.length > 0 ?
          messages.map((msg) => (
            <Box key={msg.id} mb={2} textAlign={msg.sender === player1.id ? "right" : "left"}>
              <Typography variant="body2" bgcolor={msg.sender === player1.id ? "#d0e9cf" : "#f0f0f0"} p={1} borderRadius={1} display="inline-block">
                <b>{msg.sender === player1.id ? "You" : player2.name}:</b> {msg.message}
              </Typography>
              <Typography variant="caption" display="block" color="gray">
                {new Date(msg.created_at).toLocaleString()}
              </Typography>
            </Box>
          ))
          : <i>There are no messages yet.</i>
        )}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box mt={2} display="flex" alignItems="center">
        <TextField
          fullWidth
          multiline
          rows={2}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
        />
        <Button onClick={sendMessage} disabled={sending} sx={{ ml: 1 }} variant="contained">
          <AiOutlineSend size={20} />
        </Button>
      </Box>
    </Box>
  );
};

export default Conversation;
