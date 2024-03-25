import { Box, Modal, Typography } from "@mui/material"
import { useEffect, useState } from "react"

const MyModal = ({ children, showHide, onClose, ...props }) => {
  const [show, setShow] = useState(showHide)

  useEffect(() => {
    console.log("ShowHide prop changed:", showHide);
    setShow(showHide)
  }, [showHide])

  const 	modalStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 'auto',
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		// top:'10%',
		// left:'10%',
		overflow: props.overflow ?? 'scroll',
		height: props.height ?? '100%',
		display: 'block'
	}

  return (
    <Modal
      aria-labelledby="Merge profiles"
      onClose={onClose}
      open={show}
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'1rem'}>
          {`Merge users`}
        </Typography>
        {children}
      </Box>
    </Modal>
  )
}

export default MyModal