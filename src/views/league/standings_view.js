import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import ResponsiveDataLayout from "components/layout/Data/responsiveDataLayout";
import { ProfileImage } from "components/forms";
import { Link } from "react-router-dom";
import { eventAPI } from "api/services";
import { MdDelete } from "react-icons/md";
import MyModal from "components/layout/MyModal";
import TennisTrophyIcon from "components/icons/trophy";
import { AuthContext } from "contexts/AuthContext";
import Conversation from "components/forms/Conversations/conversations";
import ConverstationButton from "components/forms/Conversations/ConversationButton";

const StandingsView = ({ standings, winner, event_id, isAdmin = false, isParticipant = false, callback }) => {
  const [participantToRemove, setParticipantToRemove] = useState()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState([])
  const [loadingIndex, setLoadingIndex] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    setLoading(new Array(standings.length).fill(false))
  }, [standings])

  const displayDiff = (won, lost) => {
    const diff = won - lost;
    let sign = ''
    if (diff === 0) sign = '+-'
    if (diff > 0) sign = '+'
    return `${won}-${lost} (${sign + diff.toString()})`
  }

  const handleRemoveParticipant = async () => {
    eventAPI.removeParticipant(event_id, participantToRemove.id)
    setShowModal(false)
    setLoading(prev => {
      const newLoading = [...prev]
      newLoading[loadingIndex] = true
      return newLoading
    })
    if (callback)
      await callback()
    setLoading(prev => {
      const newLoading = [...prev]
      newLoading[loadingIndex] = false
      return newLoading
    })
  }

  const rankedStandings = standings.map((row, index) => ({ ...row, rank: index + 1 }));

  return (
    <Box sx={{ padding: 2 }}>
      <ResponsiveDataLayout
        headers={[
          { key: "rank", label: "Rank" },
          { key: "name", label: "Name" },
          { key: "wins", label: "Wins" },
          { key: "losses", label: "Losses" },
          { key: "set_diff", label: "Sets" },
          { key: "game_diff", label: "Games" },
          { key: "actions", label: "" },
        ]}
        rows={rankedStandings}
        rowKey={(row) => row.id}
        // for larger screens (table view)
        sortableColumns={["rank", "wins", "losses", "set_diff", "game_diff"]}
        columnWidths={["1fr", "4fr", "1fr", "1fr", "1fr", "1fr"]} // Custom column widths
        getRowData={(row, index) => [
          (
            row.id === winner?.id
              ?
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <TennisTrophyIcon size={35} /> #{row.rank}
              </Box>
              : `#${row.rank}`

          ),
          //`${(row.rank===1 && row.id === winner?.id) ? <TennisTrophyIcon /> : ''} #${row.rank}`,
          (
            <Link to={'/players/' + row.players[0].slug}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ProfileImage player={row.players[0]} size={30} />
                <Typography>{row.name}</Typography>
              </Box>
            </Link>
          ),
          row.wins,
          row.losses,
          displayDiff(row.sets_won, row.sets_lost),
          displayDiff(row.games_won, row.games_lost),
          <>
            {// if no matches have been played, you can delete the player
              (row.wins + row.losses) === 0 && isAdmin && (
                loading[index]
                  ? <CircularProgress size={20} />
                  : <MdDelete
                    size={20}
                    color="red"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setParticipantToRemove(row);
                      setLoadingIndex(index)
                      setShowModal(true);
                    }}
                  />
              )
            }
            { // if participant, allow chat (update for doubles)
              isParticipant && row.players[0].id !== user?.id && (
                loading[index]
                  ? <CircularProgress size={20} />
                  : <ConverstationButton player1={user} player2={row.players[0]} title={`Message ${row.players[0].name}`} />
              )
            }
          </>
        ]}
        // for smaller and medium screens
        titleForScreen={(row, isSmall, isMedium) => (
          <>
            {isMedium &&
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "primary.main", pr: 2 }}
                >
                  {row.id === winner?.id
                    ?
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                      <TennisTrophyIcon size={35} /> #{row.rank}
                    </Box>
                    : <>#{row.rank}</>
                  }
                </Typography>
                <ProfileImage player={row.players[0]} size={30} asLink={true} showName={true} />
              </Box>
            }
            {isSmall &&
              <Link to={'/players/' + row.players[0].slug}>
                <Typography
                  variant={"h6"}
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {row.id === winner?.id &&
                    <TennisTrophyIcon size={35} />
                  } #{row.rank} {row.name}
                </Typography>
              </Link>
            }
          </>
        )
        }
        basicContentForScreen={(row, isSmall, isMedium) => (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant={isSmall ? "body2" : "body1"}>Wins: {row.wins}</Typography>
            <Typography variant={isSmall ? "body2" : "body1"}>Losses: {row.losses}</Typography>
          </Box>
        )}
        expandableContentForScreen={(row, isSmall, isMedium) => (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant={isSmall ? "body2" : "body1"}>
              Sets: {isMedium ? displayDiff(row.sets_won, row.sets_lost) : row.sets_won + '-' + row.sets_lost}
            </Typography>
            <Typography variant={isSmall ? "body2" : "body1"}>
              Games: {isMedium ? displayDiff(row.games_won, row.games_lost) : row.games_won + '-' + row.games_lost}
            </Typography>
          </Box>
        )}
      />
     
      < MyModal showHide={showModal}
        onClose={() => {
          setShowModal(false)
          setParticipantToRemove(null)
        }}
        title="Confirm Removal"
      >
        {participantToRemove &&
          <Typography>
            Are you sure you want to remove {participantToRemove?.name} ?
          </Typography>
        }
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="outlined" onClick={() => setShowModal(false)}>Cancel</Button>
          {participantToRemove &&
            <Button variant="contained" color="error" onClick={handleRemoveParticipant} sx={{ ml: 2 }}>
              Remove
            </Button>
          }
        </Box>
      </MyModal >
    </Box >
  );
};

export default StandingsView;
