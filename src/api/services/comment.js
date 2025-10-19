import { fetchWithRetry } from "api/fetchWithRetry"
import { authAPI } from "."
import apiUrl from "config"

const commentsUrl = apiUrl+'comments/'

const commentsAPI = {
  
  getComments: async function(entityId, entityType, page, numPerPage) {
    console.log('hello comments api')
    const requestOptions = authAPI.getRequestOptions('GET')
    let urlPart = '?'
    switch (entityType) {
      case 'match':
        urlPart += 'match-id='
        break;
      case 'court':
        urlPart += 'court-id='
        break;
      case 'club':
        urlPart += 'club-id='
        break;
      case 'event':
        urlPart += 'event-id='
        break;
      default:
        break;
    }
    const url = commentsUrl
      + urlPart + entityId 
      + (page ? '&page=' + page : '')
      + (numPerPage ? '&num-per-page=' + numPerPage : '')

    let response = await fetchWithRetry(url, requestOptions)

    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get matches' }
  },

  createComment: async function(comment) {
    console.log('create comment')
    const requestOptions = authAPI.getRequestOptions('POST', comment)
    
    const response = await fetchWithRetry(commentsUrl + 'create', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create comment' }
  },

  deleteComment: async function(id) {
    console.log('delete comment')
    const requestOptions = authAPI.getRequestOptions('POST')
    
    const response = await fetchWithRetry(commentsUrl + id + '/delete', requestOptions)

  }
}

export default commentsAPI