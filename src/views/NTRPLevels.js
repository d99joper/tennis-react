import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, useMediaQuery } from "@mui/material";

const ntrpLevels = [
  { level: "1.0 - 2.5", title: "Beginner", description: "Just starting or still developing basic skills. Likely struggles with consistent rallies." },
  { level: "3.0 - 3.5", title: "Intermediate", description: "Can sustain rallies, control direction, and handle basic strategies. 3.5s begin to understand point construction." },
  { level: "4.0 - 4.5", title: "Advanced", description: "Strong technique, consistency, and match play skills. Can apply spin, pace, and tactics effectively. 4.5s have solid tournament-level play." },
  { level: "5.0 - 5.5", title: "Expert", description: "High-level tournament or college-level players. Can vary spin, power, and strategy at an elite level." },
  { level: "6.0 - 7.0", title: "Professional", description: "Competes at national, international, or professional levels (Futures, Challengers, ATP/WTA)." },
];

const NTRPLevelsTable = () => {
  const isMobile = useMediaQuery("(max-width:600px)"); // Detects mobile screens

  return (
    <TableContainer component={Paper} sx={{ 
      borderRadius: 2, 
      overflowX: "auto", // Enables horizontal scrolling on small screens
      maxWidth: "100%", 
      margin: "auto", 
      mt: 4 
    }}>
      <Typography variant={isMobile ? "h6" : "h5"} sx={{ textAlign: "center", mt: 2 }}>
        USTA NTRP Skill Levels
      </Typography>
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell align="center" sx={{ 
              color: "white", 
              fontWeight: "bold", 
              whiteSpace: "nowrap",
              fontSize: isMobile ? "12px" : "16px" 
            }}>
              NTRP Lvl
            </TableCell>
            <TableCell align="center" sx={{ 
              color: "white", 
              fontWeight: "bold", 
              whiteSpace: "nowrap",
              fontSize: isMobile ? "12px" : "16px"
            }}>
              Category
            </TableCell>
            <TableCell align="left" sx={{ 
              color: "white", 
              fontWeight: "bold", 
              fontSize: isMobile ? "12px" : "16px"
            }}>
              Description
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {ntrpLevels.map((level, index) => (
            <TableRow key={level.level} sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>
                {level.level}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: isMobile ? "12px" : "14px" }}>
                {level.title}
              </TableCell>
              <TableCell align="left" sx={{ fontSize: isMobile ? "12px" : "14px" }}>
                {level.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NTRPLevelsTable;
