import { authAPI } from "."
import apiUrl from "config"

const clubUrl = apiUrl+'clubs/'

const clubAPI = {

  /* API calls */
  getClub: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(clubUrl + id, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.statusCode, data:data}
    }
    else
      return { success: response.ok, statusCode: response.statusCode, statusMessage: 'Error: Failed to get club' }
  },
  getArchivedEvents: async function(clubId) {
    const requestOptions = authAPI.getRequestOptions('GET')
    return await fetch(clubUrl + clubId + '/archived-events', requestOptions);
  },
  getMembers: async function(clubId) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(clubUrl + clubId + '/members', requestOptions);
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.statusCode, data:data}
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get club members' }
  },
  
  getClubs: async function (filter) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const params = new URLSearchParams(filter)
    console.log(params)
    const response = await fetch(`${clubUrl}?${params}`, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.statusCode, data:data}
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get clubs' }
  },

  createClub: async function(club) {
    const requestOptions = authAPI.getRequestOptions('POST', club)
    const response = await fetch(clubUrl+'create', requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to create club') 
  },

  updateClub: async function(clubId, club) {
    const requestOptions = authAPI.getRequestOptions('PUT', club)
    const response = await fetch(clubUrl+clubId+'/update', requestOptions)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.statusCode, data: data}
    }
    else
      throw new Error(response.status + ': Failed to update club') 
  },

  addPlayer: async function(clubId, playerId) {
    const requestOptions = authAPI.getRequestOptions('POST')
    const response = await fetch(`${clubUrl}add-player-to-club/${clubId}/${playerId}`, requestOptions)
    if (response.ok) {
      return {success: response.ok, statusCode: response.statusCode, message: response.message}
    }
    else
      throw new Error(response.status + response.error) 
  },

  removePlayer: async function(clubId, playerId) {
    const requestOptions = authAPI.getRequestOptions('POST')
    const response = await fetch(`${clubUrl}remove-player-from-club/${clubId}/${playerId}`, requestOptions)
    if (response.ok) {
      return {success: response.ok, statusCode: response.statusCode, message: response.message}
    }
    else
      throw new Error(response.status + response.error) 
  },

  addAdmin: async function(clubId, playerId) {
    const requestOptions = authAPI.getRequestOptions('POST')
    const response = await fetch(`${clubUrl}add-admin-to-club/${clubId}/${playerId}`, requestOptions)
    if (response.ok) {
      return {success: response.ok, statusCode: response.statusCode, message: response.message}
    }
    else
      throw new Error(response.status + response.error) 
  },

}

export default clubAPI;