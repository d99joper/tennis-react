import { Collection } from "@aws-amplify/ui-react";
import { helpers, enums, userFunctions } from "helpers";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { ItemCard, Ladder } from "../index.js"
import './Ladders.css'
import { Avatar, Paper, Typography } from "@mui/material"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const Ladders = ({
    ladders, useMatchItems, usePlayerItems, displayAs = enums.DISPLAY_MODE.Card, ...props
}) => {
    console.log(ladders)

    if(displayAs === enums.DISPLAY_MODE.Card)
        return (
            <Collection
                type="list"
                title={props.title}
                items={ladders}
                direction='column'
                justifyContent={'space-between'}
            >
                {(item, index) => (
                    <ItemCard
                        key={`${item.id}_list${index}`}
                        width={props.width ?? 350}
                        backgroundColor={'#white'}
                        footer={
                            <>
                                <span>{item.players.items.length  ?? 0} players</span><br />
                                <span>{item.matches.items.length ?? 0} matches</span>
                            </>
                        }
                        header={
                            <Link to={`/ladders/${item.id}`}>{item.name ?? 'Unknown ladder'}</Link>
                        }
                        description={item.description ?? ''}
                        footerRight={`[${item.matchType === enums.MATCH_TYPE.DOUBLES ? 'Doubles' : 'Singles'}, level: ${helpers.intToFloat(item.level.min)}${item.level.max !== item.level.min ? '-' + helpers.intToFloat(item.level.max) : ''}]`}
                    />
                )}
            </Collection>
        )
    if(displayAs === enums.DISPLAY_MODE.Inline)
        return (
            ladders.map((ladder, i) => {
                return (
                    <Paper elevation={3} sx={{padding:.5, backgroundColor: 'white'}} key={i}>
                        <span style={{float: 'right'}}>
                            <span>{usePlayerItems ? ladder.players.items.length : ladder.players.length} players</span><br />
                            <span>{useMatchItems ? ladder.matches.items.length : ladder.matches.length} matches</span>    
                        </span>
                        <Typography variant="h6">{ladder.name}</Typography>
                    </Paper>
                )
            })
        )
}

export { Ladders };