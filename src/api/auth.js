const authUrl = 'https://mytennis-space.uw.r.appspot.com/rest-auth/'

const authAPI = {
	getUser: async function (key) {
		console.log(key)
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + key
			},
			//body: JSON.stringify(player)
		}
		let response = await fetch(authUrl+'user/', requestOptions)

		if (response.ok) {
			const user = await response.json()
			return user
		}
		else
			return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'No Player Found' }
		//this.playerDummyData.find((x) => x.id === id)//
	},

	login: async function(username, pwd) {
		let res = fetch(authUrl+"login/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: 'tennis5', email: 'jonas@zooark.com' })
    })
		setUser(res)
	},
// merge accounts, use google/connect/ send token
	googleLogin: async function(accesstoken) {
    let res = await fetch(authUrl+"google/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer my-token'
      },
      body: JSON.stringify({ access_token: accesstoken })
    })
    setUser(res)
    return await res.status;
  },

	getToken: function() {
		const userId = localStorage.getItem('user_id')
		return localStorage.getItem('bearer_'+userId)
	}

}

async function setUser(res) {
	const data = await res.json()
    console.log(data.key);
    const user = await authAPI.getUser(data.key)
    
    console.log(user)
    //playerAPI.getPlayer('21c841d6-bb21-4766-bf4f-b204cc53dde7')

    localStorage.setItem('user_id', user.pk)
    localStorage.setItem('username', user.username)
    localStorage.setItem('useremail', user.email)
    localStorage.setItem('bearer_'+user.pk, data.key)
}

export default authAPI