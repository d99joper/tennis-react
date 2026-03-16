import React, { useState } from "react";
import { Box, Card, Divider, Typography, CardActions, Button } from "@mui/material";
import { AiOutlineComment } from "react-icons/ai";
import { Link } from "react-router-dom";
import MatchEventChips from './MatchEventChips';
import MyModal from "shared/components/layout/MyModal";
import { Comments } from 'shared/components/Comments/Comments';
import H2H from 'shared/components/H2H/H2H';
import { getMatchContext } from "types/match";
import { userHelper as uh } from "helpers";

/** Render a list of player name links, separated by " / " for doubles */
const PlayerNames = ({ players, variant = "body2", fontWeight, noWrap = false }) => (
  <Typography variant={variant} fontWeight={fontWeight} noWrap={noWrap} component="span">
    {players.map((p, i) => (
      <React.Fragment key={p.id}>
        {i > 0 && ' & '}
        <Link to={`/players/${p.slug}`}>
          {p.name}
        </Link>
      </React.Fragment>
    ))}
  </Typography>
);

/** Show participant label when it adds value (pair / team — not solo player) */
const ParticipantLabel = ({ match }) => {
  const { isTeamOrPair } = getMatchContext(match);
  if (!isTeamOrPair) return null;

  const label = match.winner_participant?.content_type === 'team' ? 'Team' : 'Pair';

  return (
    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
      As: {match.winner_participant.name} ({label})
    </Typography>
  );
};

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
          <Box fontWeight="bold">
            <PlayerNames players={match.winners} variant="body2" fontWeight="bold" noWrap />
          </Box>
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
          <Box>
            <PlayerNames players={match.losers} variant="body2" noWrap />
          </Box>
          <Box display="flex" gap={1}>
            {scores.map((set, i) => (
              <Typography key={i} variant="body2">
                {set.p2}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Event badge & participant label */}
        <MatchEventChips event={match.event} division={match.division} />
        <ParticipantLabel match={match} />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 2, mb: 2, ...(color && { backgroundColor: color }) }} >
      {/* Played Date */}
      <Typography variant="subtitle2" fontStyle="italic" align="center" gutterBottom>
        {match.played_on}
      </Typography>

      {/* Winners and Scores */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <PlayerNames players={match.winners} variant="h6" />
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

      {/* Losers and Scores */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
        <PlayerNames players={match.losers} variant="h6" />
        <Box display="flex" gap={2}>
          {scores.map((set, index) => (
            <Typography key={index} variant="h6">
              {set.p2}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Event badge & participant label */}
      <Box sx={{ mt: 1 }}>
        <MatchEventChips event={match.event} division={match.division} />
        <ParticipantLabel match={match} />
      </Box>

      {/* Action Icons */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} sx={{ mt: 2 }}>
        <CardActions>
          {/* Comments Icon */}
          <Button size="small" color="primary" onClick={() => setIsCommentsModalOpen(true)}>
            <AiOutlineComment size={24} /> Comments
          </Button>
          {/* H2H Icon (conditionally shown) */}
          {showH2H && (
            <Button size="small" color="primary" onClick={() => setIsH2HModalOpen(true)}>
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
        title={`H2H: ${uh.getPlayerNamesString(match.winners)} vs ${uh.getPlayerNamesString(match.losers)}`}
      >
        <H2H winners={match.winners} losers={match.losers} />
      </MyModal>
    </Card>
  );
};

export default Match;
