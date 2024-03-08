import apiUrl from "config"
import { authAPI } from "."
import { helpers } from "helpers"

const courtsUrl = apiUrl + 'courts/'

const courtAPI = {
  getCourt: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetch(courtsUrl + id, requestOptions)

    if (response.ok) {
      const data = await response.json()
      return data
    }
    else
      return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'No Court Found' }
  },

  getCourts: async function(filter) {
    console.log(filter)
    const url = new URL(courtsUrl)
    url.search = helpers.parseFilter(filter)
    // const params = new URLSearchParams(filter)
    // console.log("params: ",params)
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(url,requestOptions)
    
    if (response.ok) {
      const data = await response.json()
      return data
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get courts' }
  },

  createCourt: async function(court) {
    const requestOptions = authAPI.getRequestOptions('POST', court)

    const response = await fetch(courtsUrl + 'create', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create court' }
  }
}

export default courtAPI