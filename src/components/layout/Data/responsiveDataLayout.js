import React from "react";
import { Box, useTheme } from "@mui/material";
import TableLayout from "./TableLayout";
import CardLayout from "./CardLayout";
import useComponentWidth from "helpers/useComponentWidth";

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
  loading = false
}) => {
  const theme = useTheme();
  const [ref, width] = useComponentWidth();
  //useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallScreen = width > 0 && width < theme.breakpoints.values.sm;
  const isMediumScreen = width > 0 && width >= theme.breakpoints.values.sm && width < theme.breakpoints.values.md;
  //console.log(isSmallScreen, isMediumScreen, width)
  
  return (
    <Box ref={ref} sx={{ width: "100%" }}> {/* Attach ref here */}
      {/* {isSmallScreen || isMediumScreen ? ( */}
      {isSmallScreen ? (
        <CardLayout
          rows={rows}
          rowKey={rowKey}
          titleForScreen={titleForScreen}
          basicContentForScreen={basicContentForScreen}
          expandableContentForScreen={expandableContentForScreen}
          groupingKey={groupingKey}
          renderGroupDivider={renderGroupDivider}
        />
      ) : (
        <TableLayout
          headers={headers}
          rows={rows}
          rowKey={rowKey}
          getRowData={getRowData}
          columnWidths={columnWidths}
          groupingKey={groupingKey}
          renderGroupDivider={renderGroupDivider}
          sortableColumns={sortableColumns}
          onSort={onSort}
          loading={loading}
        />
      )}
    </Box>
  );
};

export default ResponsiveDataLayout;
