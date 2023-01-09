import { Table, TableBody, TableCell, TableHead, TableRow } from "@aws-amplify/ui-react";
import React from "react";

const H2H = ({ data, ...props }) => {
    console.log(data)
    return (
        <>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell as="th">Played On</TableCell>
                        <TableCell as="th">Ladder</TableCell>
                        <TableCell as="th">Winner</TableCell>
                        <TableCell as="th">Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data ? data.matches.map(m =>
                        // inspiration
                        // https://www.atptour.com/en/players/atp-head-2-head/mikael-ymer-vs-jannik-sinner/y268/s0ag
                        // title: 
                        //  pic p1    vs        pic p2
                        //  name p1   XX-XX    name p2
                        //
                        // table:  
                        //  stat p1   stat name     stat p2
                        //
                        // score list (ordered by playedOn)
                        // date(year) ladder winner score
                        <TableRow key={m.id}>
                            <TableCell as="td">{m.playedOn}</TableCell>
                            <TableCell as="td">{m.ladder.name}</TableCell>
                            <TableCell as="td">{m.winner.name}</TableCell>
                            <TableCell as="td">{m.score}</TableCell>
                        </TableRow>
                    ) : null}
                </TableBody>
            </Table>

        </>
    )
}

export default H2H
