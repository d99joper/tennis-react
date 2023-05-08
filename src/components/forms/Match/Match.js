import React, { useState } from "react";
import { Divider, Flex, Grid, Text, View } from "@aws-amplify/ui-react";
import { GiCrossedSwords } from 'react-icons/gi';
import { GoCommentDiscussion } from 'react-icons/go';
import { helpers, enums, userFunctions } from "../../../helpers";
import { Link } from "react-router-dom";
import "./Match.css"
import { Comments, H2H } from "../index"
import { Box, Modal } from "@mui/material";
// import Modal from "components/layout/Modal/modal";

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
    const [isShowH2H, setIsShowH2H] = useState(false)
    const [isH2HDataFetched, setIsH2HDataFetched] = useState(false)
    const [h2HData, setH2HData] = useState()

    function openH2HModal() {
        if (!isH2HDataFetched) {
            console.log("openH2H", match.winner.id)
            userFunctions.getPlayerH2H(match.winner, match.loser).then((data) => {
                setH2HData(data)
                console.log(data)
            })
            setIsH2HDataFetched(true)
        }
        setIsShowH2H(true)
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
                            <>
                                <GiCrossedSwords
                                    title="H2H"
                                    className="middleIcon"
                                    color="#3e3333"
                                    onClick={openH2HModal} />
                                <Modal
                                    aria-labelledby={'Head to Head'}
                                    aria-describedby="Head to Head"
                                    onClose={() => setIsShowH2H(false)}
                                    open={isShowH2H}
                                >
                                    <Box sx={helpers.modalStyle}>
                                        <div>{`${match.winner.name} vs ${match.loser.name}`}</div>
                                        <H2H data={h2HData} />
                                    </Box>

                                </Modal>
                            </>
                            : ""
                        }
                    </View>
                </Flex>
            </section>
        )
    }
    else if (displayAs === enums.DISPLAY_MODE.Card) {
        return (
            <Grid 
                templateColumns="auto 1fr 1fr 1fr 1fr 1fr 1fr" 
                marginBottom={'1rem'}
                backgroundColor={props.backgroundColor ?? null}
            >
                <Text columnStart="1" columnEnd="-1" fontSize="0.8em" fontStyle="italic">{match?.playedOn}</Text>
                <View columnStart="1" columnEnd="2">{match.winner.name}</View>
                <Divider columnStart="1" columnEnd="-1" />
                <View columnStart="1" columnEnd="2">{match.loser.name}</View>
                {displayGames(match.score)}
            </Grid>
        )
    }
}

// const displayMode = {
//     Inline: 'inline',
//     Card: 'card'
// }

export { Match }