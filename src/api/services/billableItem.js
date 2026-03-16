import apiUrl from 'config';
import { authAPI } from '.';

const billableItemAPI = {
  /**
   * Create a billable item for an event
   * @param {object} data - { event_id, amount, description, currency, refund_policy }
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  createBillableItem: async (data) => {
    try {
      const requestOptions = authAPI.getRequestOptions('POST', data);
      const response = await fetch(`${apiUrl}marketplace/billable-items/create`, requestOptions);
      const result = await response.json();
      return { success: response.ok, statusCode: response.status, data: result };
    } catch (err) {
      console.error('Error creating billable item', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Get billable item by ID
   * @param {string} billableItemId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  getBillableItem: async (billableItemId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}marketplace/billable-items/${billableItemId}`, requestOptions);
      const result = await response.json();
      return { success: response.ok, statusCode: response.status, data: result };
    } catch (err) {
      console.error('Error fetching billable item', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Update billable item
   * @param {string} billableItemId
   * @param {object} data - Fields to update
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  updateBillableItem: async (billableItemId, data) => {
    try {
      const requestOptions = authAPI.getRequestOptions('PATCH', data);
      const response = await fetch(`${apiUrl}marketplace/billable-items/${billableItemId}/update`, requestOptions);
      const result = await response.json();
      return { success: response.ok, statusCode: response.status, data: result };
    } catch (err) {
      console.error('Error updating billable item', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Delete billable item
   * @param {string} billableItemId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  deleteBillableItem: async (billableItemId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('DELETE');
      const response = await fetch(`${apiUrl}marketplace/billable-items/${billableItemId}/delete`, requestOptions);
      return { success: response.ok, statusCode: response.status, data: {} };
    } catch (err) {
      console.error('Error deleting billable item', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Get all billable items for an event
   * @param {string} eventId
   * @returns {{ success: boolean, statusCode: number, data: array }}
   */
  getEventBillableItems: async (eventId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}marketplace/events/${eventId}/billable-items`, requestOptions);
      const result = await response.json();
      return { success: response.ok, statusCode: response.status, data: result.data || [] };
    } catch (err) {
      console.error('Error fetching event billable items', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Get all billable items for a club
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: array }}
   */
  getClubBillableItems: async (clubId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}marketplace/clubs/${clubId}/billable-items`, requestOptions);
      const result = await response.json();
      return { success: response.ok, statusCode: response.status, data: result };
    } catch (err) {
      console.error('Error fetching club billable items', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },
};

export default billableItemAPI;
