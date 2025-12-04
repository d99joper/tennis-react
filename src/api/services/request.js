import { fetchWithRetry } from "api/fetchWithRetry";
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
    const response = await fetchWithRetry(`${requestUrl}${id}/get-status-for-user`, requestOptions)
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
    const response = await fetchWithRetry(`${requestUrl}${id}/pending?include_sender=true`, requestOptions);
    if (response.ok) {
      const data = await response.json()
      return { success: response.ok, statusCode: response.statusCode, data: data }
    }
    else
      return { success: response.ok, statusCode: response.statusCode, statusMessage: 'Error: Failed to get pending request' }
  },

  

  sendInvites: async function(object_id, content_type, recipients, message) {
    const requestOptions = authAPI.getRequestOptions('POST', {recipients: recipients, message:message});
    const response = await fetch(`${requestUrl}${object_id}/${content_type}/send-invites`, requestOptions)
    if (response.ok) {
      return await response.json()
    }
    else
      throw new Error(response.status + ': Failed to send invites event')
  }

}

export default requestAPI