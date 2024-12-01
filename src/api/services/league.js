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
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get league' }
  },

  getLeagues: async function (filter) {
    const url = new URL(leaguesUrl)
    if(filter)
      url.search = helpers.parseFilter(filter)
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(url, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get leagues' }
  },

  createLeague: async function (league) {
    const requestOptions = authAPI.getRequestOptions('POST', league)

    const response = await fetch(leaguesUrl + 'create', requestOptions)
    if (response.ok)
      return await response.json()
    else
      throw new Error(response.status + ': Failed to create league')
  },

  // partial ladder as input. Only provided fields get updated
  updateLadder: async function (league) {
    const requestOptions = authAPI.getRequestOptions('PATCH', league)

    const response = await fetch(leaguesUrl + 'update', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to update league' }
  },

  addParticipant: async function (type, participant, leagueId) {
    {/** NOT DONE */}
    const requestOptions = authAPI.getRequestOptions('POST', { 
        type: type, 
        participant: participant
    })

    const response = await fetch(leaguesUrl + leagueId + '/add-participant', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to add participant to league.' }
  },
}


export default leagueAPI