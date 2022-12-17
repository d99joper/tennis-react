// Matches.js
import { Button, Collection, Flex } from "@aws-amplify/ui-react";
import {React, useState, lazy} from "react";
import {Match, displayMode, MatchEditor} from "../index.js"
import "./Matches.css"

const Matches = ({
    player,
    startDate,
    endDate,
    ladder,
    showHeader = true,
    displayAs = displayMode.Inline,
    allowAdd = true,
    ...props
}) => {

    //const MatchEditor = lazy(() => import("../MatchEditor/MatchEditor").then(module => {return { default: module.MatchEditor }}))

    const [matches, setMatches] = useState([
        {id: 1, playedOn: '2018-05-17', 
        winner: {id: '433460c9-1f09-426d-935b-343e121237d8', name: 'Jonas P'}, 
        loser: {id: 2, name: 'Gurra B'}, 
        score: '6-0, 6-0', 
        ladder: {id:1, name: 'Davis 4.0'}, 
        comments: [{id:1, content:'nice'},{id:2, content: 'good game'}]},
        {id: 2, playedOn: '2018-05-18', 
        winner: {id: 2, name: 'Gurra B'}, 
        loser: {id: '433460c9-1f09-426d-935b-343e121237d8', name: 'Jonas P'}, 
        score: '6-4, 2-6, 6-3', 
        ladder: {id:1, name: 'Davis 4.0'}, 
        comments: [{id:1, content:'nice'},{id:2, content: 'good game'}]},
        {id: 3, playedOn: '2018-09-19', 
        winner: {id: '433460c9-1f09-426d-935b-343e121237d8', name: 'Jonas P'}, 
        loser: {id: 2, name: 'Gurra Benndorfius III'}, 
        score: '6-7(2), 7-6(0), 1-0(11)', 
        ladder: {id:1, name: 'Davis 4.0'}, 
        comments: [{id:1, content:'nice'},{id:2, content: 'good game'}]},
        ]);
    
    const setColor = ((match, index) => {
        //console.log('setColor winnerId', match.winner)
        if(player) // win gets green and loss gets red
            return (match.winner.id === player.id) ? 'lightgreen' : '#ff5c5cb0'
        else // even gets white and odd gets grey
            return (index % 2 == 0 ) ? 'white' : 'grey'

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
            {(
                allowAdd && displayAs === displayMode.Inline &&
                <Flex >
                    <Button>Add New</Button>
                    <MatchEditor player={player} onSubmit={(m) => {setMatches(...matches, m)}} />
                </Flex>
            )}
        </section>
    )

}

export {Matches};