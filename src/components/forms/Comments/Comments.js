import { matchHelper as mf } from "helpers/index"
import React, { useEffect, useState } from "react"

const Comments = ({ matchId, showComments }) => {

    const [comments, setComments] = useState([{ id: -1, content: '' }])

    useEffect(() => {
        if (showComments) {
            mf.GetComments(matchId).then((data) => {
                if(data.length > 0) setComments(data)
                else setComments([{id:-1, content: 'No comments available'}])
            })
        }
    },[showComments,matchId])

    return (
        <>
            <span className={(!showComments ? "hide":"")} style={{ position: 'relative', maxWidth: "300px", whiteSpace: 'pre-wrap' }}>
                {comments?.map((comment) => {
                    return comment.content
                })}
            </span>
        </>
    )
}

export { Comments }