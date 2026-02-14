// Component for truncated description with accordion or popup
import { Box, Collapse, Popover, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { helpers } from "helpers";
import { useEffect, useRef, useState } from "react";

const TruncatedText = ({ text, mode = 'accordion' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    if (mode === 'popover') {
      setAnchorEl(e.currentTarget);
    } else {
      setExpanded(!expanded);
    }
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
      {mode === 'accordion' ? (
        // Accordion mode (default)
        <>
          <Typography 
            ref={textRef}
            variant="body1" 
            color="text.secondary" 
            gutterBottom
            sx={{
              display: expanded ? 'block' : '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : 2,
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
              {expanded ? 'show less' : '...more'}
            </Typography>
          )}
        </>
      ) : (
        // Popover mode
        <>
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
        </>
      )}
    </Box>
  );
};

export default TruncatedText;