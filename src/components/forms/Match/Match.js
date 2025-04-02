import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, Card, Divider, Typography, CardActions, Button } from "@mui/material";
import { AiOutlineComment } from "react-icons/ai";
import { Link } from "react-router-dom";
import MyModal from "components/layout/MyModal";
import { Comments } from "../Comments/Comments";
import { H2H } from "..";

const Match = ({ match, showH2H = false, color, variant }) => {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isH2HModalOpen, setIsH2HModalOpen] = useState(false);

  const scores = match.score.split(",").map((set) => {
    const [p1, p2] = set.match(/\d+/g).map(Number);
    return { p1, p2 };
  });

  if (variant === 'simple') {
    return (
      <Box sx={{ p: 1, mb: 2 }}>
        {/* Date */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          {match.played_on}
        </Typography>
  
        {/* Shared grid layout for both rows */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr',
            rowGap: 0.5,
            columnGap: '1rem',
          }}
        >
          {/* Winner row */}
          <Typography variant="body2" fontWeight="bold" noWrap>
            <Link
              to={`/players/${match.winners[0]?.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {match.winners[0]?.name}
            </Link>
          </Typography>
          <Box display="flex" gap={1}>
            {scores.map((set, i) => (
              <Typography key={i} variant="body2">
                {set.p1}
              </Typography>
            ))}
          </Box>
  
          {/* Divider (spanning both columns) */}
          <Divider sx={{ gridColumn: '1 / -1', my: 0.5 }} />
  
          {/* Loser row */}
          <Typography variant="body2" noWrap>
            <Link
              to={`/players/${match.losers[0]?.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {match.losers[0]?.name}
            </Link>
          </Typography>
          <Box display="flex" gap={1}>
            {scores.map((set, i) => (
              <Typography key={i} variant="body2">
                {set.p2}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
  
  
  
  return (
    <Card sx={{ p: 2, mb: 2, ...(color && { backgroundColor: color }) }} >
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
