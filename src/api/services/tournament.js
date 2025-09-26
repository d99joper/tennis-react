import { authAPI } from "."
import apiUrl from "config"

const tournamentsUrl = apiUrl + 'tournaments/'

const tournamentsAPI = {
  getTournament: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(tournamentsUrl + id, requestOptions) 
    if (response.ok)
      return await response.json()
    else
      throw new Error(response.error) 
  },

  generateBrackets: async function(tournament_id, participants) {  
    const requestOptions = authAPI.getRequestOptions('POST', {
      participants: participants
    })
    const response = await fetch(tournamentsUrl + tournament_id + '/generate-bracket/', requestOptions)
    if (response.ok)
      return await response.json()  
    else
      throw new Error(response.error) 
  },
}

export default tournamentsAPI;