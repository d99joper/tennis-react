import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import ResponsiveDataLayout from "components/layout/Data/responsiveDataLayout";
import { ProfileImage } from "components/forms";

const StandingsView = ({ standings }) => {

  const displayDiff = (won, lost) => {
    const diff = won - lost;
    let sign = ''
    if (diff === 0) sign = '+-'
    if (diff > 0) sign = '+'
    return `${won}-${lost} (${sign + diff.toString()})`
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
        ]}
        rows={rankedStandings}
        rowKey={(row) => row.id}
        // for larger screens (table view)
        sortableColumns={["rank", "wins", "losses", "set_diff", "game_diff"]}
        columnWidths={["1fr", "4fr", "1fr", "1fr", "1fr", "1fr"]} // Custom column widths
        getRowData={(row, index) => [
          `#${row.rank}`,
          (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ProfileImage player={row.players[0]} size={30} />
              <Typography>{row.name}</Typography>
            </Box>
          ),
          row.wins,
          row.losses,
          displayDiff(row.sets_won, row.sets_lost),
          displayDiff(row.games_won, row.games_lost),
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
                  #{row.rank}
                </Typography>
                <ProfileImage player={row.players[0]} size={30} />
                <Typography 
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {row.name}
                </Typography>
              </Box>
            }
            {isSmall &&
            <Typography
              variant={"h6"}
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              #{row.rank} {row.name}
            </Typography>
            }
          </>
        )}
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
    </Box>
  );
};

export default StandingsView;
