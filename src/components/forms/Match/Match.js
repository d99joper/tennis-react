import React, { useState } from "react";
import { Flex, View } from "@aws-amplify/ui-react";
import { GiCrossedSwords } from 'react-icons/gi';
import { GoCommentDiscussion } from 'react-icons/go';
import { helpers, enums } from "../../../helpers";
import { Link } from "react-router-dom";
import "./Match.css"
import {Comments} from "../index"

const Match = ({
    index,
    match,
    color,
    showH2H = true,
    showComments = false,
    showHeader = true,
    displayAs = enums.DISPLAY_MODE.Card, // default to card
    ...props
}) => {

    const [isShowComments, setIsShowComments] = useState(false)

    if (displayAs === enums.DISPLAY_MODE.Inline) {
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
                        {showComments === true ?
                            <>
                                <div className={"hoverText-container" + (!isShowComments ? " hide" : "")}>
                                    <div className="hoverText">
                                        <Comments key={match.id} matchId={match.id} showComments={showComments} />
                                    </div>
                                </div>
                                <GoCommentDiscussion
                                    aria-label="Comments"
                                    title="Comments"
                                    onClick={() => { setIsShowComments(!isShowComments) }}
                                    // onMouseOver={() => { setIsShowComments(true) }}
                                    className="middleIcon"
                                    color="#3e3333"
                                />
                            </>
                            : ""
                        }
                        {showH2H ?
                            <GiCrossedSwords title="H2H" className="middleIcon" color="#3e3333" />
                            : ""
                        }
                    </View>
                </Flex>
            </section>
        )
    }
    else if (displayAs === enums.DISPLAY_MODE.Card) {
        return (<>This is a card</>)
    }
}

// const displayMode = {
//     Inline: 'inline',
//     Card: 'card'
// }

export { Match }