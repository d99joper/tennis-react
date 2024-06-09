import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Typography } from "@mui/material"
import zIndex from "@mui/material/styles/zIndex"
import { useEffect, useState } from "react"
import { AiFillCloseCircle, AiFillCloseSquare } from "react-icons/ai"

const MyModal = ({ children, showHide, onClose, label, title,
  showClose = true, showTitleClose = true, ...props }) => {
  const [show, setShow] = useState(showHide)

  useEffect(() => {
    //console.log("ShowHide prop changed:", showHide);
    setShow(showHide)
  }, [showHide])

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    //width: '400',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    top: '10%',
    left: '10%',
    overflow: props.overflow ?? 'scroll',
    height: props.height ?? '100%',
    display: 'block'
  }
  const closeButtonStyle = {
    position: 'absolute',
    align: 'center',
    textAlign: 'right',
    top: '10px',
    right: '10px',
    // marginBottom: '10px',
    // paddingBottom: '0.5rem',
    cursor: 'pointer',
    zIndex: 1000
  }

  return (
    <Dialog
      open={show}
      onClose={onClose}
      scroll={'paper'}
    >
      <DialogTitle id="scroll-dialog-title" variant="subtitle1">
        {showTitleClose &&
          <div style={closeButtonStyle} onClick={onClose}>
            <AiFillCloseSquare style={{ backgroundColor: "black", borderRadius: 5 }} color="#05a502" size={30} className="icon-hover-green" />
          </div>
        }
        {title}
      </DialogTitle>
      <DialogContent dividers={false}>

        {/* <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          {children}
        </DialogContentText> */}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>

    // <Modal
    //   aria-labelledby={label ?? title ?? 'no label'}
    //   onClose={onClose}
    //   open={show}
    // >
    //   <Box sx={modalStyle}>
    //     {/* Close Button in Top Right Corner */}
    //     <div style={closeButtonStyle} onClick={onClose}>
    //       <AiFillCloseSquare style={{ backgroundColor: "black", borderRadius: 5 }} color="#05a502" size={30} className="icon-hover-green" />
    //     </div>

    //     {/* Title */}
    //     <Typography variant="subtitle1" marginBottom={'1rem'} marginTop={'0.5rem'}>
    //       {title}
    //     </Typography>

    //     {/* Content */}
    //     {children}
    //   </Box>
    // </Modal>
  )
}

export default MyModal