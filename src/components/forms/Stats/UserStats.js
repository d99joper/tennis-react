import { Loader, Table, TableBody, TableCell, TableFoot, TableHead, TableRow } from "@aws-amplify/ui-react";
import { Card, Grid } from "@mui/material";
import { enums } from "helpers";
import React, { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import "./stats.css"

const UserStats = ({ stats: data, ...props }) => {

  const [sortField, setSortField] = useState("year");
  const [direction, setDirection] = useState("asc");
  const columns = [
    { label: "Year", accessor: "year", sortable: true },
    { label: "Matches", accessor: "matches", sortable: true },
    { label: "Sets", accessor: "sets", sortable: true },
    { label: "Tiebreaks", accessor: "tiebreaks", sortable: true },
    { label: "Games", accessor: "games", sortable: true }
  ]

  function handleSortingChange(e, col) {
    const sortOrder = (col === sortField && direction === "asc") ? "desc" : "asc";
    setSortField(col);
    setDirection(sortOrder);

    switch (col) {
      case "year":
        data.years.sort((a, b) => (a.year > b.year ? 1 : -1) * (sortOrder === "asc" ? 1 : -1))
        break;
      default:
        data.years.sort((a, b) => (a.stats[col]["percentage"] - b.stats[col]["percentage"]) * (sortOrder === "asc" ? 1 : -1))
        break;
    }
    data.sortField = col
  }

  return (
    (props.statsFetched && data?.years.length > 0) ?
      <div className={props.className}>
        {props.displayAs === enums.DISPLAY_MODE.SimpleList &&
          <Grid gap={'1rem'} display={'grid'} paddingTop={'.5rem'}>
            {data.years.map(({ year, stats: s }) =>
              <Card key={'card_' + year} className={"stat-card " + (s.matches.percentage >= 50 ? 'win-card' : 'lose-card')}>
                <b>{year}:</b>
                <div className="indent">
                  Won {s.matches.wins} of {s.matches.total} matches ({s.matches.percentage}%)
                </div>
                <div className="indent">
                  Won {s.sets.wins} of {s.sets.total} sets ({s.sets.percentage}%)
                </div>
                <div className="indent">
                  Won {s.games.wins} of {s.games.total} games ({s.games.percentage}%)
                </div>
              </Card>
            )}
            <Card className={"stat-card " + (data.totals.stats.matches.percentage >= 50 ? 'win-card' : 'lose-card')}>
              <b>Total all years:</b>
              <div className="indent">
                Won {data.totals.stats.matches.wins} of {data.totals.stats.matches.total} matches ({data.totals.stats.matches.percentage}%)
              </div>
              <div className="indent">
                Won {data.totals.stats.sets.wins} of {data.totals.stats.sets.total} sets ({data.totals.stats.sets.percentage}%)
              </div>
              <div className="indent">
                Won {data.totals.stats.games.wins} of {data.totals.stats.games.total} games ({data.totals.stats.games.percentage}%)
              </div>
            </Card>
          </Grid>
        }
        {props.displayAs === enums.DISPLAY_MODE.Table &&
          <div>
            <Table highlightOnHover={true} marginTop="1em" variation="striped" backgroundColor={'white'}>
              <TableHead backgroundColor={'blue.20'} >
                <TableRow>
                  {columns.map(col =>
                    <TableCell as="th"
                      key={col.accessor}
                      className={col.sortable ? "cursorHand" : null}
                      onClick={col.sortable ? (e) => handleSortingChange(e, col.accessor) : null}
                    >
                      {col.label + " "}
                      {  // Set the search arrow (default year desc)
                        (!data.sortField && col.accessor == "year"
                          ? <GoTriangleUp />
                          // asc -> arrow down
                          : data.sortField === col.accessor && direction === "asc")
                          ? <GoTriangleDown />
                          // desc -> arrow up
                          : (data.sortField === col.accessor && direction === "desc")
                            ? <GoTriangleUp />
                            // grey with 100 opacity to act as space filler 
                            : (col.sortable)
                              ? <GoTriangleDown color="#aaaaaa00" />
                              // otherwise nothing
                              : null
                      }
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.years.map(({ year, stats: s }) =>
                  <TableRow key={year}>
                    <TableCell>{year}</TableCell>
                    <TableCell color={s.matches.percentage >= 50 ? 'green' : 'red'}>
                      {s.matches.wins}/{s.matches.total} ({s.matches.percentage}%)</TableCell>
                    <TableCell color={s.sets.percentage >= 50 ? 'green' : s.sets.total !== 0 ? 'red' : null}>
                      {s.sets.wins}/{s.sets.total} ({s.sets.percentage}%)</TableCell>
                    <TableCell color={s.tiebreaks.percentage >= 50 ? 'green' : s.tiebreaks.total !== 0 ? 'red' : null}>
                      {s.tiebreaks.wins}/{s.tiebreaks.total} ({s.tiebreaks.percentage}%)</TableCell>
                    <TableCell color={s.games.percentage >= 50 ? 'green' : s.games.total !== 0 ? 'red' : null}>
                      {s.games.wins}/{s.games.total} ({s.games.percentage}%)</TableCell>
                  </TableRow>
                )}
              </TableBody>
              {data.totals.stats &&
                <TableFoot>
                  <TableRow key="foot">
                    <TableCell as="th">Total</TableCell>
                    <TableCell as="th" color={data.totals.stats.matches.percentage >= 50 ? 'green' : 'red'}>
                      {data.totals.stats.matches.wins}/{data.totals.stats.matches.total} ({data.totals.stats.matches.percentage}%)</TableCell>
                    <TableCell as="th" color={data.totals.stats.sets.percentage >= 50 ? 'green' : 'red'}>
                      {data.totals.stats.sets.wins}/{data.totals.stats.sets.total} ({data.totals.stats.sets.percentage}%)</TableCell>
                    <TableCell as="th" color={data.totals.stats.tiebreaks.percentage >= 50 ? 'green' : 'red'}>
                      {data.totals.stats.tiebreaks.wins}/{data.totals.stats.tiebreaks.total} ({data.totals.stats.tiebreaks.percentage}%)</TableCell>
                    <TableCell as="th" color={data.totals.stats.games.percentage >= 50 ? 'green' : 'red'}>
                      {data.totals.stats.games.wins}/{data.totals.stats.games.total} ({data.totals.stats.games.percentage}%)</TableCell>
                  </TableRow>
                </TableFoot>
              }
            </Table>
          </div>
        }
      </div>
      : data?.years.length === 0 ?
        <div>'No matches found'</div>
        : <h5><Loader /> Loading ...</h5>

  )
}

export default UserStats