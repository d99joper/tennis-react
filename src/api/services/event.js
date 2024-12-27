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

  getParticipants: async function (id, page) {
    const requestOptions = authAPI.getRequestOptions('GET');
    const response = await fetch(eventsUrl + id +'/participants?page='+page, requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to update event')
  }

}


export default eventAPI