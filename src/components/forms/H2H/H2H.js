import React, { useEffect, useState } from "react";
import { Box, Card, Grid2 as Grid, Typography, Divider } from "@mui/material";
import { playerAPI } from "api/services";
import { ProfileImage } from "../ProfileImage";
import { Match } from "../index";

const H2H = ({ winners, losers }) => {
  const [data, setData] = useState(null);
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    async function fetchH2HData() {
      const stats = await playerAPI.getPlayerH2H(winners[0], losers[0]);
      setData(stats);
      setTotals(stats.stats.totals.stats)
    }
    fetchH2HData();
  }, [winners, losers]);

  return data ? (
    <Box>
      <Grid container alignItems="center" spacing={2} >
        <Grid size={{ xs: 4 }}>
          <Box display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <ProfileImage player={data.player1} size={100} />
            <Typography variant="h6">{data.player1.name}</Typography>
            <Typography color="primary">
              {totals.matches.percentage.toFixed(0)}% Wins
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 4 }} >
          <Box display="flex" justifyContent="center" height="100%">
            <Divider orientation="vertical" flexItem />
          </Box>
        </Grid>

        <Grid size={{ xs: 4 }}>
          <Box display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <ProfileImage player={data.player2} size={100} />
            <Typography variant="h6">{data.player2.name}</Typography>
            <Typography color="primary">
              {100 - totals.matches.percentage.toFixed(0)}% Wins
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/*** Stats Section ***/}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Detailed Stats
        </Typography>
        <Grid container spacing={2}>
          {["matches", "sets", "games", "tiebreaks"].map((statName, index) => (
            <React.Fragment key={index}>
              <Grid size={{ xs: 4 }}>
                <Card sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor:
                    totals[statName].total !== 0
                      ? totals[statName].percentage > 50
                        ? "rgba(144, 238, 144, 0.3)" // Soft green
                        : "rgba(255, 99, 71, 0.3)"  // Tinted red
                      : "", // Default background for total = 0
                }}>
                  <Typography variant="body1">
                    {`${totals[statName].wins}/${totals[statName].total} (${totals[statName].percentage.toFixed(0)}%)`}
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 4 }} textAlign={'center'} alignContent={'center'}>
                <Typography variant="body1" >
                  {statName.charAt(0).toUpperCase() + statName.slice(1)} Won
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Card sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor:
                    totals[statName].total !== 0
                      ? 100 - totals[statName].percentage > 50
                        ? "rgba(144, 238, 144, 0.3)" // Soft green
                        : "rgba(255, 99, 71, 0.3)"  // Tinted red
                      : "", // Default background for total = 0
                }}>
                  <Typography variant="body1">
                    {`${totals[statName].losses}/${totals[statName].total} (${100 - totals[statName].percentage.toFixed(0)}%)`}
                  </Typography>
                </Card>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Matches</Typography>
      {data.matches.map((m) => (
        <Match
          displayAs="card"
          match={m}
          color={'white'}
          showH2H={false}
          key={'m' + m.id}
        />
      ))}
    </Box>
  ) : (
    <Typography>Loading...</Typography>
  );
};

export default H2H;
