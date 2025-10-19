import apiUrl from 'config'
import {authAPI} from '.'
import { fetchWithRetry } from 'api/fetchWithRetry';

const divisionsUrl = apiUrl + 'divisions/'

const divisionAPI = {
addDivision: async function (event_id, division_name, division_type, match_type) {
    const requestOptions = authAPI.getRequestOptions('POST', { event_id: event_id, name: division_name, type: division_type, match_type: match_type });
    const response = await fetchWithRetry(`${divisionsUrl}create`, requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to create division')
  },

  getDivisionParticipants: async function (division_id) {
    const requestOptions = authAPI.getRequestOptions('GET');
    const response = await fetchWithRetry(`${divisionsUrl}${division_id}/participants`, requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to fetchWithRetry division participants')
  },

  addDivisionPlayers: async function (division_id, participant_ids) {
    const requestOptions = authAPI.getRequestOptions('POST', { participant_ids: participant_ids });
    const response = await fetchWithRetry(`${divisionsUrl}${division_id}/assign-participants`, requestOptions) 
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(response.status + ': Failed to add participants to division')
    }
  },
  removeDivisionPlayers: async function (division_id, participant_ids) {
    const requestOptions = authAPI.getRequestOptions('DELETE', { participant_ids: participant_ids });
    const response = await fetchWithRetry(`${divisionsUrl}${division_id}/remove-participants`, requestOptions)    

    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(response.status + ': Failed to remove participants from division')
    }
  }
}

export default divisionAPI