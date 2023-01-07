import { Loader, Table, TableBody, TableCell, TableHead, TableRow } from "@aws-amplify/ui-react";
import { Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';

const UserStats = ({ stats, ...props }) => {

    const [sortField, setSortField] = useState("year");
    const [direction, setDirection] = useState("asc");
    const columns = [
        { label: "Year", accessor: "year", sortable: true },
        { label: "Matches", accessor: "winPercentage", sortable: true },
        { label: "Sets", accessor: "setsWonPercentage", sortable: true },
        { label: "Tiebreaks", accessor: "tiebreakPercentage", sortable: true },
        { label: "Games", accessor: "gamesWonPercentage", sortable: true }
    ]

    function handleSortingChange(e, col) {
        const sortOrder = (col === sortField && direction === "asc") ? "desc" : "asc";
        setSortField(col);
        setDirection(sortOrder);

        switch (col) {
            case "year":
                stats.sort((a, b) => (a.year > b.year ? 1 : -1) * (sortOrder === "asc" ? 1 : -1))
                break;
            default:
                stats.sort((a, b) => (a.stats[col] - b.stats[col]) * (sortOrder === "asc" ? 1 : -1))
                break;
        }
        stats.sortField = col
    }

    return (
        <>
            {(props.statsFetched && stats.length > 0) ?
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
                                        (!stats.sortField && col.accessor == "year" 
                                            ? <GoTriangleUp />
                                        // asc -> arrow down
                                        : stats.sortField === col.accessor && direction === "asc") 
                                            ? <GoTriangleDown />
                                        // desc -> arrow up
                                        : (stats.sortField === col.accessor && direction === "desc") 
                                            ? <GoTriangleUp />
                                        // grey with 100 opacity to act as space filler 
                                        :(col.sortable) 
                                            ? <GoTriangleDown color="#aaaaaa00" />
                                        // otherwise nothing
                                        : null
                                        }
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats.map(x =>
                                <TableRow key={x.year}>
                                    <TableCell>{x.year}</TableCell>
                                    <TableCell color={x.stats.winPercentage >= 50 ? 'green' : 'red'}>
                                        {x.stats.totalWins}/{x.stats.totalLosses} ({x.stats.winPercentage}%)</TableCell>
                                    <TableCell color={x.stats.setsWonPercentage >= 50 ? 'green' : 'red'}>
                                        {x.stats.setsWon}/{x.stats.setsLost} ({x.stats.setsWonPercentage}%)</TableCell>
                                    <TableCell color={x.stats.tiebreakPercentage >= 50 ? 'green' : 'red'}>
                                        {x.stats.tiebreaksWon}/{x.stats.tiebreaksLost} ({x.stats.tiebreakPercentage}%)</TableCell>
                                    <TableCell color={x.stats.gamesWonPercentage >= 50 ? 'green' : 'red'}>
                                        {x.stats.gamesWon}/{x.stats.gamesLost} ({x.stats.gamesWonPercentage}%)</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                :
                <h5><Loader /> Loading ...</h5>
            }
        </>
    )
}

export default UserStats