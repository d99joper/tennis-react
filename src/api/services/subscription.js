import apiUrl from "config"
import { authAPI } from "."
import { fetchWithRetry } from "api/fetchWithRetry"

const subscriptionsUrl = apiUrl + 'subscriptions/'

const subscriptionAPI = {
  getSubscription: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetchWithRetry(subscriptionsUrl + id, requestOptions)

    if (response.ok) {
      const data = await response.json()
      return data
    }
    else
      return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'No subscription Found' }
  },

  getSubscriptions: async function() {
    
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetchWithRetry(subscriptionsUrl, requestOptions)
    
    if (response.ok) {
      return await response.json()
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get subscriptions' }
  },

  getPlayerSubscription: async function() {
    const requestOptions = authAPI.getRequestOptions('GET')

    const response = await fetchWithRetry(subscriptionsUrl + 'get-for-player', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get player subscription' }
  },

  getPlayerEventCount: async function() {
    const requestOptions = authAPI.getRequestOptions('GET')
    try {
      const response = await fetch(subscriptionsUrl + 'event-count', requestOptions)
      if (response.ok)
        return await response.json()
      else
        return { event_count: 0 }
    } catch {
      return { event_count: 0 }
    }
  },

  getSubscriptionPortalUrl: async function() {
    const requestOptions = authAPI.getRequestOptions('POST')
    try {
      const response = await fetch(subscriptionsUrl + 'customer-portal', requestOptions)
      if (response.ok)
        return await response.json()
      else
        return { success: false, error: 'Failed to get portal URL' }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
}

export default subscriptionAPI