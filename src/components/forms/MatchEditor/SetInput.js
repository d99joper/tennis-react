import { TextField, IconButton, Tooltip, Box, Typography, DialogTitle, DialogContent, DialogActions, Dialog, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const SetInput = ({ isRemovable, value, onChange, sx, matchLogic }) => {
  const [setScore, setSetScore] = useState(value ?? '');
  const [error, setError] = useState(false);
  const [openTiebreakDialog, setOpenTiebreakDialog] = useState(false);
  const [tiebreakScore, setTiebreakScore] = useState({ p1: '', p2: '' });
  const [isTiebreakCandidate, setIsTiebreakCandidate] = useState(false);
  const spanRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(55); // min width

  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setInputWidth(Math.max(width + 14, inputWidth)); // Add some padding
    }
  }, [setScore]);

  const handleOpenTiebreakDialog = () => {
    //setCurrentTieBreakSetIndex(index)
    setOpenTiebreakDialog(true);
  };

  const handleCloseTiebreakDialog = () => {
    setOpenTiebreakDialog(false);
    setTiebreakScore("");
    //setCurrentTieBreakSetIndex(null)
  };

  const handleTiebreakSubmit = () => {
    if (/^\d+$/.test(tiebreakScore.p1) && /^\d+$/.test(tiebreakScore.p2)) {
      if (tiebreakScore.p1 !== tiebreakScore.p2) {
        //const set = matchLogic.sets[currentTiebreakSetIndex];
        // take the lowest value
        const tbScore = tiebreakScore.p1 > tiebreakScore.p2 ? tiebreakScore.p2 : tiebreakScore.p1;
        //matchLogic.handleSetChange(currentTiebreakSetIndex, `${setScore}(${tbScore})`);
        const newScore = `${setScore}(${tbScore})`;
        setSetScore(newScore);
        onChange(newScore);
        handleCloseTiebreakDialog();
        setTiebreakScore("");
        //setCurrentTieBreakSetIndex(null)
      }
    }
  };

  //const formatScore = (score) => score.replace(/[^\d- ]/g, '').trim(); // No parentheses allowed
  // const formatScore = (score) => {
  //   return score
  //     .replace(/[^0-9-\(\)]/g, '') // Allow only numbers and dashes
  //     .replace(/^-/, '') // Remove leading dashes
  //     .replace(/--+/g, '-') // Replace multiple dashes with a single dash
  //     .replace(/^(\d+-\d+)-/, '$1'); // Prevent trailing dash after full score
  // };
  const formatScore = (score) => {
    // Remove anything that's not digit, dash or parentheses
    let cleaned = score.replace(/[^0-9\-\(\)]/g, '');
  
    // Match:
    // - p1: 1-2 digits
    // - dash
    // - p2: 1-2 digits
    // - optional tiebreak: (1-2 digits, optional closing parenthesis)
    const match = cleaned.match(/^(\d{0,2})(-)?(\d{0,2})?(\(\d{0,2}\)?)?/);
  
    if (!match) return '';
  
    const [, p1, dash, p2, tiebreak] = match;
    return `${p1 || ''}${dash || ''}${p2 || ''}${tiebreak || ''}`;
  };

  const handleSetChange = (e) => {
    let newScore = formatScore(e.target.value);
    const games = newScore.match(/\d+/g)?.map(Number);
    let isTiebreakCandidate = false
    if (games?.length === 2)
      isTiebreakCandidate = Math.abs(games[0] - games[1]) === 1;
    setIsTiebreakCandidate(isTiebreakCandidate);
    setSetScore(newScore);
    onChange(newScore);
  };

  const handleBlur = () => {
    const match = setScore.match(/^(\d{1,2})-(\d{1,2})(?:\((\d{1,2})\))?$/);
  
    if (match) {
      const p1 = Number(match[1]);
      const p2 = Number(match[2]);
      const tb = match[3] !== undefined ? Number(match[3]) : null;
  
      const mainValid = p1 <= 99 && p2 <= 99;
      const tbValid = tb === null || tb <= 99;
  
      if (mainValid && tbValid) {
        setError(false);
        onChange(setScore);
        return;
      }
    }
  
    setError(true);
  };

  return (
    <Box display="flex" alignItems="center">
      <TextField
        sx={{ ...sx, width: `${inputWidth}px`, textAlign: "center" }}
        variant="outlined"
        size="small"
        value={setScore}
        onChange={handleSetChange}
        onBlur={handleBlur}
        error={error}
        //helperText={error ? "*" : ""}
        placeholder="X-X"
        slotProps={{ htmlInput: {inputMode: "numeric"}, input: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 5, style: {  textAlign: "center" } } }}
      />
      {/* Invisible span for measuring text width */}
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize: '14px',
          fontFamily: 'monospace',
          padding: '4px 8px',
        }}
      >
        {setScore || ' '}
      </span>
      {isRemovable && (
        <Tooltip title="Remove set">
          <IconButton
            tabIndex={-1}
            size="small"
            sx={{
              color: "white",
              position: "absolute",
              top: "-2px",
              right: "-2px",
              zIndex: 10, // Ensures it appears in front
              pointerEvents: "auto",
              width: 14,
              height: 14,
              backgroundColor: "red",
              borderRadius: "50%",
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.4)', // Example: Add a subtle background
                color: 'black', // Example: Change the icon color
              },
            }}
            onClick={() => matchLogic.removeSet()}
          >
            {/* <AiOutlineMinusCircle color="white" size={16} /> */}
            <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>X</Typography>
          </IconButton>
        </Tooltip>
      )}
      {isTiebreakCandidate && (
        <Tooltip title="Add Tiebreak Score">
          <IconButton
            size="small"
            sx={{
              ml: 0.2,
              position: 'absolute',
              bottom: '0px',
              right: '-12px',
              width: 14,
              height: 14,
              backgroundColor: "blue",
              color: "white",
              borderRadius: "50%"
            }}
            onClick={() => handleOpenTiebreakDialog()}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "0.6rem" }}>T</Typography>
          </IconButton>
        </Tooltip>
      )}
      {/* Tiebreak Input Dialog */}
      <Dialog open={openTiebreakDialog} onClose={handleCloseTiebreakDialog}>
        <DialogTitle>Tiebreak Score</DialogTitle>
        <DialogContent>
          <Typography>Do you want to add a tiebreak score?</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
            <TextField
              autoFocus
              sx={{ width: 47 }}
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="outlined"
              value={tiebreakScore.p1}
              onChange={(e) => setTiebreakScore((prev) => ({ ...prev, p1: e.target.value.replace(/[^\d]/g, '') }))} // Only numbers allowed
              slotProps={{ htmlInput: {inputMode: "numeric"}, input: { inputMode: "numeric", pattern: "[0-9]*" } }}
            />
            <Typography>-</Typography>
            <TextField
              sx={{ width: 47 }}
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="outlined"
              value={tiebreakScore.p2}
              onChange={(e) => setTiebreakScore((prev) => ({ ...prev, p2: e.target.value.replace(/[^\d]/g, '') }))} // Only numbers allowed
              slotProps={{ htmlInput: {inputMode: "numeric"}, input: { inputMode: "numeric", pattern: "[0-9]*" } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTiebreakDialog} color="secondary">Cancel</Button>
          <Button onClick={handleTiebreakSubmit} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SetInput;
