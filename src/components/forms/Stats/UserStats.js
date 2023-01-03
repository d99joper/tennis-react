import { Grid, Loader, Table, TableBody, TableCell, TableHead, TableRow, Text } from "@aws-amplify/ui-react";
import React from "react";

const UserStats = ({ stats, ...props }) => {

    return (
        <>
            {props.statsFetched ?
            <>
                <Table caption="match stats" highlightOnHover={true} marginTop="1em" variation="striped">
                    <TableHead backgroundColor={'#ABC'}>
                        <TableRow>
                            <TableCell as="th">Year</TableCell>
                            <TableCell as="th">Matches</TableCell>
                            <TableCell as="th">Sets</TableCell>
                            <TableCell as="th">Tie-breaks</TableCell>
                            <TableCell as="th">Games</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>2022</TableCell>
                            <TableCell color={stats.winPercentage >=50 ? 'green' : 'red'}>
                                {stats.totalWins}/{stats.totalLosses} ({stats.winPercentage}%)</TableCell>
                            <TableCell color={stats.setsWonPercentage >=50 ? 'green' : 'red'}>
                                {stats.setsWon}/{stats.setsLost} ({stats.setsWonPercentage}%)</TableCell>
                            <TableCell color={stats.tiebreakPercentage >=50 ? 'green' : 'red'}>
                                {stats.tiebreaksWon}/{stats.tiebreaksLost} ({stats.tiebreakPercentage}%)</TableCell>
                            <TableCell color={stats.gamesWonPercentage >=50 ? 'green' : 'red'}>
                                {stats.gamesWon}/{stats.gamesLost} ({stats.gamesWonPercentage}%)</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </>
                :
                <h5><Loader /> Loading ...</h5>
            }
        </>
    )
}

export default UserStats