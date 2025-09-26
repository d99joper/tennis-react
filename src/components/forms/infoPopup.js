import { Box, Popover, Typography } from "@mui/material"
import React, { useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { MdOutlineInfo } from "react-icons/md";
import { useTheme } from "@mui/material";

function InfoPopup({ children, iconType = 'info', customIcon = null, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const { paddingLeft, color, paddingRight, width, size, backgroundColor } = props
  const open = Boolean(anchorEl)
  const theme = useTheme();

  const handleClick = (e) => {
    console.log(e)
    e.stopPropagation();
    setAnchorEl(e.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }

  const iconProps = {
    size: size ?? null,
    color: color ?? theme.palette.primary.info,
    onClick: (e) => handleClick(e),
    className: 'cursorHand'
  }
  
  return (
    <Box
      sx={{pl: paddingLeft, pr: paddingRight}}
      onClick={(e) => e.stopPropagation()}
      as='span'
      maxWidth={'200px'}
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
        <Typography sx={{ p: 2, backgroundColor: backgroundColor ??'#e8e8ff', width: width ?? '500px' }} as='div'>
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
      
    </Box>
  )
}

export default InfoPopup
