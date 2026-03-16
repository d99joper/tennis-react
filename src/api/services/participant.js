import { authAPI } from '.'
import apiUrl from 'config'

const participantUrl = apiUrl + 'participants/'

const participantAPI = {
  /**
   * Create a standalone Participant entity (doubles pair / team)
   * without immediately linking it to an event or division.
   * Returns the participant so its id can be attached to a join request,
   * letting the organizer see the full pair/team when reviewing.
   *
   * @param {string} type - 'player' | 'doubles' | 'team'
   * @param {number[]} playerIds - array of player user IDs
   * @returns {{ success: boolean, data: { id, type, ... } }}
   */
  create: async function (type, playerIds) {
    const body = { type, player_ids: playerIds }
    const requestOptions = authAPI.getRequestOptions('POST', body)
    const response = await fetch(participantUrl+'create', requestOptions)
    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    } else {
      const err = await response.json().catch(() => ({}))
      return { success: false, statusCode: response.status, error: err?.error || 'Failed to create participant' }
    }
  }
}

export default participantAPI
