import apiUrl from "config"
import { playerAPI } from "./services"
import { requestNotificationPermission } from "../firebase/requestNotificationPermission";

const authUrl = apiUrl + 'rest-auth/'

const authAPI = {
	getUser: async function () {
		const key = getAttribute('tempkey') || this.getToken();
		console.log(key)
		const requestOptions = {
			method: 'GET',
			credentials: 'include', // Ensure cookies are included
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + key
			}
		}
		let response = await fetch(authUrl + 'user/', requestOptions)
		if (response.ok) {
			const user = await response.json()
			return user
		}
		else
			return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'Failed to get user' }
	},

	register: async function (username, password, firstName, lastName, location) {
		try {
			const body = {
				email: username,
				username: username,
				password: password,
				first_name: firstName,
				last_name: lastName,
				...location ? {
					location: location.location,
					lat: location.lat,
					lng: location.lng
				} : null,
			}
			let response = await fetch(apiUrl + "register-user/", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})

			if (response.ok) {
				return //await this.login(username, password)
			}
			else {
				const errorMessages = await response.json()
				return errorMessages
			}
		} catch (error) {
			throw new Error('Failed to create user')
		}
	},

	verifyEmail: async function (userid, key) {
		try {
			const body = { key: key, userid: userid }
			let response = await fetch(apiUrl + "confirm-user/" + userid + "/" + key, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (response.ok) {
				const data = await response.json()
				return data
			}
			else {
				const errorMessages = await response.json()
				return errorMessages
			}
		}
		catch (e) {
			console.log('Failed to verify email')
			return { 'errors': e.message }
		}
	},

	login: async function (username, password) {
		try {
			return handleLogin(authUrl + "login/", { email: username, username: username, password: password })
		}
		catch (e) {
			return e
		}
	},

	// todo: merge accounts, send token to google/connect/ 

	googleLogin: async function (accesstoken) {
		// console.log(accesstoken)
		// return
		//return handleLogin(authUrl + "google/", { code: accesstoken, redirect_uri: 'postmessage' })
		return handleLogin(authUrl + "google-manual/", { code: accesstoken })
	},

	signOut: function () {
		// clear the local storage
		localStorage.clear()

		// create and trigger a custom event for logging out
		const myEvent = new CustomEvent('logout', { detail: "User has been logged out" })
		window.dispatchEvent(myEvent)
	},

	getToken: function () {
		const userId = localStorage.getItem('user_id')
		return localStorage.getItem('bearer_' + userId)
	},

	getCurrentUser: function () {
		let user
		if (localStorage.getItem('user_id')) {
			user = {
				id: localStorage.getItem('user_id'),
				username: localStorage.getItem('username'),
				email: localStorage.getItem('user_email'),
				name: localStorage.getItem('user_name'),
				merged_with: localStorage.getItem('merged_with')
			}
		}
		return user
	},

	// gets the request options for API calls
	getRequestOptions: function (method, body, admin = false) {
		const bearer = admin ? process.env.REACT_APP_ADMIN_TOKEN : this.getToken() || ''
		const jsonBody = body ? JSON.stringify(body) : null
		//console.log(bearer, process.env.REACT_APP_ADMIN_TOKEN)
		const headers = {
			'Content-Type': 'application/json',
		};

		if (bearer) {
			headers['Authorization'] = 'Token ' + bearer;
		}
		return {
			method: method,
			credentials: 'include', // Ensure cookies are included
			headers,
			body: jsonBody
		}
	},

	getRequestOptionsFormData: function (method, file) {
		const bearer = this.getToken()
		const formData = new FormData()
		formData.append('image', file)
		let options = {
			method: method,
			headers: {
				'Authorization': 'Token ' + bearer
			},
			body: formData
		}
		return options
	},

}

// Sets the user information in localStorage
async function setUser(user, key) {

	// store the user information and the key
	localStorage.setItem('user_id', user.pk)
	localStorage.setItem('username', user.username)
	localStorage.setItem('user_email', user.email)
	localStorage.setItem('bearer_' + user.pk, key)
	localStorage.setItem('user_name', user.first_name + ' ' + user.last_name)
	localStorage.setItem('merged_into', user.merged_into)
}

function setAttribute(key, value) {
	localStorage.setItem(key, value)
}

function getAttribute(key) {
	return localStorage.getItem(key)
}

// handles the login logic 
async function handleLogin(url, body) {
	try {
		// since it's a new login, clear the localStorage
		localStorage.clear()

		// post the login request
		let response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		// if the login was successful
		if (response.ok) {
			const retval = await response.json()
			// Get the user 
			setAttribute('tempkey', retval.key || retval.token);
			const user = await authAPI.getUser()//objKey.key)
			//set the user info in localStorage
			setUser(user, retval.key || retval.token)
			localStorage.removeItem('tempkey');
			// create and trigger a custom event for logging in
			const myEvent = new CustomEvent('login', { detail: user })
			window.dispatchEvent(myEvent)

			// now get the full player details
			let player;
			if (retval.player) {
				player = retval.player
				const nameParts = (player.name || '').trim().split(' ');
				player.firstName = nameParts[0] || '';
				player.lastName = nameParts.slice(1).join(' ') || '';
				player.created = retval.created
			}
			else
				player = await playerAPI.getPlayer(user.pk, true)
			//if the player has been merged, overwrite the info in localStorage
			// if(player.id !== user.pk) {
			// 	setAttribute('user_email', player.email)
			// 	setAttribute('user_id', player.id)
			// 	setAttribute('username', player.username)
			// 	setAttribute('user_name', player.name)
			//}
			setAttribute('user_image', player.image_urls?.thumbnail)

			// initialize the notifications
			requestNotificationPermission();

			// return the newly logged in user
			return player
		}
		else
			throw new Error('Failed to login')
	}
	catch (e) {
		throw e
	}
}

export default authAPI