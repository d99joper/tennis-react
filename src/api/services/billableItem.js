import apiUrl from "config"
import { authAPI } from "."
import { fetchWithRetry } from "api/fetchWithRetry"

const billableItemUrl = apiUrl + 'billable-items/'

const billableItemAPI = {

  getBillableItem: async function (eventId) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetchWithRetry(`${billableItemUrl}event/${eventId}`, requestOptions)
    if (response.ok)
      return await response.json()
    else
      return null
  },

  createBillableItem: async function (eventId, price, currency = 'usd') {
    const requestOptions = authAPI.getRequestOptions('POST', { event_id: eventId, price, currency })
    const response = await fetchWithRetry(`${billableItemUrl}create`, requestOptions)
    if (response.ok)
      return await response.json()
    else
      throw new Error(`Failed to create billable item: ${response.status} ${response.statusText}`)
  },

  createCheckoutSession: async function (eventId) {
    const requestOptions = authAPI.getRequestOptions('POST', { event_id: eventId })
    const response = await fetchWithRetry(`${billableItemUrl}checkout`, requestOptions)
    if (response.ok)
      return await response.json()
    else
      throw new Error(`Failed to create checkout session: ${response.status} ${response.statusText}`)
  },

}

export default billableItemAPI
