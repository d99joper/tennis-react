import { authAPI } from "."
import apiUrl from "config"

const requestUrl = apiUrl + 'requests/'

const requestAPI = {
  /* API calls */
  createJoinRequest: async function (type, id) {
    const requestOptions = authAPI.getRequestOptions('POST');
    const response = await fetch(`${requestUrl}join/${type}/${id}`, requestOptions);
    if (response.ok) {
      const data = await response.json();
      return { success: response.ok, statusCode: response.statusCode, data: data }
    }
    else
      return { success: response.ok, statusCode: response.statusCode, statusMessage: 'Error: Failed join request' }
  },

  getRequestStatusForUser: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET');
    const response = await fetch(`${requestUrl}${id}/get-status-for-user`, requestOptions)
    if (response.ok) {
      const data = await response.json();
      return { success: response.ok, statusCode: response.statusCode, status: data.status }
    }
    else
      return { success: response.ok, statusCode: response.statusCode, statusMessage: 'Error: Failed join request' }
  },

  processRequest: async function (id, approve) {
    console.log('approve', approve)
    const requestOptions = authAPI.getRequestOptions('POST')
    const response = await fetch(`${requestUrl}process/${id}/${approve}`, requestOptions)
    if (response.ok) {
      const data = await response.json()
      return { success: response.ok, statusCode: response.statusCode, data: data }
    }
    else
      return { success: response.ok, statusCode: response.statusCode, statusMessage: 'Error: Failed to get club' }
  },

  getPendingRequests: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET') 
    const response = await fetch(`${requestUrl}${id}/pending?include_sender=true`, requestOptions);
    if (response.ok) {
      const data = await response.json()
      return { success: response.ok, statusCode: response.statusCode, data: data }
    }
    else
      return { success: response.ok, statusCode: response.statusCode, statusMessage: 'Error: Failed to get pending request' }
  }

}

export default requestAPI