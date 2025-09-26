// Component for truncated description with popup
import { Box, Popover, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { helpers } from "helpers";
import { useEffect, useRef, useState } from "react";

const TruncatedText = ({ text }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Check if text is truncated
  useEffect(() => {
    if (textRef.current && text) {
      const element = textRef.current;
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setIsTruncated(isOverflowing);
    }
  }, [text]);

  if (!text) return null;

  return (
    <Box>
      <Typography 
        ref={textRef}
        variant="body1" 
        color="text.secondary" 
        gutterBottom
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          mb: isTruncated ? 1 : 0
        }}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(helpers.parseTextToHTML(text)) }}
      />
      
      {isTruncated && (
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
            display: 'inline-block',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={handleClick}
        >
          ...more
        </Typography>
      )}

      <Popover
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
        open={open}
        sx={{ maxWidth: '800px' }}
      >
        <Box sx={{ p: 3, backgroundColor: '#e8e8ff', maxWidth: '700px', minWidth: '400px' }}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(helpers.parseTextToHTML(text)) }} />
        </Box>
      </Popover>
    </Box>
  );
};

export default TruncatedText;