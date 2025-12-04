import { helpers } from "helpers"
import { authAPI } from "."
import apiUrl from "config"
import { fetchWithRetry } from "api/fetchWithRetry"

const eventsUrl = apiUrl + 'events/'

const eventAPI = {

  /* API calls */
  getEvent: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetchWithRetry(eventsUrl + id, requestOptions)
    if (response.ok)
      return await response.json()
    else
      throw new Error(response.error)//return { statusCode: response.status, statusMessage: 'Error: Failed to get league' }
  },

  getEvents: async function (filter, page, pageSize) {
    const url = new URL(eventsUrl)
    if (filter)
      url.search = helpers.parseFilter(filter)
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetchWithRetry(url + `&page=${page || 1}&num-per-page=${pageSize || 10}`, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.status, statusMessage: 'Error: Failed to get events' }
  },

  archiveEvent: async function (id) {
    const requestOptions = authAPI.getRequestOptions('PUT');

    const response = await fetch(`${eventsUrl}${id}/archive`, requestOptions)
    if (response.ok) {
      return { status: response.status }
    }
    else
      return { error: 'Error: Failed to archive event' }
  },

  deleteEvent: async function (id) {
    const requestOptions = authAPI.getRequestOptions('DELETE');

    const response = await fetch(`${eventsUrl}${id}/delete`, requestOptions)
    if (response.ok) {
      return { status: response.status }
    }
    else
      return { error: 'Error: Failed to delete event' }

  },

  setWinner: async function (event_id, winner_id, division_id = null) {
    const requestOptions = authAPI.getRequestOptions('POST', { division_id: division_id })

    const response = await fetch(`${eventsUrl}${event_id}/set-winner/${winner_id}`, requestOptions)
    if (response.ok) {
      return true
    }
    else
      return { error: 'Failed to set winner ' }
  },

  resetWinner: async function (event_id, division_id = null) {
    const requestOptions = authAPI.getRequestOptions('DELETE', { division_id: division_id })

    const response = await fetch(`${eventsUrl}${event_id}/reset-winner`, requestOptions)
    if (response.ok) {
      return true
    }
    else
      return { error: 'Failed to reset winner' }
  },

  checkRequirements: async function (event_id, player_id) {
    const requestOptions = authAPI.getRequestOptions('GET')

    const response = await fetchWithRetry(`${eventsUrl}check-restrictions/${event_id}/${player_id}`, requestOptions)
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
      return { success: response.ok, statusCode: response.status, event: data }
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
    const requestOptions = authAPI.getRequestOptions('POST', { participant: participant });

    const response = await fetch(eventsUrl + event_id + '/participants/add', requestOptions)
    if (response.ok) {
      return await response.json()
      //return {success: response.ok, statusCode: response.status, event: data}
    }
    else {
      const message = await response.json()
      console.log(message)
      throw new Error(message.error)
    }
  },

  // 0=get all participants
  getParticipants: async function (id, filter, page = 1, pageSize = 20) {
    const requestOptions = authAPI.getRequestOptions('GET');
    const params = new URLSearchParams({ page: page, page_size: pageSize, ...(filter ? filter : {}) })
    const response = await fetchWithRetry(`${eventsUrl}${id}/participants?${params}`, requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to update event')
  },

  removeParticipant: async function (event_id, participant_id) {
    const requestOptions = authAPI.getRequestOptions('DELETE');
    const response = await fetch(`${eventsUrl}${event_id}/participants/remove/${participant_id}`, requestOptions)
    if (response.ok) {
      return response.ok
    }
    else
      throw new Error(response.status + ': Failed to update event')
    //alert(`remove ${participant_id} from event ${event_id}`)
  },

  sendNotifications: async function (id, message) {
    const requestOptions = authAPI.getRequestOptions('POST', { message: message });
    const response = await fetch(`${eventsUrl}send-notifications/${id}`, requestOptions)
    if (response.ok) {
      return true
    }
    else
      throw new Error(response.status + ': Failed to send messages')
  },

  

}


export default eventAPI