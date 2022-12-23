import {matchFunctions as mf} from "helpers/index"
import React, { useEffect, useState } from "react"

const Comments = ({matchId}) => {

    const [comments, setComments] = useState([])
    const [commentsFetched, setCommentsFetched] = useState(false)

    if(!commentsFetched) {
        mf.GetComments(matchId).then((data) => {
                     setComments(data)
                     setCommentsFetched(true)
        })
    }
    // useEffect(() =>{
    //     mf.GetComments(matchId).then((data) => {
    //         setComments(data)
    //     })
    // },[])
    
    return (
        <>
            <span style={{position: 'relative', maxWidth: "300px", whiteSpace: 'pre-wrap'}}>
                {comments?.map((comment) => {
                    return comment.content
                })}    
            </span>
        </>
    )
}

export {Comments}