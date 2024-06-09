import { View } from "@aws-amplify/ui-react";
import { Popover, Typography } from "@mui/material"
import React, { useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { MdOutlineInfo } from "react-icons/md";

function InfoPopup({ children, iconType = 'info', customIcon = null, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const { paddingLeft, color, paddingRight, width, size } = props
  const open = Boolean(anchorEl)
  
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }

  const iconProps = {
    size: size ?? 16,
    color: color ?? '#44F',
    onClick: handleClick,
    className: 'cursorHand',
  }
  
  return (
    <View as='span'
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      {/******** POPOVER FOR INFO   *********/}
      <Popover
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
        open={open}
      >
        <Typography sx={{ p: 2, backgroundColor: '#e8e8ff', width: width ?? '500px' }} as='div'>
          {children}
        </Typography>
      </Popover>
      {iconType === 'info' &&
        <MdOutlineInfo {...iconProps} />
      }
      {iconType === 'warning' &&
        <AiFillWarning {...iconProps} />
      }
      {iconType === 'custom' &&
        React.cloneElement(customIcon, { ...iconProps })
      }
      
    </View>
  )
}

export default InfoPopup
