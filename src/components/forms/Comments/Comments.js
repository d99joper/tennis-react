import { Box, Button, Card, CardContent, Divider, Grid2 as Grid, LinearProgress, TextField, Typography } from "@mui/material"
import { authAPI, commentsAPI } from "api/services"
import { helpers } from "helpers"
import React, { useEffect, useState } from "react"
import { AiFillDelete, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"

const Comments = ({ data = null, entityId = null, entityType = 'match', showComments = true, allowAdd = false, ...props }) => {

  const [comments, setComments] = useState(data ?? [])
  const [showAdd, setShowAdd] = useState(false)
  const [error, setError] = useState(false)
  const [newComment, setNewComment] = useState({})
  const currentUser = authAPI.getCurrentUser()
  const [loading, setLoading] = useState(false)

  //console.log('allowAdd', allowAdd)

  useEffect(() => {
    async function fetchComments() {
      if (showComments && entityId) {
        setLoading(true)
        try {
          const data = await commentsAPI.getComments(entityId, entityType)
          if (data.comments?.length > 0)
            setComments(data.comments)
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchComments()
  }, [showComments, entityId])

  async function handleSubmit() {
    newComment.postedBy = currentUser.id
    switch (entityType) {
      case 'match':
        newComment.match_id = entityId
        break;
      case 'court':
        newComment.court_id = entityId
        break;
      default:
        setError(true)
        return
    }
    //console.log(newComment)
    if ((!newComment.content) || newComment.content?.length < 3)
      setError(true)
    else
      setError(false)
    try{
      setLoading(true)
      setShowAdd(false)
      await commentsAPI.createComment(newComment).then((c) => {
        setComments(prevComments => [...prevComments, c])
        setNewComment({})
      })
    } catch(e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  function deleteComment(id) {
    if (window.confirm('are you sure you want to delete this comment?')) {
      commentsAPI.deleteComment(id).then(() => {
        setComments(prevComments => prevComments.filter(item => item.id !== id))
      })
    }
  }

  const deleteButtonStyle = {
    position: 'absolute',
    bottom: '.4rem',
    right: '.4rem',
  }
  const formatText = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <Grid container direction={'column'} gap={1}>
      <Divider>Comments</Divider>
      {loading && <LinearProgress />}
      {comments?.map((comment, i) => {
        return (
          <Card key={'comment_' + i} sx={{ minWidth: 275, backgroundColor: 'whitesmoke' }}>
            <CardContent sx={{ position: 'relative' }}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {comment.posted_on} by {comment.posted_by.name}
              </Typography>
              <Typography variant="body2">
                {formatText(comment.content)}
              </Typography>
              {currentUser.id === comment.posted_by.id &&
                <div
                  style={deleteButtonStyle}
                  title="delete"
                  aria-valuetext='delete'
                >
                  <AiFillDelete
                    onClick={() => { deleteComment(comment.id) }}
                    className="cursorHand icon-hover-red"
                  />
                </div>
              }
            </CardContent>
          </Card>
        )
      })}
      {!loading && comments.length === 0 &&
        <Box><i>Be the first to comment.</i></Box>
      }

      <div className="cursorHand" onClick={() => { setShowAdd(!showAdd) }}>
        {showAdd
          ? <AiOutlineMinus size={25} />
          : <><AiOutlinePlus size={25} color="green" /> Add comment</>
        }
      </div>
      {showAdd &&
        <>
          <TextField
            id="outlined-multiline-static"
            label="Care to comment..."
            multiline
            rows={4}
            onChange={(e) => {
              setNewComment((prevObject) => ({
                ...prevObject,
                content: e.target.value
              }))
            }}
            value={newComment.content ?? ''}
            placeholder="Care to comment..."
            error={error}
            helperText={error ? <span style={{ color: 'red' }}>Say more, please.</span> : ''}
          />
          <Button variant="outlined" onClick={() => handleSubmit()}>Submit</Button>
        </>
      }
    </Grid>
  )
}

export { Comments }