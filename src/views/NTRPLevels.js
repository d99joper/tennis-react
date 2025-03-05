import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const ntrpLevels = [
  {
    level: "1.0 - 2.5",
    title: "Beginner",
    description: "Just starting or still developing basic skills. Likely struggles with consistent rallies.",
  },
  {
    level: "3.0 - 3.5",
    title: "Intermediate",
    description: "Can sustain rallies, control direction, and handle basic strategies. 3.5s begin to understand point construction.",
  },
  {
    level: "4.0 - 4.5",
    title: "Advanced",
    description: "Strong technique, consistency, and match play skills. Can apply spin, pace, and tactics effectively. 4.5s have solid tournament-level play.",
  },
  {
    level: "5.0 - 5.5",
    title: "Expert",
    description: "High-level tournament or college-level players. Can vary spin, power, and strategy at an elite level.",
  },
  {
    level: "6.0 - 7.0",
    title: "Professional",
    description: "Competes at national, international, or professional levels (Futures, Challengers, ATP/WTA).",
  },
];

const NTRPLevelsTable = () => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden", maxWidth: "900px", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ textAlign: "center", mt: 2 }}>
        USTA NTRP Skill Levels
      </Typography>
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell align="center" sx={{ color: "white", fontWeight: "bold", whiteSpace: "nowrap" }}>NTRP Level</TableCell>
            <TableCell align="center" sx={{ color: "white", fontWeight: "bold", whiteSpace: "nowrap" }}>Category</TableCell>
            <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {ntrpLevels.map((level, index) => (
            <TableRow key={level.level} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>{level.level}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>{level.title}</TableCell>
              <TableCell align="left">{level.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NTRPLevelsTable;
