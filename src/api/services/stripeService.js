import apiUrl from 'config';
import { authAPI } from '.';

const stripeAPI = {
  // ============================================
  // Stripe Connect (Clubs)
  // ============================================

  /**
   * Create Stripe Connect account for a club (onboarding)
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  createClubConnectAccount: async (clubId) => {
    try {
      const returnUrl = `${window.location.origin}/stripe/connect/return`;
      const refreshUrl = `${window.location.origin}/clubs/${clubId}?tab=admin`;
      const requestOptions = authAPI.getRequestOptions('POST', {
        return_url: returnUrl,
        refresh_url: refreshUrl,
      });
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/connect/create`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error creating club Connect account', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Get club's Stripe Connect account status
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  getClubConnectStatus: async (clubId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/connect/status`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error fetching club Connect status', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Refresh/regenerate club's onboarding link
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  refreshClubOnboardingLink: async (clubId, returnUrl, refreshUrl) => {
    try {
      const requestOptions = authAPI.getRequestOptions('POST', {
        return_url: returnUrl,
        refresh_url: refreshUrl,
      });
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/connect/refresh`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error refreshing onboarding link', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Get OAuth link to connect an existing Stripe Standard account
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: { oauth_url: string } }}
   */
  getOAuthLink: async (clubId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/connect/oauth-link`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error fetching OAuth link', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Complete OAuth flow by exchanging the authorization code
   * @param {string} clubId
   * @param {string} code - Authorization code from Stripe OAuth redirect
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  completeOAuthCallback: async (clubId, code) => {
    try {
      const requestOptions = authAPI.getRequestOptions('POST', { code });
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/connect/oauth-callback`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error completing OAuth callback', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Get Stripe dashboard link for club (Express login link or Standard dashboard URL)
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  getClubDashboardLink: async (clubId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/dashboard`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error fetching club dashboard link', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Disconnect (archive) a club's Stripe Connect account
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  disconnectClubAccount: async (clubId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('POST');
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/connect/disconnect`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error disconnecting club Stripe account', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * List all Stripe Connect accounts (active and inactive) for a club
   * @param {string} clubId
   * @returns {{ success: boolean, statusCode: number, data: Array }}
   */
  listClubAccounts: async (clubId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/accounts`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error listing club Stripe accounts', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Switch to a different Stripe Connect account
   * @param {string} clubId
   * @param {string} stripeAccountId - The Stripe account ID to activate
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  switchClubAccount: async (clubId, stripeAccountId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('POST', {
        stripe_account_id: stripeAccountId,
      });
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/accounts/switch`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error switching club Stripe account', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Permanently remove a Stripe Connect account record from the club
   * @param {string} clubId
   * @param {string} stripeAccountId - The Stripe account ID to delete
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  deleteClubAccount: async (clubId, stripeAccountId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('DELETE', {
        stripe_account_id: stripeAccountId,
      });
      const response = await fetch(`${apiUrl}stripe/clubs/${clubId}/accounts/delete`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error deleting club Stripe account', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  // ============================================
  // Marketplace Payments
  // ============================================

  /**
   * Create a payment intent for a billable item (e.g., event registration fee)
   * @param {string} billableItemId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  createPaymentIntent: async (billableItemId) => {
    const idempotencyKey = crypto.randomUUID();
    try {
      const requestOptions = authAPI.getRequestOptions('POST');
      requestOptions.headers['Idempotency-Key'] = idempotencyKey;
      const response = await fetch(`${apiUrl}stripe/billable-items/${billableItemId}/payment`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error creating payment intent', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Get the status of a specific payment by payment ID
   * @param {string} paymentId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  getPaymentStatus: async (paymentId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}stripe/payments/${paymentId}/status`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error fetching payment status', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Check whether the current user has paid for a billable item.
   * @param {string} billableItemId
   * @returns {{ success: boolean, statusCode: number, data: { has_payment: boolean, status?: string } }}
   *   status (when has_payment=true): 'succeeded' | 'pending' | 'failed' | 'refunded'
   */
  getBillableItemPaymentStatus: async (billableItemId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('GET');
      const response = await fetch(`${apiUrl}stripe/billable-items/${billableItemId}/payment-status`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error fetching billable item payment status', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Refund a marketplace payment
   * @param {string} paymentId
   * @param {number} amount - Amount to refund in cents (optional, defaults to full refund)
   * @param {string} reason - Reason for refund (optional)
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  refundPayment: async (paymentId, amount = null, reason = null) => {
    try {
      const body = {};
      if (amount !== null) body.amount = amount;
      if (reason) body.reason = reason;

      const requestOptions = authAPI.getRequestOptions('POST', body);
      const response = await fetch(`${apiUrl}stripe/payments/${paymentId}/refund`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error refunding payment', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  // ============================================
  // Subscriptions
  // ============================================

  /**
   * Create a subscription payment intent for a player
   * @param {string} plan - Plan identifier
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  createSubscription: async (plan) => {
    try {
      const requestOptions = authAPI.getRequestOptions('POST', { plan });
      const response = await fetch(`${apiUrl}stripe/subscriptions/create`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error creating subscription', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },

  /**
   * Cancel a player's subscription
   * @param {string} subscriptionId
   * @returns {{ success: boolean, statusCode: number, data: object }}
   */
  cancelSubscription: async (subscriptionId) => {
    try {
      const requestOptions = authAPI.getRequestOptions('POST', { subscription_id: subscriptionId });
      const response = await fetch(`${apiUrl}stripe/subscriptions/cancel`, requestOptions);
      const data = await response.json();
      return { success: response.ok, statusCode: response.status, data };
    } catch (err) {
      console.error('Error canceling subscription', err);
      return { success: false, statusCode: 500, data: { error: err.message } };
    }
  },
};

export default stripeAPI;