import apiUrl from "config"
import { authAPI } from "."
import { fetchWithRetry } from "api/fetchWithRetry"

const subscriptionsUrl = apiUrl + 'subscriptions/'

const subscriptionAPI = {
  /**
   * List available subscription plans & prices (public)
   * GET /subscriptions/
   */
  getPlans: async function () {
    try {
      const response = await fetch(subscriptionsUrl)
      if (response.ok)
        return await response.json()
      else
        return { statusCode: response.status, statusMessage: 'Error: Failed to get plans' }
    } catch (err) {
      console.error('Error fetching plans:', err)
      return { statusCode: 500, statusMessage: err.message }
    }
  },

  /**
   * Get current player's subscription state
   * GET /subscriptions/get-for-player
   */
  getPlayerSubscription: async function () {
    const requestOptions = authAPI.getRequestOptions('GET')
    try {
      const response = await fetchWithRetry(subscriptionsUrl + 'get-for-player', requestOptions)
      if (response.ok) {
        const result = await response.json()
        return result.data !== undefined ? result.data : result
      } else {
        return null
      }
    } catch (err) {
      console.error('Error fetching player subscription:', err)
      return null
    }
  },

  /**
   * Get player's lifetime event count (for free tier gating)
   * GET /subscriptions/event-count
   */
  getPlayerEventCount: async function () {
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
}

export default subscriptionAPI