import React, { useState } from "react";
import { Grid2 as Grid, Box, Typography, CircularProgress, LinearProgress } from "@mui/material";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

const TableLayout = ({
  headers,
  rows,
  getRowData,
  rowKey,
  columnWidths,
  groupingKey, // Function to determine group changes
  renderGroupDivider, // Function to render the divider content
  sortableColumns = [],
  onSort,
  loading
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Handle header click for sorting
  const handleSort = (key) => {
    if (onSort)
      onSort(key)
    else {
      setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
    }
  };
  const getNestedValue = (obj, key) => {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
  };
  // Sort rows based on the sortConfig
  const sortedRows = React.useMemo(() => {
    if (!sortConfig.key) return rows;

    return [...rows].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  let previousGroup = null; // Track the previous group

  return (
    <Grid container spacing={0} sx={{ border: "1px solid #ccc", borderRadius: 2 }} direction={'column'}>
      {/* Table Header */}
      <Grid size={12}>
        <Box
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: columnWidths ? columnWidths.join(" ") : headers.map(() => "1fr").join(" "),
            alignItems: "center",
            padding: "16px 16px",
            backgroundColor: "primary.main",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {headers.map((header, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: sortableColumns.includes(header.key) ? "pointer" : "default",
              }}
              onClick={() =>
                sortableColumns.includes(header.key) && handleSort(header.key)
              }
            >
              <Typography  sx={{width:'fit-content'}}>{header.label}</Typography>
              {sortConfig.key === header.key &&
                (sortConfig.direction === "asc" ? (
                  <MdArrowDropUp />
                ) : (
                  <MdArrowDropDown />
                ))}
            </Box>
          ))}
        </Box>
      </Grid>

      {/* Table Rows */}
      {loading ? <LinearProgress  />
        :
        sortedRows.map((row, index) => {
          const currentGroup = groupingKey ? groupingKey(row) : null;
          const isNewGroup = currentGroup !== previousGroup;
          previousGroup = currentGroup;

          return (
            <React.Fragment key={rowKey(row)}>
              {/* Divider for New Group */}
              {isNewGroup && currentGroup !== null && (
                <Grid size={12}>
                  {renderGroupDivider ? (
                    renderGroupDivider(currentGroup)
                  ) : (
                    <Box
                      sx={{
                        padding: "16px 16px",
                        fontWeight: "bold",
                        backgroundColor: "#e0e0e0",
                        textAlign: "center",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {currentGroup}
                    </Box>
                  )}
                </Grid>
              )}

              {/* Regular Row */}
              <Grid size={12}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: columnWidths ? columnWidths.join(" ") : headers.map(() => "1fr").join(" "),
                    alignItems: "center",
                    padding: "16px 16px",
                    borderBottom: "1px solid #ccc",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                  }}
                >
                  {getRowData(row, index).map((cell, cellIndex) => (
                    <Typography  key={cellIndex} align="center"
                      sx={{
                        textAlign: "center", // Explicitly set horizontal alignment
                      }}
                    >
                      {cell}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </React.Fragment>
          );
        })}
    </Grid>
  );
};

export default TableLayout;
