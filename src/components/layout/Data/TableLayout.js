import React, { useState } from "react";
import { Grid2 as Grid, Box, Typography, CircularProgress, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
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
    <TableContainer component={Paper} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
      <Table sx={{ minWidth: 650, tableLayout: 'auto' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  cursor: sortableColumns.includes(header.key) ? "pointer" : "default",
                  width: columnWidths ? columnWidths[index] : "auto",
                  whiteSpace: "nowrap", // Prevents text wrapping
                  minWidth: "fit-content", // Ensures it only takes as much space as needed
                  padding: "12px 16px", // Adds consistent spacing
                }}
                onClick={() => sortableColumns.includes(header.key) && handleSort(header.key)}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography sx={{ width: "fit-content" }}>{header.label}</Typography>
                  {sortConfig.key === header.key &&
                    (sortConfig.direction === "asc" ? <MdArrowDropUp /> : <MdArrowDropDown />)}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={headers.length}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row, index) => {
              const currentGroup = groupingKey ? groupingKey(row) : null;
              const isNewGroup = currentGroup !== previousGroup;
              previousGroup = currentGroup;
              return (
                <React.Fragment key={rowKey(row)}>
                  {/* Group Divider */}
                  {isNewGroup && currentGroup !== null && (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length}
                        sx={{
                          //padding: "16px",
                          fontWeight: "bold",
                          backgroundColor: "#edfdf0",
                          textAlign: "center",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        {renderGroupDivider ? renderGroupDivider(currentGroup) : currentGroup}
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Regular Row */}
                  <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
                    {getRowData(row, index).map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        align="center"
                        sx={{
                          textAlign: "center", // Ensure center alignment
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableLayout;
