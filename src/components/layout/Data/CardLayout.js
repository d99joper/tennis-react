import React, { useState } from "react";
import { useMediaQuery, useTheme, Box, Paper, Typography, IconButton, Collapse } from "@mui/material";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const CardLayout = ({
  rows,
  rowKey,
  groupingKey,
  renderGroupDivider,
  titleForScreen = () => "No Title Available", // Fallback function
  basicContentForScreen = () => null, // Fallback function
  expandableContentForScreen = () => null, // Fallback function
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  let previousGroup = null;

  return (
    <Box>
      {rows.map((row, index) => {
        // console.log("Row:", row);
        // console.log("Title Function Output:", titleForScreen(row, isSmallScreen, isMediumScreen));
        // console.log("Basic Content Function Output:", basicContentForScreen(row, isSmallScreen, isMediumScreen));
        // console.log("Expandable Content Function Output:", expandableContentForScreen ? expandableContentForScreen(row, isSmallScreen, isMediumScreen) : null);
        const currentGroup = groupingKey ? groupingKey(row) : null;
        const isNewGroup = currentGroup !== previousGroup;
        previousGroup = currentGroup;

        const title = titleForScreen(row, isSmallScreen, isMediumScreen);
        const basicContent = basicContentForScreen(row, isSmallScreen, isMediumScreen);
        const expandableContent = expandableContentForScreen 
          ? expandableContentForScreen(row, isSmallScreen, isMediumScreen)
          : null;

        return (
          <React.Fragment key={rowKey(row)}>
            {isNewGroup && currentGroup !== null && (
              <Box
                sx={{
                  padding: "8px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "8px",
                  borderRadius: "4px",
                }}
              >
                {renderGroupDivider ? renderGroupDivider(currentGroup) : currentGroup}
              </Box>
            )}

            <Paper
              elevation={3}
              sx={{
                marginBottom: 2,
                padding: 2,
                backgroundColor: "#f9f9f9"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                {title}
                {expandableContent &&
                  <IconButton onClick={() => toggleExpand(rowKey(row))}>
                    {expanded[rowKey(row)] ? <MdExpandLess /> : <MdExpandMore />}
                  </IconButton>
                }
              </Box>

              {basicContent && (
                <Box sx={{ marginBottom: 1 }}>
                  {basicContent}
                </Box>
              )}

              {expandableContent &&
                <Collapse in={expanded[rowKey(row)]}>
                  <Box sx={{ marginTop: 1 }}>{expandableContent}</Box>
                </Collapse>
              }
            </Paper>
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default CardLayout;
