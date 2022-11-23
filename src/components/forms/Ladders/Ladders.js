import React from "react";
import { useParams } from "react-router-dom";
import {Ladder} from "../index.js"
import './Ladders.css'

const Ladders = ({
    ...props
}) => {

    const params = useParams();

    if(params.ladderId) {

    }

    return (
        <>
            {params.ladderId ? <Ladder id={params.ladderId}></Ladder>
            :
            'list ladders here'
            }    
        </>
    )
}

export {Ladders};