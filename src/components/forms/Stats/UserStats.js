import { Loader, Table, TableBody, TableCell, TableHead, TableRow } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";

const UserStats = ({ stats:passedStats, ...props }) => {

    const [stats, setStats] = useState(passedStats);

    useEffect(()=>{
        if(!props.statsFetched)
            setStats(passedStats)
    },[])
    function handleSortColumn(columnName) {
        switch (columnName) {
            case "year":
                setStats(previousState => { 
                    //https://blog.logrocket.com/creating-react-sortable-table/
                    return {...previousState, ...stats.sort((a,b) => {a-b})}//
                })
                break;
            default:
                break;
        }
    }

    return (
        <>
            {(props.statsFetched && stats.length > 0) ?
                <div>
                <Table highlightOnHover={true} marginTop="1em" variation="striped" backgroundColor={'white'}>
                    <TableHead backgroundColor={'blue.20'} >
                        <TableRow>
                            <TableCell as="th" onClick={handleSortColumn('year')}>Year</TableCell>
                            <TableCell as="th">Matches</TableCell>
                            <TableCell as="th">Sets</TableCell>
                            <TableCell as="th">Tie-breaks</TableCell>
                            <TableCell as="th">Games</TableCell>
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