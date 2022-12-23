import React, { lazy, Suspense, useState } from "react";
import { Flex, View } from "@aws-amplify/ui-react";
import { GiCrossedSwords } from 'react-icons/gi';
import { GoCommentDiscussion } from 'react-icons/go';
import { helpers } from "../../../helpers/helpers";
import { Link } from "react-router-dom";
import "./Match.css"

const Match = ({
    index,
    match,
    color,
    showH2H = true,
    showComments = true,
    showHeader = true,
    displayAs = displayMode.Card, // default to card
    ...props
}) => {

    const [isShowComments, setIsShowComments] = useState(false)

    // const Comments = lazy(() => import("../index").then(module => { return { default: module.Comments } }))
    // const MemoizedComments = React.memo(Comments)
    
    function memoCompare(prev, next){
        console.log("prev", prev)
        console.log("next", next)
        return true
    }

    const MemoizedComments = lazy(() =>
        import("../index").then(module => {
            const Comments = module.Comments
            return { default: React.memo(Comments, memoCompare) }
        })
    )

    if (displayAs === displayMode.Inline) {
        return (
            <section {...props}>
                {(showHeader && index === 0) ?
                    <Flex className="matchHeaderRow">
                        <View className="date">Date</View>
                        <View className="playerName">Winner</View>
                        <View className="playerName">Loser</View>
                        <View className="score">Score</View>
                        <View className="ladderName">Ladder</View>
                        <View className="iconSet"></View>
                    </Flex>
                    : null
                }
                <Flex className="matchRow" backgroundColor={color}>
                    <View className="date">{helpers.formatDate(match.playedOn)}</View>
                    <View className="playerName"><Link to={"/profile/" + match.winner.id}>{match.winner.name}</Link></View>
                    <View className="playerName"><Link to={"/profile/" + match.loser.id}>{match.loser.name}</Link></View>
                    <View className="score">{match.score}</View>
                    <View className="ladderName"><Link to={"/ladders/" + match.ladder.id}>{match.ladder.name}</Link></View>
                    <View className="iconSet">
                        {showComments ?
                            <>
                                {isShowComments &&
                                    <div className="hoverText-container">
                                        <div className="hoverText">
                                            <Suspense fallback={<h3>Loading...</h3>}>
                                                <MemoizedComments matchId={match.id} />
                                            </Suspense>
                                        </div>
                                    </div>
                                }
                                <GoCommentDiscussion
                                    onMouseOut={() => { setIsShowComments(false) }}
                                    onMouseOver={() => { setIsShowComments(true) }}
                                    className="middleIcon"
                                    color="#3e3333"
                                />
                            </>
                            : ""
                        }
                        {showH2H ?
                            <GiCrossedSwords className="middleIcon" color="#3e3333" />
                            : ""
                        }
                    </View>
                </Flex>
            </section>
        )
    }
    else if (displayAs === displayMode.Card) {
        return (<>This is a card</>)
    }
}

const displayMode = {
    Inline: 'inline',
    Card: 'card'
}

export { Match, displayMode }