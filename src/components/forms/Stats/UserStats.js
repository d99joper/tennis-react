import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

const UserStats = ({ stats: data, statsFetched }) => {
  const [sortField, setSortField] = useState("year");
  const [direction, setDirection] = useState("desc");
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const columns = [
    { label: "Year", accessor: "year", sortable: true },
    { label: "Matches", accessor: "matches", sortable: true },
    { label: "Sets", accessor: "sets", sortable: true },
    { label: "Tiebreaks", accessor: "tiebreaks", sortable: true },
    { label: "Games", accessor: "games", sortable: true },
  ];

  const handleSortingChange = (col) => {
    const sortOrder = col === sortField && direction === "asc" ? "desc" : "asc";
    setSortField(col);
    setDirection(sortOrder);

    const sortedData = [...data.years];
    sortedData.sort((a, b) => {
      if (col === "year") {
        return (a.year > b.year ? 1 : -1) * (sortOrder === "asc" ? 1 : -1);
      }
      return (
        (a.stats[col]?.percentage - b.stats[col]?.percentage) *
        (sortOrder === "asc" ? 1 : -1)
      );
    });
    data.years = sortedData;
  };

  if (!statsFetched) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  if (data?.years.length === 0) {
    return <Typography variant="h6">No matches found</Typography>;
  }

  const textColor = (percentage) => ({
    color: percentage >= 50 ? "rgb(16, 116, 16)" : "rgb(177, 38, 14)"
  })

  return (
    <Box>
      {/* Table for Larger Screens */}
      {isLargeScreen ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.accessor}
                    onClick={col.sortable ? () => handleSortingChange(col.accessor) : null}
                    style={{
                      cursor: col.sortable ? "pointer" : "default",
                      fontWeight: "bold",
                    }}
                  >
                    {col.label}{" "}
                    {col.sortable &&
                      (sortField === col.accessor ? (
                        direction === "asc" ? (
                          <GoTriangleDown />
                        ) : (
                          <GoTriangleUp />
                        )
                      ) : (
                        <GoTriangleDown style={{ opacity: 0.3 }} />
                      ))}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.years.map(({ year, stats: s }) => (
                <TableRow
                  key={year}
                  sx={{
                    "& > *": {
                      color: s.matches.percentage >= 50
                        ? "rgb(16, 116, 16) !important"
                        : "rgb(177, 38, 14) !important",
                    }
                  }}
                >
                  <TableCell>{year}</TableCell>
                  <TableCell>
                    {s.matches.wins}/{s.matches.total} ({s.matches.percentage}%)
                  </TableCell>
                  <TableCell>
                    {s.sets.wins}/{s.sets.total} ({s.sets.percentage}%)
                  </TableCell>
                  <TableCell>
                    {s.tiebreaks.wins}/{s.tiebreaks.total} ({s.tiebreaks.percentage}%)
                  </TableCell>
                  <TableCell>
                    {s.games.wins}/{s.games.total} ({s.games.percentage}%)
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow
                sx={{
                  "& > *": {
                    color: data.totals.stats.matches.percentage >= 50
                      ? "rgb(16, 116, 16)"
                      : "rgb(177, 38, 14)",
                    fontWeight: 'bold'
                  }
                }}
              >
                <TableCell>Total</TableCell>
                <TableCell>
                  {data.totals.stats.matches.wins}/{data.totals.stats.matches.total} (
                  {data.totals.stats.matches.percentage}%)
                </TableCell>
                <TableCell>
                  {data.totals.stats.sets.wins}/{data.totals.stats.sets.total} (
                  {data.totals.stats.sets.percentage}%)
                </TableCell>
                <TableCell>
                  {data.totals.stats.tiebreaks.wins}/{data.totals.stats.tiebreaks.total} (
                  {data.totals.stats.tiebreaks.percentage}%)
                </TableCell>
                <TableCell>
                  {data.totals.stats.games.wins}/{data.totals.stats.games.total} (
                  {data.totals.stats.games.percentage}%)
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        /* Cards for Smaller Screens */
        <Box>
          <Box
            sx={{
              backgroundColor:
                data.totals.stats.matches.percentage >= 50
                  ? "rgba(144, 238, 144, 0.1)"
                  : "rgba(255, 99, 71, 0.1)",
              color: data.totals.stats.matches.percentage >= 50
                ? "rgb(16, 116, 16)"
                : "rgb(177, 38, 14)",
              borderRadius: 1,
              boxShadow: 1,
              p: 2,
              mb: 2,
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography>
              Matches: {data.totals.stats.matches.wins}/{data.totals.stats.matches.total} (
              {data.totals.stats.matches.percentage}%)
            </Typography>
            <Typography>
              Sets: {data.totals.stats.sets.wins}/{data.totals.stats.sets.total} (
              {data.totals.stats.sets.percentage}%)
            </Typography>
            <Typography>
              Tiebreaks: {data.totals.stats.tiebreaks.wins}/{data.totals.stats.tiebreaks.total} (
              {data.totals.stats.tiebreaks.percentage}%)
            </Typography>
            <Typography>
              Games: {data.totals.stats.games.wins}/{data.totals.stats.games.total} (
              {data.totals.stats.games.percentage}%)
            </Typography>
          </Box>
          {data.years.map(({ year, stats: s }) => (
            <Box
              key={year}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor:
                  s.matches.percentage >= 50
                    ? "rgba(144, 238, 144, 0.1)"
                    : "rgba(255, 99, 71, 0.1)",
                
                borderRadius: 1,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" sx={textColor(s.matches.percentage)}>{year}</Typography>
              <Typography sx={textColor(s.matches.percentage)}>
                Matches: {s.matches.wins}/{s.matches.total} ({s.matches.percentage}%)
              </Typography>
              <Typography sx={textColor(s.sets.percentage)}>
                Sets: {s.sets.wins}/{s.sets.total} ({s.sets.percentage}%)
              </Typography>
              <Typography sx={textColor(s.tiebreaks.percentage)}>
                Tiebreaks: {s.tiebreaks.wins}/{s.tiebreaks.total} ({s.tiebreaks.percentage}%)
              </Typography>
              <Typography sx={textColor(s.games.percentage)}>
                Games: {s.games.wins}/{s.games.total} ({s.games.percentage}%)
              </Typography>
            </Box>
          ))}

        </Box>
      )}
    </Box>
  );
};

export default UserStats;
