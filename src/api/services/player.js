import apiUrl from "config"
import { authAPI } from "."
import { helpers } from "helpers"

const playersUrl = apiUrl + 'players/'

const playerAPI = {

  getPlayer: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetch(playersUrl + id, requestOptions)

    if (response.ok) {
      const player = await response.json()
      //await this.setPlayerImage(player)
      return player
    }
    else
      return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'No Player Found' }
  },

  getPlayerUTR: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetch(playersUrl + id + '/utr', requestOptions)

    if (response.ok) {
      const utr = await response.json()
      return utr
    }
    else
      return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'Failed to get utr' }
  },

  getPlayerByFilter: async function (username) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetch(`${playersUrl}?stats&filter=${username}`, requestOptions)

    if (response.ok) {
      const data = await response.json()
      if (data.total_count > 0) {
        let player = data.players[0]
        //this.setPlayerImage(player)
        return await player
      }
      return { error: 'No players found' }
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'No players found' }
  },

  getPlayers: async function (filter) {
    //console.log(filter)
    const url = new URL(playersUrl)
    const params = new URLSearchParams(filter) //helpers.parseFilter(filter)
    //console.log("params: ",params)
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(url + '?' + params, requestOptions)//`${playersUrl}?filter=${filter}`, requestOptions)
    if (response.ok) {
      const data = await response.json()
      // await data.players.forEach(p => {
      //   this.setPlayerImage(p)
      // });
      return data
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get player' }
  },

  // ids as an array, since you can search for doubles pairs
  getGreatestRivals: async function (ids, type) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(`${playersUrl + ids[0]}/rivals`, requestOptions)
    if (response.ok) {
      let data = await response.json()
      //await data.rivals.forEach(r => this.setPlayerImage(r.player))
      return data
    }
    else
      throw new Error('Couldn\'t get player rivals. ')
  },

  getPlayerH2H: async function (player1, player2) {
    const requestOptions = authAPI.getRequestOptions('GET')
    const response = await fetch(`${playersUrl + player1.id}/h2h?player2=${player2.id}`, requestOptions)
    if (response.ok) {
      let data = await response.json()
      return data
    }
    else
      throw new Error('Couldn\'t get players\' h2h. ')

  },

  // I don't really care what comes back, just something to verify success or failure
  createPlayer: async function (player) {
    const requestOptions = authAPI.getRequestOptions('POST', player, true)

    const response = await fetch(playersUrl + 'create', requestOptions)
    console.log(response)
    const jsonResp = await response.json()
    if (response.ok)
      return await jsonResp
    else
      return { statusCode: response.status, error: 'An error occurred', ...jsonResp }
  },
  
  checkGoogleUser: async function(userData) {
    const requestOptions = authAPI.getRequestOptions('POST', userData, true)
    // temp test solution
    //return {is_new_user: true, user_id: '123'}
		const response = await fetch(playersUrl + 'google-user-check/', requestOptions)
		if (response.ok) {
			const data = await response.json()
			console.log(data)
			return data
		}
		else
			return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'Failed to check user' }
  },

	checkOrCreateUser: async function(userData) {
		const requestOptions = authAPI.getRequestOptions('POST', userData, true)
    // temp test solution
    //return {is_new_user: true, user_id: '123'}
		const response = await fetch(playersUrl + 'check-or-create/', requestOptions)
		if (response.ok) {
			const data = await response.json()
			console.log(data)
			return data
		}
		else
			return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'Failed to check user' }
	},

  claimPlayer: async function (id, newPlayer, newPassword) {
    // only an admin account can run this function claim a player
    const requestOptions = authAPI.getRequestOptions(
      'POST', 
      {
        player_id: id, 
        new_player: newPlayer, 
        new_password: newPassword
      }, 
      true
    )
    //console.log(requestOptions)
    const response = await fetch(playersUrl + id + '/claim', requestOptions)

    return { statusCode: response.statusCode, statusMessage: response.statusMessage }
  },

  sendVerificationEmail: async function (id) {
    const requestOptions = authAPI.getRequestOptions('GET')
    
    const response = await fetch(playersUrl + id + '/resend_verification', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Couldn\'t send email.' }
  },

  // partial player as input. Only provided fields get updated
  updatePlayer: async function (player) {
    const requestOptions = authAPI.getRequestOptions('PATCH', player)

    const response = await fetch(playersUrl + player.id + '/update', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to update player.' }
  },

  updatePlayerImage: async function (playerId, image) {
    const requestOptions = authAPI.getRequestOptionsFormData('PATCH', image)

    const response = await fetch(playersUrl + playerId + '/update/image', requestOptions)
    if (response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to update player.' }
  },

  initiateMerge: async function (playerId, mergeId) {
    const requestOptions = authAPI.getRequestOptions('POST', { merge_id: mergeId })

    const response = await fetch(playersUrl + playerId + '/initiate_merge', requestOptions)
    console.log(response)
    if (response.ok)
      return { statusCode: response.status }
    else
      return { statusCode: response.status, error: 'An error occurred' }
  },

  findPotentialMergers: async function (playerId) {
    const requestOptions = authAPI.getRequestOptions('GET')
    let response = await fetch(playersUrl + playerId, requestOptions)
    if (response.ok) {
      let data = await response.json()
      return data
    }
    else
      throw new Error('Couldn\'t find mergeable players. ')
  },

  mergePlayers: async function (mainPlayerId, mergePlayerId, token) {
    const requestOptions = authAPI.getRequestOptions('PATCH'
      , {
        merge_id: mergePlayerId,
        token: token
      })
    let response = await fetch(playersUrl + mainPlayerId + '/merge', requestOptions)
    console.log(response)
    if (response.ok) {
      let data = await response.json()
      console.log(data)
      if (data.status === 'success') {
        return data
      }
      else
        throw new Error('failed to merge players')
    }
  },

  setPlayerName: function (player, lastnameOnly) {
    let name = player.name
    if (lastnameOnly)
      name = name.split(' ').slice(-1)[0]

    return name + (player.verified ? "" : "*")
  }
}

export default playerAPI