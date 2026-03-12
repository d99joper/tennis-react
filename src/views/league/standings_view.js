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
import { divisionAPI, eventAPI } from "api/services";
import { MdDelete } from "react-icons/md";
import MyModal from "components/layout/MyModal";
import TennisTrophyIcon from "components/icons/trophy";
import { AuthContext } from "contexts/AuthContext";
import ConverstationButton from "components/forms/Conversations/ConversationButton";

const StandingsView = ({ standings, winner, event_id, division_id, isAdmin = false, isParticipant = false, callback }) => {
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
    if (division_id) {
      // remove from division
      await divisionAPI.removeDivisionParticipants(division_id, [participantToRemove.id])
    } else {
      // remove from event
      await eventAPI.removeParticipant(event_id, participantToRemove.id)
    }
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
console.log("Ranked standings:", rankedStandings);
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
            row.id === winner
              ?
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                <TennisTrophyIcon size={35} /> #{row.rank}
              </Box>
              : `#${row.rank}`

          ),
          //`${(row.rank===1 && row.id === winner?.id) ? <TennisTrophyIcon /> : ''} #${row.rank}`,
          (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {row.players.length === 1
                ? <ProfileImage player={row.players[0]} size={30} asLink showName />
                : row.players.map((p, i) => (
                    <React.Fragment key={p.id}>
                      {i > 0 && <Typography variant="body1" component="span">&amp;</Typography>}
                      <ProfileImage player={p} size={30} showAvatar={false} asLink showName />
                    </React.Fragment>
                  ))
              }
            </Box>
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
            { // allow chat in singles when viewing another player's row
              user && row.players.length === 1 && row.players[0].id !== user?.id && (
                <ConverstationButton player1={user} player2={row.players[0]} title={`Message ${row.players[0].name}`} />
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
                {row.players.length === 1
                  ? <ProfileImage player={row.players[0]} size={30} asLink={true} showName={true} />
                  : 
                  row.players.map((p, i) => (
                      <React.Fragment key={p.id}>
                        {i > 0 && <Typography variant="body1" component="span" sx={{ mx: 0.25 }}>&amp;</Typography>}
                        <ProfileImage player={p} size={30} />
                        <Link to={'/players/' + p.slug}>{p.name}</Link>
                      </React.Fragment>
                    ))
                }
                {user && row.players.length === 1 && row.players[0].id !== user?.id && (
                  <ConverstationButton player1={user} player2={row.players[0]} title={`Message ${row.players[0].name}`} size={20} />
                )}
              </Box>
            }
            {isSmall &&
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                {user && row.players.length === 1 && row.players[0].id !== user?.id && (
                  <ConverstationButton player1={user} player2={row.players[0]} title={`Message ${row.players[0].name}`} size={18} />
                )}
              </Box>
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
