import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { InfoPopup, MatchEditor, ProfileImage } from "components/forms";
import MyModal from "components/layout/MyModal";
import authAPI from "api/auth";
import { matchHelper } from "helpers";
import ResponsiveDataLayout from "components/layout/Data/responsiveDataLayout";

const ScheduleView = ({ event, division, schedule: initialSchedule, onScoreReported }) => {
  const [editingMatch, setEditingMatch] = useState(null);
  const [schedule, setSchedule] = useState(initialSchedule)
  const [modalOpen, setModalOpen] = useState(false);

  const currentUser = authAPI.getCurrentUser();

  const handleReportScore = (match) => {
    setEditingMatch(match);
    setModalOpen(true);
  };

  const handleMatchEditorSubmit = (updatedMatch) => {
    setEditingMatch(null);
    const schedule_match = updatedMatch?.schedule_match;
    let new_schedule;
    if (schedule_match) {
      new_schedule = schedule.map((match) =>
        match.id === schedule_match.id ? { ...match, ...schedule_match } : match
      );
      setSchedule(new_schedule);
    }
    if (onScoreReported) {
      // report back to parent
      onScoreReported(updatedMatch, new_schedule);
    }
  };

  const closeModal = () => {
    setEditingMatch(null);
    setModalOpen(false);
  };

  const isPlayer1Winner = (scheduleMatch) => {
    if (scheduleMatch.winners)
      return scheduleMatch.winners.some((winner) => winner.id === scheduleMatch.player1.id);
    // return scheduleMatch.winners.some((winner) => winner.id === scheduleMatch.player1.object_id);
    else
      return true;
  }

  const reverseScore = (score) => {
    return score
      .split(", ") // Split the score into individual sets
      .map((set) => {
        const [first, second] = set.split("-").map(String); // Split the set into scores
        const [cleanSecond, tiebreakScore] = second.split("(").map(String);
        return `${cleanSecond}-${first + (tiebreakScore ? '(' + tiebreakScore : '')}`; // Reverse the scores
      })
      .join(", "); // Join the reversed sets back into a string
  }

  return (
    <Box>

      <ResponsiveDataLayout
        headers={[
          { key: "scheduled_date", label: "Date" },
          { key: "player1.name", label: "Home" },
          { key: "vs", label: "" },
          { key: "player2.name", label: "Guest" },
          { key: "score", label: "Score" },
        ]}
        rows={schedule}
        rowKey={(row) => row.id}
        groupingKey={(row) => row.round}
        renderGroupDivider={(group) => (
          <Box
          // sx={{
          //   padding: "8px 16px",
          //   fontWeight: "bold",
          //   //backgroundColor: "#f1ffe8",
          //   textAlign: "center",
          //   borderBottom: "2px solid rgb(124, 146, 110)",
          // }}
          >
            {`Round: ${group}`}
          </Box>
        )}
        // Large screens
        columnWidths={["15%", "30%", "5%", "30%", "15%"]} // Custom column widths
        sortableColumns={["scheduled_date", "player1.name", "player2.name"]}
        getRowData={(row) => [
          row.reported
            ? (row.played_on != row.scheduled_date)
              ?
              <>
                {new Date(row.played_on).toISOString().split("T")[0]} <br />
                <s>{new Date(row.scheduled_date).toISOString().split("T")[0]} </s>
              </>
              : new Date(row.played_on).toISOString().split("T")[0]
            : new Date(row.scheduled_date).toISOString().split("T")[0],
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <ProfileImage player={row.player1} size={30} />
            <Typography>{row.player1.name}</Typography>
          </Box>,
          (<b>vs</b>),
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <ProfileImage player={row.player2} size={30} />
            <Typography>{row.player2.name}</Typography>
          </Box>,
          row.reported
            ? (isPlayer1Winner(row) ? row.score : reverseScore(row.score))
            : matchHelper.canReportScheduledMatch(event, row, currentUser) 
              ? <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleReportScore(row)}
                >
                  Report score
                </Button>
              :
                (matchHelper.hasEventEnded(event) &&
                <InfoPopup>
                  <Typography>Event has ended. No more scores can be reported.</Typography>
                </InfoPopup>
              ),
        ]}
        // for smaller and medium screens
        titleForScreen={(row, isSmall, isMedium) => (
          <Box sx={{ pb: 2 }}>
            <Typography
              variant={isSmall ? "body2" : "body1"}
              sx={{ marginBottom: 1 }}
            >
              {row.reported ? (
                row.played_on !== row.scheduled_date ? (
                  <>
                    <s>{new Date(row.scheduled_date).toISOString().split("T")[0]}</s>
                    played {new Date(row.played_on).toISOString().split("T")[0]}

                  </>
                ) : (
                  new Date(row.played_on).toISOString().split("T")[0]
                )
              ) : (
                new Date(row.scheduled_date).toISOString().split("T")[0]
              )}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: isMedium ? "1.2rem" : "1rem" }}>
              {row.player1.name} vs {row.player2.name}
            </Typography>
          </Box>
        )}
        basicContentForScreen={(row, isSmall, isMedium) => (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            {row.score
              ? <Typography variant={isSmall ? "body2" : "body1"}>Score: {(isPlayer1Winner(row) ? row.score : reverseScore(row.score))}</Typography>
              : matchHelper.canReportScheduledMatch(event, row, currentUser)
                ? <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1 }}
                  onClick={() => handleReportScore(row)}
                >
                  Report Score
                </Button>
                : ''
            }
          </Box>
        )}
      />
      {/* Match Editor Modal */}
      <MyModal showHide={modalOpen} onClose={closeModal} title="Report Match">
        {editingMatch && (
          <MatchEditor
            participant={currentUser}
            event={event}
            division_id={division?.id}
            matchType={event.match_type}
            scheduleMatchId={editingMatch.id}
            limitedParticipants={[editingMatch.player1, editingMatch.player2]}
            //date={editingMatch.scheduled_date}
            onSubmit={(matchData) => {
              console.log("Match reported:", matchData);
              handleMatchEditorSubmit(matchData);
              closeModal();
            }}
          />
        )}
      </MyModal>
    </Box>
  );
};

export default ScheduleView;
