import React, { useState } from "react";
import { Box, Card, Divider, Typography, CardActions, Button } from "@mui/material";
import { AiOutlineComment } from "react-icons/ai";
import { Link } from "react-router-dom";
import MyModal from "components/layout/MyModal";
import { Comments } from "../Comments/Comments";
import { H2H } from "..";

const Match = ({ match, showH2H = false, color }) => {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isH2HModalOpen, setIsH2HModalOpen] = useState(false);

  const scores = match.score.split(",").map((set) => {
    const [p1, p2] = set.match(/\d+/g).map(Number);
    return { p1, p2 };
  });

  return (
    <Card sx={{ p: 2, mb: 2, ...(color && {backgroundColor: color}) }} >
      {/* Played Date */}
      <Typography variant="subtitle2" fontStyle="italic" align="center" gutterBottom>
        {match.played_on}
      </Typography>

      {/* Player1 and Scores */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6">
          <Link to={`/players/${match.winners[0]?.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            {match.winners[0]?.name}
          </Link>
        </Typography>
        <Box display="flex" gap={2}>
          {scores.map((set, index) => (
            <Typography key={index} variant="h6">
              {set.p1}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Divider */}
      <Divider />

      {/* Player2 and Scores */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
        <Typography variant="h6">
          <Link to={`/players/${match.losers[0]?.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            {match.losers[0]?.name}
          </Link>
        </Typography>
        <Box display="flex" gap={2}>
          {scores.map((set, index) => (
            <Typography key={index} variant="h6">
              {set.p2}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Action Icons */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 2 }}>
       
        <CardActions>
          {/* Comments Icon */}
          <Button size="small" color="primary" onClick={() => setIsCommentsModalOpen(true)}>
            <AiOutlineComment size={24} /> Comments
          </Button>
          {/* H2H Icon (conditionally shown) */}
          {showH2H && (<Button size="small" color="primary" onClick={() => setIsH2HModalOpen(true)}>
            See H2H
          </Button>
          )}
        </CardActions>
      </Box>

      {/* Comments Modal */}
      <MyModal
        showHide={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        title="Comments"
      >
        <Comments entityId={match.id} entityType="match" showComments />
      </MyModal>

      {/* H2H Modal */}
      <MyModal
        showHide={isH2HModalOpen}
        onClose={() => setIsH2HModalOpen(false)}
        title={`H2H: ${match.winners[0]?.name} vs ${match.losers[0]?.name}`}
      >
        <H2H winners={[match.winners[0]]} losers={[match.losers[0]]} />
      </MyModal>
    </Card>
  );
};

export default Match;
