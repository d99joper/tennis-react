// Matches.js
import { Button, Collection, Flex } from "@aws-amplify/ui-react";
import { matchFunctions as mf } from "helpers/index.js";
import { React, Suspense, useState, lazy, useEffect } from "react";
import { Match, displayMode } from "../index.js"
import "./Matches.css"

const Matches = ({
    player,
    startDate,
    endDate = new Date,
    ladder,
    showHeader = true,
    displayAs = displayMode.Inline,
    allowAdd = true,
    ...props
}) => {

    const MatchEditor = lazy(() => import("../MatchEditor/MatchEditor").then(module => { return { default: module.MatchEditor } }))

    const [matches, setMatches] = useState([])

    useEffect(()=>{
        mf.listMatches(player, ladder, startDate, endDate).then((data) => {
            setMatches(data)
        })
    },[])
    


    const setColor = ((match, index) => {
        //console.log('setColor winnerId', match.winner)
        if (player) // win gets green and loss gets red
            return (match.winner.id === player.id) ? 'lightgreen' : '#ff5c5cb0'
        else // even gets white and odd gets grey
            return (index % 2 == 0) ? 'white' : 'grey'

    })

    return (
        <section {...props}>
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
                        showComments={true}
                    ></Match>
                )}
            </Collection>
            {( // keep false for now (it's moved into the profile)
                false && allowAdd && displayAs === displayMode.Inline &&
                <Flex >
                    <Button>Add New</Button>
                    <Suspense fallback={<h2>loading...</h2>}>
                        <MatchEditor player={player} onSubmit={(m) => { setMatches(...matches, m) }} />
                    </Suspense>
                </Flex>
            )}
        </section>
    )

}

export { Matches };