// Matches.js
import { Button, Card, Collection, Divider, Flex, Grid, Loader, Text, View } from "@aws-amplify/ui-react";
import { matchFunctions as mf, enums } from "helpers";
import React, { Suspense, useState, lazy, useEffect } from "react";
import { DynamicTable, H2H, Match } from "../index.js"
// import { Modal } from "../../layout/Modal/Modal"
import { GiCrossedSwords } from 'react-icons/gi';
import { GoCommentDiscussion } from 'react-icons/go';
import "./Matches.css"
import { ConsoleLogger } from "@aws-amplify/core";
import { LinearProgress, Paper } from "@mui/material";
import { tab } from "@testing-library/user-event/dist/tab.js";

const Matches = ({
    player,
    startDate,
    endDate,// = new Date(),
    ladder,
    ladderMatches,
    onAddMatches,
    showHeader = true,
    displayAs = enums.DISPLAY_MODE.Table,
    allowAdd = true,
    excludeColumns,
    useColorCode = true,
    sortingField = "playedOn",
    sortDirection = "asc",
    ...props
}) => {

    const MatchEditor = lazy(() => import("../MatchEditor/MatchEditor").then(module => { return { default: module.MatchEditor } }))

    const [matches, setMatches] = useState([{}])
    const sortField = sortingField ?? "playedOn"
    const direction = sortDirection ?? "asc"
    const [nextToken, setNextToken] = useState("playedOn");
    const [dataIsFetched, setDataIsFetched] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const matchPrefix = matches?.[0]?.hasOwnProperty('match') ? 'match.' : ''
    const useMatchPrefix = matches?.[0]?.hasOwnProperty('match') ? true : false
    
    const tableHeaders = [
        { label: "Date", accessor: matchPrefix+"playedOn", sortable: true, parts:useMatchPrefix ? 2 :1, link: 'Match/id' },
        { label: "Winner", accessor: matchPrefix+"winner.name", sortable: true, parts:useMatchPrefix ? 3 :2, link: 'Profile/id' },
        { label: "Loser", accessor:  matchPrefix+"loser.name", sortable: true, parts:useMatchPrefix ? 3 :2, link: 'Profile/id' },
        { label: "Score", accessor:  matchPrefix+"score", sortable: false, parts:useMatchPrefix ? 2 :1, link: 'Match/id' },
        ... notExclude('ladder') ? [{ label: "Ladder", accessor:  matchPrefix+"ladder.name", sortable: true, parts:useMatchPrefix ? 3 :2, link: 'Ladders/id' }] : [],
        { label: "", accessor: "games", sortable: false, parts:0 }
    ]
    
    function notExclude(columnName) {
        if(!excludeColumns) return true

        return !excludeColumns.includes(columnName)
    }

    useEffect(() => {
        if(!dataIsFetched)
            //mf.listMatches(player, ladder, startDate, endDate).then((data) => {
            if(player)
                mf.getMatchesForPlayer(player, ladder, startDate, endDate, null, 10, null).then((data) => {
                    setMatches(data.matches)
                    setNextToken(data.nextToken)
                    setDataIsFetched(true)
                    setShowLoader(false)
                })
            
            if(ladderMatches) {
                setMatches(ladderMatches.matches)
                setNextToken(ladderMatches.nextToken)
                setDataIsFetched(true)
                setShowLoader(false)
            }
            else if(ladder)
            mf.getMatchesForLadder(ladder.id).then((data) => {
                setMatches(data.matches)
                setNextToken(data.nextToken)
                setDataIsFetched(true)
                setShowLoader(false)
            })

    }, [dataIsFetched, endDate, ladder, ladderMatches, player, startDate])

    function addMatches(e) {
        if(typeof onAddMatches === 'function') {
            onAddMatches(nextToken)
        }
        else
            mf.getMatchesForPlayer(player, ladder, startDate, endDate, null, 10, nextToken).then((data) => {
                setMatches(oldMatches => [...oldMatches.matches, ...data.matches])
                setNextToken(data.nextToken)
            })
    }
    const setColor = ((match, index) => {
        //console.log('setColor winnerId', match.winner)
        if (player) // win gets green and loss gets red
            return (match.winner.id === player.id) ? 'lightgreen' : '#ff5c5cb0'
        else // even gets white and odd gets grey
            return (index % 2 === 0) ? 'white' : 'grey'

    })

    if(showLoader) {
        return (
            <div style={{width: '100%'}}>
                <LinearProgress /> 
            </div>
        )
    }

    function displayGames(score) {
        const sets = score.split(',')
        let games = sets.map((set,i) => {
            const games = set.split('-')
            const winnerGames = games[0].substring(0, games[0].indexOf('(') === -1 ? games[0].length : games[0].indexOf('('))
            const loserGames = games[1].substring(0, games[1].indexOf('(') === -1 ? games[1].length : games[1].indexOf('('))

            return (
                <React.Fragment key={`matchScore_${i}`}>
                    <Text marginLeft={'1rem'} columnStart={i+2} columnEnd={i+3} rowStart="2">{winnerGames}</Text>
                    <Text marginLeft={'1rem'} columnStart={i+2} columnEnd={i+3} rowStart="4">{loserGames}</Text>
                </React.Fragment>
            )
        })
        return games
    }

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
                    nextToken={nextToken}
                    nextText={"View more matches"}
                    onNextClick={addMatches}
                    onLinkClick={() => {setShowLoader(true)}}
                    styleConditionColor={useColorCode ? ['win-accent','lose-accent'] : null}
                    styleConditionVariable={useColorCode ? 'win' : null}
                />
                : null
            }
            {displayAs === enums.DISPLAY_MODE.SimpleList ?
                matches?.map((m, i) => {
                    return (
                        <Grid key={i} templateColumns="auto 1fr 1fr 1fr 1fr 1fr 1fr 1fr" marginBottom={'1rem'}>
                            <Text columnStart="1" columnEnd="-1" fontSize="0.8em" fontStyle="italic">{m.match?.playedOn}</Text>
                            <View columnStart="1" columnEnd="2">{m.match.winner.name}</View>
                            <Divider columnStart="1" columnEnd="-1"  />
                            <View columnStart="1" columnEnd="2">{m.match.loser.name}</View>
                            {displayGames(m.match.score)}
                        </Grid>
                    )
                })
                
                : null
            }
        </section>
    )

}

export { Matches };