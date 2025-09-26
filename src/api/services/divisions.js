import apiUrl from 'config'
import {authAPI} from '.'

const divisionsUrl = apiUrl + 'divisions/'

const divisionAPI = {
addDivision: async function (event_id, division_name, division_type, match_type) {
    const requestOptions = authAPI.getRequestOptions('POST', { event_id: event_id, name: division_name, type: division_type, match_type: match_type });
    const response = await fetch(`${divisionsUrl}create`, requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to create division')
  },
  
}


export default divisionAPI