// Matches.js
import { Button, Collection, Divider, Flex, Grid, Loader, Pagination, Text, View } from "@aws-amplify/ui-react";
import { matchFunctions as mf, enums, userFunctions as uf } from "helpers";
import React, { Suspense, useState, lazy, useEffect } from "react";
import { DynamicTable, Match } from "../index.js"
import "./Matches.css"
import { LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";

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
    allowDelete = false,
    excludeColumns,
    useColorCode = true,
    sortingField = "playedOn",
    sortDirection = "DESC",
    ...props
}) => {

    const MatchEditor = lazy(() => import("../MatchEditor/MatchEditor").then(module => { return { default: module.MatchEditor } }))

    const [matches, setMatches] = useState([])
    // const [sortField, setSortField] = useState(sortingField)
    // const [direction, setDirection] = useState(sortDirection)
    //const [{ sortField, direction }, setSort] = useState({ sortField: sortingField, direction: sortDirection })
    const [nextToken, setNextToken] = useState("playedOn");
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState()
    const [showLoader, setShowLoader] = useState(true);
    const matchPrefix = matches?.[0]?.hasOwnProperty('match') ? 'match.' : ''
    const useMatchPrefix = matches?.[0]?.hasOwnProperty('match') ? true : false

    const tableHeaders = [
        { label: "Date", accessor: matchPrefix + "playedOn", sortable: false, parts: useMatchPrefix ? 2 : 1, link: 'Match/id' },
        { label: "Winner", accessor: matchPrefix + "winner.name", sortable: false, parts: useMatchPrefix ? 3 : 2, link: 'Profile/id' },
        { label: "Loser", accessor: matchPrefix + "loser.name", sortable: false, parts: useMatchPrefix ? 3 : 2, link: 'Profile/id' },
        { label: "Score", accessor: matchPrefix + "score", sortable: false, parts: useMatchPrefix ? 2 : 1, link: 'Match/id' },
        ...notExclude('ladder') ? [{ label: "Ladder", accessor: matchPrefix + "ladder.name", sortable: false, parts: useMatchPrefix ? 3 : 2, link: 'Ladders/id' }] : [],
        { label: "", accessor: "games", sortable: false, parts: 0 }
    ]

    function notExclude(columnName) {
        if (!excludeColumns) return true

        return !excludeColumns.includes(columnName)
    }

    useEffect(() => {
        //if(!dataIsFetched)
        //mf.listMatches(player, ladder, startDate, endDate).then((data) => {
        if (player) 
            mf.getMatchesForPlayer(player, null, 10, page).then((data) => {
                //mf.getMatchesForPlayer(player, ladder, startDate, endDate, direction, null, 10, null).then((data) => {
                setMatches(data.matches)
                //setNextToken(data.nextToken)
                //setDataIsFetched(true)
                //setCurrentPlayer(player)
                setTotalPages(data.totalPages)
                setShowLoader(false)
            })
        else setShowLoader(false)

        if (ladderMatches) {
            setMatches(ladderMatches.matches)
            setNextToken(ladderMatches.nextToken)
            //setDataIsFetched(true)
            setShowLoader(false)
        }
        else if (ladder)
            mf.getMatchesForLadder(ladder.id, null, 10, page).then((data) => {
                setMatches(data.matches)
                //setNextToken(data.nextToken)
                setTotalPages(data.totalPages)
                //setDataIsFetched(true)
                setShowLoader(false)
            })
    }, [endDate, ladder, ladderMatches, player, startDate, page])

    // function addMatches(e) {
    //     if (typeof onAddMatches === 'function') {
    //         onAddMatches(nextToken)
    //     }
    //     else
    //         mf.getMatchesForPlayer(player, ladder, startDate, endDate, direction, null, 10, nextToken).then((data) => {
    //             if (matches.matches)
    //                 setMatches(oldMatches => [...oldMatches.matches, ...data.matches])
    //             else
    //                 setMatches(oldMatches => [...oldMatches, ...data.matches])
    //             setNextToken(data.nextToken)
    //         })
    // }
    const setColor = ((match, index) => {
        //console.log('setColor winnerId', match.winner)
        if (player) // win gets green and loss gets red
            return (match.winner.id === player.id) ? 'lightgreen' : '#ff5c5cb0'
        else // even gets white and odd gets grey
            return (index % 2 === 0) ? 'white' : 'grey'

    })

    if (showLoader) {
        return (
            <div style={{ width: '100%' }}>
                <LinearProgress />
            </div>
        )
    }

    function displayGames(score) {
        const sets = score.split(',')

        let games = sets.map((set, i) => {
            const games = set.match(/\d+/g).map(Number)

            return (
                <React.Fragment key={`matchScore_${i}`}>
                    <Text marginLeft={'1rem'} columnStart={i + 2} columnEnd={i + 3} rowStart="2">{games[0]}</Text>
                    <Text marginLeft={'1rem'} columnStart={i + 2} columnEnd={i + 3} rowStart="4">
                        {games[1]}{games[2] && <sup>({games[2]})</sup>}
                    </Text>
                </React.Fragment>
            )
        })
        return games
    }
    function handleNextPage() {
        setPage(page+1)
    }
    function handlePreviousPage() {
        setPage(page-1)
    }
    function handleOnChange(newPageIndex) {
        setPage(newPageIndex)
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
                                allowDelete={allowDelete}
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
                <>
                    <DynamicTable
                        key={"matches"}
                        columns={tableHeaders}
                        allowDelete={allowDelete}
                        deleteFunc={(match) => {
                            console.log(match.match.id)
                            mf.deleteMatch(match.match.id)
                            setMatches(matches.filter(x => x.match.id !== match.match.id))
                        }}
                        // sortHandler={sortHandler}
                        // sortField={sortField}
                        // direction={direction}
                        data={matches}
                        iconSet={[{ name: 'H2H' }, { name: 'Comments' }]}
                        //nextToken={nextToken}
                        nextText={"View more matches"}
                        //onNextClick={addMatches}
                        onLinkClick={(p) => { if (p != player.id) setShowLoader(true) }}
                        styleConditionColor={useColorCode ? ['win-accent', 'lose-accent'] : null}
                        styleConditionVariable={useColorCode ? 'win' : null}
                    />
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onNext={handleNextPage}
                        onPrevious={handlePreviousPage}
                        onChange={handleOnChange}
                    />
                </>
                : null
            }
            {displayAs === enums.DISPLAY_MODE.SimpleList ?
                matches?.map((m, i) => {
                    return (
                        <Grid key={i} templateColumns="auto 1fr 1fr 1fr 1fr 1fr 1fr" marginBottom={'1rem'}>
                            <Text columnStart="1" columnEnd="-1" fontSize="0.8em" fontStyle="italic">{m.match?.playedOn}</Text>
                            <View columnStart="1" columnEnd="2">
                                <Link to={`/profile/${m.match.winner.id}`} >{uf.SetPlayerName(m.match.winner)}</Link>
                            </View>
                            <Divider columnStart="1" columnEnd="-1" />
                            <View columnStart="1" columnEnd="2">
                                <Link to={`/profile/${m.match.loser.id}`} >{uf.SetPlayerName(m.match.loser)}</Link>
                            </View>
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