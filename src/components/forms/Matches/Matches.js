// Matches.js
import { Button, Collection, Flex, Loader, Table, TableCell, TableHead, TableRow, View } from "@aws-amplify/ui-react";
import { matchFunctions as mf, enums } from "helpers";
import { React, Suspense, useState, lazy, useEffect } from "react";
import { DynamicTable, H2H, Match } from "../index.js"
// import { Modal } from "../../layout/Modal/Modal"
import { GiCrossedSwords } from 'react-icons/gi';
import { GoCommentDiscussion } from 'react-icons/go';
import "./Matches.css"

const Matches = ({
    player,
    startDate,
    endDate = new Date(),
    ladder,
    showHeader = true,
    displayAs = enums.DISPLAY_MODE.Table,
    allowAdd = true,
    ...props
}) => {

    const MatchEditor = lazy(() => import("../MatchEditor/MatchEditor").then(module => { return { default: module.MatchEditor } }))

    const [matches, setMatches] = useState([])
    const [sortField, setSortField] = useState("playedOn");
    const [direction, setDirection] = useState("desc");
    const [dataIsFetched, setDataIsFetched] = useState(false);

    const tableHeaders = [
        { label: "Date", accessor: "playedOn", sortable: true, parts:1, link: 'Match/id' },
        { label: "Ladder", accessor: "ladder.name", sortable: true, parts:2, link: 'Ladders/id' },
        { label: "Winner", accessor: "player.name", sortable: true, parts:2, link: 'Profile/id' },
        { label: "Loser", accessor: "opponent.name", sortable: true, parts:2, link: 'Profile/id' },
        { label: "Score", accessor: "match.score", sortable: false, parts:2, link: 'Match/id' },
        { label: "", accessor: "games", sortable: false, parts:0 }
    ]

    useEffect(() => {
        if(!dataIsFetched)
            //mf.listMatches(player, ladder, startDate, endDate).then((data) => {
            mf.getMatchesForPlayer(player, ladder, startDate, endDate).then((data) => {
                setMatches(data)
                setDataIsFetched(true)
            })

    }, [sortField, direction])

    const setColor = ((match, index) => {
        //console.log('setColor winnerId', match.winner)
        if (player) // win gets green and loss gets red
            return (match.winner.id === player.id) ? 'lightgreen' : '#ff5c5cb0'
        else // even gets white and odd gets grey
            return (index % 2 === 0) ? 'white' : 'grey'

    })

    return (
        <section {...props}>
            {displayAs === enums.DISPLAY_MODE.Inline ?
                <>
                    <Collection className="matchCollection"
                        items={matches}
                        direction="column"
                        gap={"3px"}
                    >
                        {(item, index) => (
                            <Match props={props}
                                key={index}
                                displayAs={displayAs}
                                index={index}
                                match={item}
                                color={setColor(item, index)}
                                showComments={false}
                            ></Match>
                        )}
                    </Collection>
                    {( // keep false for now (it's moved into the profile)
                        false && allowAdd && displayAs === enums.DISPLAY_MODE.Inline &&
                        <Flex >
                            <Button>Add New</Button>
                            <Suspense fallback={<h2><Loader />Loading...</h2>}>
                                <MatchEditor player={player} onSubmit={(m) => { setMatches(...matches, m) }} />
                            </Suspense>
                        </Flex>
                    )}
                </>
                : null
            }
            {displayAs === enums.DISPLAY_MODE.Table ?
                <DynamicTable 
                    key={"matches"}
                    columns={tableHeaders}
                    sortField={sortField}
                    direction={direction}
                    data={matches}
                    iconSet={[{name: 'H2H'}, {name: 'Comments'}]}
                />
                : null
            }
        </section>
    )

}

export { Matches };