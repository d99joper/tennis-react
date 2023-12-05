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
		return handleLogin(authUrl + "login/", { email: username, password: password })
	},

	// todo: merge accounts, send token to google/connect/ 

	googleLogin: async function (accesstoken) {
		return handleLogin(authUrl + "google/", { access_token: accesstoken })
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
				name: localStorage.getItem('user_name')
			}
		}
		return user
	},

	// gets the request options for API calls
	getRequestOptions: function (method, body) {
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

			// create and trigger a custom event for logging in
			const myEvent = new CustomEvent('login', { detail: user })
			window.dispatchEvent(myEvent)
			
			// return the newly logged in user
			return user
		}
		else
			throw new Error('Failed to login')
	}
	catch (e) {
		throw e
	}
}

export default authAPI