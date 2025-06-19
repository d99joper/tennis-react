import MyModal from "components/layout/MyModal";
import Conversation from "./conversations";
import { Box, Typography } from "@mui/material";
import { AiOutlineMessage } from "react-icons/ai";
import { useState } from "react";

const ConverstationButton = ({ player1, player2, title, text, size }) => {
  const [showChatModal, setShowChatModal] = useState(false);
  //console.log(player1, title, text, size)


  return (
    <Box display={'flex'} gap={1} alignItems={'center'}>
      <AiOutlineMessage
        onClick={() => setShowChatModal(true)}
        color='green'
        size={size || 25}
        cursor={'pointer'}
      />
      <Typography sx={{ cursor: 'pointer', color: 'green' }} onClick={() => setShowChatModal(true)}>{text}</Typography>
      <MyModal
        showHide={showChatModal}
        onClose={() => setShowChatModal(false)}
        title={title || 'Send a message'}
      >
        Send a message
        <Conversation player1={player1} player2={player2} />
      </MyModal>
    </Box>
  )
}

export default ConverstationButton;