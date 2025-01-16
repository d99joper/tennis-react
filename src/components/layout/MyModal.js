import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useEffect, useState } from "react"
import { AiFillCloseSquare } from "react-icons/ai"

const MyModal = ({
  children,
  showHide,
  onClose,
  label,
  title,
  showClose = true,
  showTitleClose = true,
  minWidth = '400px', // Add minWidth as a prop with a default value
  ...props
}) => {
  const [show, setShow] = useState(showHide)

  useEffect(() => {
    setShow(showHide)
  }, [showHide])

  const closeButtonStyle = {
    position: 'absolute',
    align: 'center',
    textAlign: 'right',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    zIndex: 1000
  }

  return (
    <Dialog
      open={show}
      onClose={onClose}
      scroll={'paper'}
      fullWidth // Ensures the dialog uses the full width of the container
      maxWidth="sm" // Set a maximum width for the dialog
    >
      <DialogTitle id="modal-title" sx={{ position: 'relative', minWidth }}>
        {showTitleClose && (
          <Box sx={closeButtonStyle} onClick={onClose}>
            <AiFillCloseSquare
              style={{ backgroundColor: "black", borderRadius: 5 }}
              color="#05a502"
              size={30}
              className="icon-hover-green"
            />
          </Box>
        )}
        <b>{title}</b>
      </DialogTitle>
      <DialogContent dividers={false} sx={{ minWidth }}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}

export default MyModal