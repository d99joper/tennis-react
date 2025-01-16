import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import TableLayout from "./TableLayout";
import CardLayout from "./CardLayout";

const ResponsiveDataLayout = ({ headers,
  rows,
  getRowData,
  rowKey,
  columnWidths,
  groupingKey, // Function to determine group changes
  renderGroupDivider, // Function to render the divider content
  sortableColumns = [],
  onSort,
  titleForScreen,
  basicContentForScreen,
  expandableContentForScreen,
  loading=false
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  console.log(rows)
  if (isSmallScreen || isMediumScreen) {
    return (
      <CardLayout
        rows={rows}
        rowKey={rowKey}
        titleForScreen={titleForScreen}
        basicContentForScreen={basicContentForScreen}
        expandableContentForScreen={expandableContentForScreen}
        groupingKey={groupingKey}
        renderGroupDivider={renderGroupDivider}
      />
    )
  }

  return <TableLayout
    headers={headers}
    rows={rows}
    rowKey={rowKey}
    getRowData={getRowData}
    columnWidths={columnWidths}
    groupingKey={groupingKey} // Function to determine group changes
    renderGroupDivider={renderGroupDivider} // Function to render the divider content
    sortableColumns={sortableColumns}
    onSort={onSort}
    loading={loading}
  />;
};

export default ResponsiveDataLayout;
