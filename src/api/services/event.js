import { enums, helpers } from "helpers"
import { authAPI } from "."
import apiUrl from "config"

const eventsUrl = apiUrl+'events/'

const eventAPI = {

  /* API calls */
  getEvent: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(eventsUrl + id, requestOptions)
    if (response.ok)
      return await response.json()
    else
      throw new Error(response.error)//return { statusCode: response.status, statusMessage: 'Error: Failed to get league' }
  },

  getEvents: async function (filter) {
    const url = new URL(eventsUrl)
    if(filter)
      url.search = helpers.parseFilter(filter)
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(url, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.status, statusMessage: 'Error: Failed to get leagues' }
  },

  checkRequirements: async function (event_id, player_id) {
    const requestOptions = authAPI.getRequestOptions('GET')

    const response = await fetch(`${eventsUrl}check-restrictions/${event_id}/${player_id}`, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return data
    }
    else
      throw new Error(response.status + ': Failed to check requirements for event')
  },

  createEvent: async function (event) {
    const requestOptions = authAPI.getRequestOptions('POST', event)

    const response = await fetch(eventsUrl + 'create', requestOptions)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.status, event: data}
    }
    else
      throw new Error(response.status + ': Failed to create event')
  },

  updateEvent: async function (id, event) {
    const requestOptions = authAPI.getRequestOptions('PUT', event);

    const response = await fetch(eventsUrl + id + '/update', requestOptions)
    if (response.ok) {
      return await response.json()
      //return {success: response.ok, statusCode: response.status, event: data}
    }
    else
      throw new Error(response.status + ': Failed to update event')
  },

  addParticipant: async function (event_id, participant) {
    const requestOptions = authAPI.getRequestOptions('POST', {participant: participant});

    const response = await fetch(eventsUrl + event_id + '/participants/add', requestOptions)
    if (response.ok) {
      return await response.json()
      //return {success: response.ok, statusCode: response.status, event: data}
    }
    else
      throw new Error(response.status + ': Failed to update event')
  },
  
  // 0=get all participants
  getParticipants: async function (id, filter, page=1, pageSize=20) {
    const requestOptions = authAPI.getRequestOptions('GET');
    const params = new URLSearchParams({page:page, page_size:pageSize, ...(filter ? filter : {})}) 
    const response = await fetch(`${eventsUrl}${id}/participants?${params}`, requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to update event')
  }

}


export default eventAPI