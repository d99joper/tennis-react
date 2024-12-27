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
  
  getClubs: async function (filter) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(`${clubUrl}?${filter}`, requestOptions)
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
      const data = await response.json()
      return {success: response.ok, statusCode: response.statusCode, data: data}
    }
    else
      throw new Error(response.status + ': Failed to create club') 
  },

  updateClub: async function(club) {
    const requestOptions = authAPI.getRequestOptions('PUT', club)
    const response = await fetch(clubUrl+club.id+'/update', requestOptions)
    if (response.ok) {
      const data = await response.json()
      return {success: response.ok, statusCode: response.statusCode, data: data}
    }
    else
      throw new Error(response.status + ': Failed to update club') 
  },

  addPlayerToClub: async function(clubId, playerId) {
    const requestOptions = authAPI.getRequestOptions('POST')
    const response = await fetch(`${clubUrl}add_player_to_club/${clubId}/${playerId}`, requestOptions)
    if (response.ok) {
      return {success: response.ok, statusCode: response.statusCode, message: response.message}
    }
    else
      throw new Error(response.status + response.error) 
  },

  addAdminToClub: async function(clubId, playerId) {
    const requestOptions = authAPI.getRequestOptions('POST')
    const response = await fetch(`${clubUrl}add_admin_to_club/${clubId}/${playerId}`, requestOptions)
    if (response.ok) {
      return {success: response.ok, statusCode: response.statusCode, message: response.message}
    }
    else
      throw new Error(response.status + response.error) 
  },

}

export default clubAPI;