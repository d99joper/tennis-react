import { enums, helpers } from "helpers"
import { authAPI } from "."
import apiUrl from "config"

const leaguesUrl = apiUrl+'leagues/'

const leagueAPI = {

  /* API calls */
  getLeague: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(leaguesUrl + id, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.status, statusMessage: 'Error: Failed to get league' }
  },

  getLeagues: async function (filter, page, pageSize) {
    const url = new URL(leaguesUrl)
    if(filter)
      url.search = helpers.parseFilter(filter)
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(url, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.status, statusMessage: 'Error: Failed to get leagues' }
  },

  createLeague: async function (league) {
    const requestOptions = authAPI.getRequestOptions('POST', league)

    const response = await fetch(leaguesUrl + 'create', requestOptions)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.status, data: data}
    }
    else
      throw new Error(response.status + ': Failed to create league')
  },

  generateSchedule: async function(id) {
    const requestOptions = authAPI.getRequestOptions('POST')

    const response = await fetch(leaguesUrl + id + '/schedule/generate', requestOptions)
    //console.log(response)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.status, schedule: data.schedule}
    }
    else
      throw new Error(response.status + ': Failed to create schedule')
  },

  updateSchedule: async function(id, schedule) {
    const requestOptions = authAPI.getRequestOptions('PUT', {schedule: schedule})

    const response = await fetch(leaguesUrl + id + '/schedule/update', requestOptions)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.status, schedule: data.schedule}
    }
    else
      throw new Error(response.status + ': Failed to create schedule')
  },

  addParticipant: async function (leagueId, participant) {
    const requestOptions = authAPI.getRequestOptions('POST', { 
        participant: participant
    })

    const response = await fetch(leaguesUrl + leagueId + '/participants/add', requestOptions)
    if (response.ok)
      return {success: response.ok}
    else
      return { statusCode: response.status, error: response.error}
  },

  removeParticipant: async function (leagueId, participantId) {
    const requestOptions = authAPI.getRequestOptions('POST')

    const response = await fetch(leaguesUrl + leagueId + '/participants/remove/'+participantId, requestOptions)
    if (response.ok)
      return {success: response.ok}
    else
      return { statusCode: response.status, error: response.error}
  },

  getStandings: async function(leagueId) {
    const requestOptions = authAPI.getRequestOptions('GET');

    const response = await fetch(leaguesUrl + leagueId + '/standings', requestOptions)
    if(response.ok)
      return await response.json()
    else 
      return {statusCode: response.status, error: response.error}

  },
}


export default leagueAPI