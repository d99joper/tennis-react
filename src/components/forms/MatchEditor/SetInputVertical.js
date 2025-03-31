import { TextField, Box } from "@mui/material";
import React, { useState } from "react";

const SetInput_Vertical = ({ setIndex, player1Score, player2Score, tiebreakScore, onChange, handleBlur }) => {
  const [localPlayer1Score, setLocalPlayer1Score] = useState(player1Score ?? '');
  const [localPlayer2Score, setLocalPlayer2Score] = useState(player2Score ?? '');
  const [localTiebreakScore, setLocalTiebreakScore] = useState(tiebreakScore ?? '');
  const [error, setError] = useState(false);

  const formatScore = (score) => score.replace(/[^\d]/g, '').trim(); // Only allow numbers

  const handleSetChange = (e, player) => {
    let newScore = formatScore(e.target.value);

    if (player === "player1") {
      setLocalPlayer1Score(newScore);
      onChange(setIndex, "player1", newScore);
    } else if (player === "player2") {
      setLocalPlayer2Score(newScore);
      onChange(setIndex, "player2", newScore);
    }
  };

  const handleTiebreakChange = (e) => {
    let newTiebreak = formatScore(e.target.value);
    setLocalTiebreakScore(newTiebreak);
    onChange(setIndex, "tiebreak", newTiebreak);
  };

  const handleBlurEvent = () => {
    const p1 = parseInt(localPlayer1Score, 10);
    const p2 = parseInt(localPlayer2Score, 10);
    const tb = localTiebreakScore ? parseInt(localTiebreakScore, 10) : null;

    if (isNaN(p1) || isNaN(p2) || p1 === p2) {
      setError(true);
    } else {
      setError(false);

      if (handleBlur) {
        handleBlur(setIndex, p1, p2, tb);
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: 80 }}>
      {/* Player 1 Score */}
      <TextField
        variant="outlined"
        size="small"
        value={localPlayer1Score}
        onChange={(e) => handleSetChange(e, "player1")}
        onBlur={handleBlurEvent}
        slotProps={{ input: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 2, style: { textAlign: "center" } } }}
        sx={{ width: 45, fontSize: '0.8rem', p: 0 }}
      />

      {/* Player 2 Score */}
      <TextField
        variant="outlined"
        size="small"
        value={localPlayer2Score}
        onChange={(e) => handleSetChange(e, "player2")}
        onBlur={handleBlurEvent}
        slotProps={{ input: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 2, style: { textAlign: "center" } } }}
        sx={{ width: 45, fontSize: '0.8rem', p: 0, mt: 0.5 }}
      />

      {/* Tiebreak Score (Only show if needed) */}
      {(localPlayer1Score === "7" && localPlayer2Score === "6") || (localPlayer1Score === "6" && localPlayer2Score === "7") ? (
        <Box>
          <TextField
            variant="outlined"
            size="small"
            value={localTiebreakScore}
            onChange={handleTiebreakChange}
            onBlur={handleBlurEvent}
            slotProps={{ input: { inputMode: "numeric", pattern: "[0-9]*", maxLength: 2, style: { textAlign: "center" } } }}
            sx={{ width: 35, fontSize: '0.8rem', p: 0 }}
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default SetInput_Vertical;
