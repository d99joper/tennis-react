import { Collection } from "@aws-amplify/ui-react";
import { helpers } from "helpers/helpers.js";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { ItemCard, Ladder } from "../index.js"
import './Ladders.css'

const Ladders = ({
    ladders, useMatchItems, usePlayerItems, ...props
}) => {
console.log(ladders)
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
                    width={350}
                    backgroundColor={'#white'}
                    footer={
                        <>
                            <span>{usePlayerItems ? item.players.items.length : item.players.length} players</span><br />
                            <span>{useMatchItems ? item.matches.items.length : item.matches.length} matches</span>
                        </>
                    }
                    header={
                        <Link to={`/ladders/${item.id}`}>{item.name ?? 'Unknown ladder'}</Link>
                    }
                    description={item.description ?? ''}
                    footerRight={`Level: ${helpers.intToFloat(item.level.min)}${item.level.max !== item.level.min ? '-' + helpers.intToFloat(item.level.max) : ''}`}
                />
            )}
        </Collection>
    )
}

export { Ladders };