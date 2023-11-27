import { enums } from "helpers"

const authUrl = 'https://mytennis-space.uw.r.appspot.com/rest-auth/'

const authAPI = {
	getUser: async function (key) {
		const requestOptions = {
			method: 'GET',
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

	login: async function (username, password) {
		handleLogin(authUrl + "login/", { email: username, password: password })
	},

	// todo: merge accounts, send token to google/connect/ 

	googleLogin: async function (accesstoken) {
		handleLogin(authUrl + "google/", { access_token: accesstoken })
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
				email: localStorage.getItem('user_email')
			}
		}
		return user
	},

	// gets the request options for API calls
	getRequestOptions: function(method, body) {
		const bearer = this.getToken()
		const jsonBody = body ? JSON.stringify(body) : null
		return {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + bearer
			},
			body: jsonBody
		}
	}

}

// Sets the user information in localStorage
async function setUser(user, key) {

	// store the user information and the key
	localStorage.setItem('user_id', user.pk)
	localStorage.setItem('username', user.username)
	localStorage.setItem('user_email', user.email)
	localStorage.setItem('bearer_' + user.pk, key)
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
			const objKey = await response.json()
			// Get the user 
			const user = await authAPI.getUser(objKey.key)
			//set the user info in localStorage
			setUser(user, objKey.key)
		}
		else
			throw new Error('Failed to login')
	}
	catch (e) {
		throw e
	}
}

export default authAPI