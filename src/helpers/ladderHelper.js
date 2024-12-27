import { useEffect, useState } from 'react'
import { ladderAPI, playerAPI } from 'api/services'

const ladderHelper = {

	useLadderPlayersData: function (ladderId, searchInput) {
		const [data, setData] = useState({ ladder: {}, players: [] })

		useEffect(() => {
			const fetchData = async () => {
				let retVal
				let players = []
				let ladder = []

				if (ladderId !== 0) {
					ladder = await ladderAPI.getLadder(ladderId)
					players = ladder.standings.map((elem) => elem.player)
				}
				else {
					ladder = {}
					players = []//(await playerAPI.getPlayers(searchInput)).players
				}
				
				players = players
					.filter((p) => {
						return p.name.toLowerCase().includes(searchInput.toLowerCase())
					})
					.sort((p1, p2) => {
						const nameA = p1.name.toLowerCase()
						const nameB = p2.name.toLowerCase()
						if(nameA < nameB) return -1
						if(nameA > nameB) return 1
						return 0
					})
				retVal = { ladder: ladder, players: players }
				setData(retVal)
			}
				console.log(ladderId)
			
			fetchData()

		}, [ladderId, searchInput])
		return data
	},

	usePlayerLadders: function (playerId) {
		const [data, setData] = useState([])

		useEffect(() => {
			const fetchData = async () => {
				const ladders = await ladderHelper.GetPlayerLadders(playerId)
				setData(ladders)
			}
			fetchData()
		}, [playerId])
		//console.log(data)
		return data
	},

	IsPlayerInLadder: function (playerId, standings) {
		try {
			let isInLadder = false
			const player = standings.find((x) => x.player.id === playerId)

			if (player)
				isInLadder = true

			return isInLadder
		}
		catch {
			throw new Error('Failed on IsPlayerInLadder')
		}
	},

	FindNearByLadders: async function (location, radius = 30, excludeList = ['-1']) {
		// try {
		// 	console.log(excludeList)
		// 	const result = await API.graphql({
		// 		query: qfindNearbyLadders,
		// 		variables: {
		// 			input: {
		// 				byLocation: {
		// 					point: {
		// 						lon: location.lng,
		// 						lat: location.lat
		// 					},
		// 					radius: radius
		// 				}
		// 			},
		// 			limit: 10
		// 		}
		// 	})
		// 	const ladders = result.data.findNearbyLadders.items
		// 	const filteredLadders = ladders.filter(x => !excludeList.includes(x.id))

		// 	return { ladders: filteredLadders, count: result.data.findNearbyLadders.total }
		// }
		// catch (e) {
		// 	console.log(e)
		// 	return { error: e }
		// }
	},


	// setDefaultPlayerSettings: function (player, playerTemplate) {
	// 	player.wins ??= 0
	// 	player.losses ??= 0
	// 	userHelper.SetPlayerImage(playerTemplate)

	// 	if (playerTemplate.image)
	// 		player.image = playerTemplate.image
	// },

}

export default ladderHelper;