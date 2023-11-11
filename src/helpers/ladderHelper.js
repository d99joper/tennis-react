import { API } from 'aws-amplify'
import { findNearbyLadders, getStandings, standingsByLadder } from "../graphql/queries"
import {
	listLadderPlayersAsObjects,
	listOtherPlayersAsObjects,
	qCheckIfPlayerInLadder,
	qGetLadder,
	qGetMatchByLadderID,
	qGetStandingsDetails,
	qListLadders,
	qStandingsByLadder,
	qfindNearbyLadders
} from "../graphql/customQueries"
import {
	createLadder as createLadderMutation,
	updateLadder as updateLadderMutation,
	deleteLadder as deleteLadderMutation,
	createLadderPlayer,
	createStandings as createStandingsMutation,
	updateStandings,
	deleteStandings
} from "../graphql/mutations"
import { useEffect, useState } from 'react'
import { helpers, enums, userFunctions } from 'helpers'

const ladderHelper = {

	useLadderPlayersData: function (ladderId, searchInput) {
		const [data, setData] = useState({ ladder: {}, players: [] });
		useEffect(() => {
			const fetchData = async () => {
				let ladderPlayers
				if (ladderId == '-1') {
					//console.log("updated the search input on 'Other' ladder")
					// get all players, not only players attached to a ladder
					ladderPlayers = await ladderHelper.GetLadderPlayersForOther(searchInput)

				} else {
					//console.log("changed normal ladder")
					ladderPlayers = await ladderHelper.GetLadderPlayers(ladderId)
				}
				setData(ladderPlayers)
			}
			fetchData()

		}, [ladderId, searchInput])
		// useEffect(() => {
		//     const fetchData = async () => {
		//         setData(ladderPlayers)
		//     }

		//         fetchData()
		//     }

		// }, [searchInput])

		//console.log(data)
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

	UpdateLadder: async function (ladder) {
		try {

			let inputData = {
				name: ladder.name
			};

			const result = await API.graphql({
				query: updateLadderMutation,
				variables: {
					input: inputData,
					conditions: { id: ladder.id } // required
				}
			})

			console.log('Ladder updated', result.data.updateLadder)

			return result.data.updateLadder
		}
		catch (e) {
			console.log("failed to update ladder", e);
			return null
		}
	},

	IsPlayerInLadder: function (playerId, ladder) {
		try {
			let isInLadder = false
			console.log("IsPlayerInLadder", ladder.standings, playerId)
			const player = ladder.standings.find((x) => x.player.id === playerId)

			if (player)
				isInLadder = true

			console.log("IsPlayerInLadder", isInLadder)
			return isInLadder
		}
		catch { 
			throw new Error('Failed on IsPlayerInLadder')
		}
	},

	AddLadderPlayer: async function (playerId, ladderId) {
		try {
			// Create the ladder player connection
			await API.graphql({
				query: createLadderPlayer,
				variables: {
					input: {
						ladderID: ladderId,
						playerID: playerId
					}
				}
			})
			// update the ladder standings
			const standingsId = `cur#${ladderId}`
			const standings = await this.GetStandingsDetails(standingsId)

			let details = JSON.parse(standings.details)

			const maxPosition = details.length //Math.max(...details.map(o => o.position))
			const player = await userFunctions.getPlayer(playerId)
			let standing = {
				losses: 0,
				points: 0,
				position: maxPosition + 1,
				wins: 0,
				player: {
					id: playerId,
					name: player.name,
					...player.image ? { image: player.image } : null
				}
			}
			details.push(standing)

			API.graphql({
				query: updateStandings,
				variables: {
					input: {
						id: standingsId,
						details: JSON.stringify(details)
					}
				}
			})

			return true;
		}
		catch (e) {
			console.log(`failed to add player ${playerId} to ladder ${ladderId} `)
			throw e
		}
	},

	CreateLadder: async function (ladder) {

		const ladderId = helpers.getGUID()
		const standingsID = `cur#${ladderId}`

		const loadData = {
			id: ladderId,
			name: ladder.name,
			matchType: ladder.matchType,
			...ladder.description ? { description: ladder.description } : null,
			...ladder.level ? { level: ladder.level } : null,
			...ladder.id ? { id: ladder.id } : null,
			...ladder.location ? {
				location: ladder.location,
			} : null,
			...ladder.city ? { city: ladder.city } : null,
			...ladder.zip ? { zip: ladder.zip } : null,
			standingsID: `cur#${ladderId}`
		}

		//console.log(loadData);

		try {
			const result = await API.graphql({
				query: createLadderMutation,
				variables: { input: loadData },
			})
			console.log('New ladder created', result, ladderId)
			// next, create an empty standings
			this.CreateOrUpdateStandings(
				{
					id: standingsID,
					details: "[]",
					postedOn: new Date('1900-01-01').toISOString(),
					ladderID: ladderId
				},
				enums.STANDINGS_ID.Current,
				enums.OPERATION_TYPE.CREATE
			)

			return ladderId;
		}
		catch (e) {
			console.error("failed to create a ladder", e);
		}
	},

	AddPlayerToLadder: async function (player, ladder) {
		try {
			console.log('AddPlayerToLadder', player, ladder)
			const inputData = {
				playerID: player.id,
				ladderID: ladder.id
			}

			API.graphql({
				query: createLadderPlayer,
				variables: { input: inputData }
			}).then((result) => { console.log(result) })
		}
		catch (e) { console.log(e); }
	},

	GetLadder: async function (id, nextMatchesToken, limit = 10) {
		//console.log(id)
		try {
			const apiData = await API.graphql({
				query: qGetLadder,
				variables: { id: id, matchLimit: limit, nextMatchesToken: nextMatchesToken },
			});

			let ladderFromAPI = apiData.data.getLadder;
			ladderFromAPI.matches.items = ladderFromAPI.matches.items.map((elem, i) => {
				//console.log(elem)
				return { match: elem }
			})

			//const previousStandings = await this.GetAllLadderStandingsDates(id)

			let data = {
				...apiData.data.getLadder,
				matches: {
					nextToken: apiData.data.getLadder.matches.nextToken,
					matches: apiData.data.getLadder.matches.items
				},
				//previousStandings: previousStandings
			}

			return data//ladderFromAPI;
		}
		catch (e) {
			console.log("failed to get ladder", e);
			return;
		}
	},

	GetLadderPlayersForOther: async function (matchPhrase) {
		try {
			const filter = { ...matchPhrase && { name: { matchPhrasePrefix: matchPhrase } } }
			const limit = 15
			const query = listOtherPlayersAsObjects

			const apiData = await API.graphql({
				query: query,
				variables: { filter: filter, sort: { direction: 'asc', field: 'name' }, limit: limit }
			})
			console.log(apiData)
			const result = apiData.data.searchPlayers.items

			if (result.length > 0) {
				let retVal = { ladder: { name: 'Other *', id: -1 }, players: new Array(result.length) }
				result.forEach((item, i) => {
					retVal.players[i] = { id: item.id, name: item.name }
				})
				return retVal
			}
			return { ladder: { name: 'no ladder found', id: 0 }, players: [] }
		}
		catch (e) {
			console.log("GetLadderPlayersForOther", e)
			return
		}
	},

	FindNearByLadders: async function (location, radius = 30, excludeList = ['-1']) {
		try {
			console.log(excludeList)
			const result = await API.graphql({
				query: qfindNearbyLadders,
				variables: {
					input: {
						byLocation: {
							point: {
								lon: location.lng,
								lat: location.lat
							},
							radius: radius
						}
					},
					limit: 10
				}
			})
			const ladders = result.data.findNearbyLadders.items
			const filteredLadders = ladders.filter(x => !excludeList.includes(x.id))

			return { ladders: filteredLadders, count: result.data.findNearbyLadders.total }
		}
		catch (e) {
			console.log(e)
			return { error: e }
		}
	},

	GetLadderPlayers: async function (ladderId) {
		try {
			let filter = { ladderID: { eq: ladderId } }
			let query = listLadderPlayersAsObjects

			//console.log(filter)
			const apiData = await API.graphql({
				query: query,
				variables: { filter: filter }
			})

			const result = apiData.data.listLadderPlayers.items
			//console.log("GetLadderPlayers", result)


			if (result.length > 0) {
				let retVal = { ladder: { name: '', id: ladderId }, players: new Array(result.length) }
				retVal.ladder = result[0].ladder
				result.forEach((item, i) => {
					retVal.players[i] = item.player
				})
				return retVal
			}
			return { ladder: { name: 'no ladder found', id: 0 }, players: [] }
		}
		catch (e) {
			console.log("GetLadderPlayers", e)
			return
		}
	},

	GetLadders: async function () {
		const laddersAPI = await API.graphql({
			query: qListLadders
		})
		return laddersAPI.data.listLadders.items
	},

	GetPlayerLadders: async function (playerId = null) {
		try {
			const filter = { ...playerId && { playerID: { eq: playerId } } }
			const query = playerId ? listLadderPlayersAsObjects : qListLadders

			const apiData = await API.graphql({
				query: query,
				variables: { filter: filter }
			})

			if (!playerId) return apiData.data.listLadders.items

			const result = apiData.data.listLadderPlayers.items

			if (result.length > 0) {
				let ladders = new Array(result.length)
				result.forEach((item, i) => {
					ladders[i] = item.ladder
				})
				console.log("GetPlayerLadders", ladders)
				return ladders
			}
		}
		catch (e) {
			console.log("GetPlayerLadders", e)
			return
		}
	},

	CreateOrUpdateStandings: async function (standings, oldOrCur, createOrUpdate) {
		let standingId, query
		if (createOrUpdate === enums.OPERATION_TYPE.CREATE) {
			standingId = oldOrCur === enums.STANDINGS_ID.Current
				? `cur#${standings.ladderID}`
				: helpers.getGUID()
			query = createStandingsMutation
		}
		else {
			standingId = oldOrCur === enums.STANDINGS_ID.Current
				? `cur#${standings.ladderID}`
				: standings.id
			query = updateStandings
		}

		// stringify the details if they are not
		if (typeof standings.details !== "string")
			standings.details = JSON.stringify(standings.details)

		const apiData = await API.graphql({
			query: query,
			variables: {
				input: {
					id: standingId,
					details: standings.details,
					postedOn: standings.postedOn,
					ladderID: standings.ladderID
				}
			}
		})

		return createOrUpdate === enums.OPERATION_TYPE.CREATE
			? apiData.data.createStandings
			: apiData.data.updateStandings
	},

	CalculateStandings: async function (ladder, playedOn) {
		const ladderId = ladder.id

		try {
			function loserGamesCount(score) {
				const sets = score.split(/[\s,]+/)
				let gameCount = 0
				for (const set of sets) {
					const games = set.split('-')
					gameCount += parseInt(games[1].substring(0, games[1].indexOf('(') === -1 ? games[1].length : games[1].indexOf('(')))
				}
				return gameCount
			}
			function addPlayerToDetails(playerObj, player, details) {
				playerObj = {
					player: {
						id: player.id,
						name: player.name,
						...player.image ? { image: player.image } : null
					},
					wins: 0,
					losses: 0,
					points: 0,
					position: 0
				}
				details.push(playerObj)

				return playerObj
			}

			// 1. Get the ladder standing closest before the match date (playedOn). 
			//    If there's no earlier standings, use the current standings
			let standings = await GetStandingsForDate(ladderId, playedOn)
			console.log("standings", standings)
			let details = JSON.parse(standings.details)

			// 2. Get the all standings later than the new match date (they are now incorrect)
			//    However, don't delete them until everything else is done (step 6)
			const standingsToDelete = await this.GetAllLadderStandingsDates(ladderId, playedOn)

			// 3. Set the is initial standings flag
			let isInitialStandings = true

			// 4. Get all matches for the ladder since the match date, sorted by date
			let apiData = await API.graphql({
				query: qGetMatchByLadderID,
				variables: { ladderID: ladderId, playedOn: { ge: playedOn }, sortDirection: 'ASC' }
			})
			const matches = apiData.data.getMatchByLadderID.items
			console.log("matches", matches)

			// 5. For each match, update points, wins, and losses
			//await Promise.all(matches.map(async (match) => {
			for (const match of matches) {
				// 5a. Check if the match is played after the standings posted date
				const matchDate = new Date(match.playedOn)
				const standingsDate = new Date(standings.postedOn)
				if (standingsDate < matchDate) {
					if (isInitialStandings)
						isInitialStandings = false
					else {
						// Update the standings with the new details
						details.sort((a, b) => { return b.points - a.points })
						standings.details = details
						standings = await this.CreateOrUpdateStandings(standings, enums.STANDINGS_ID.Old, enums.OPERATION_TYPE.UPDATE)
					}

					// Create a new standings for the next match
					standings.postedOn = matchDate.toISOString()
					standings = await this.CreateOrUpdateStandings(standings, enums.STANDINGS_ID.Old, enums.OPERATION_TYPE.CREATE)
				}

				// 5b. find the players in the standings
				let winner = details.find(x => x.player.id === match.winnerID)
				// if the player isn't in the standings, add him/her
				if (!winner) winner = addPlayerToDetails(winner, match.winner, details)
				let loser = details.find(x => x.player.id === match.loserID)
				if (!loser) loser = addPlayerToDetails(loser, match.loser, details)
				this.setDefaultPlayerSettings(winner, match.winner)
				this.setDefaultPlayerSettings(loser, match.loser)

				console.log("winner", winner, "loser", loser)
				// 5c. update the players points
				if (winner.points > loser.points)
					winner.points += 20
				else
					winner.points = loser.points + 20

				loser.points += parseInt(loserGamesCount(match.score))

				// 5d. update win/loss number
				winner.wins++
				loser.losses++

				console.log("winner", winner, "loser", loser)
			}

			// 5e. sort the standings and update positions
			details.sort((a, b) => { return b.points - a.points })
			console.log("details after sort", details)

			// 6. Loop to delete all antiquated standings
			for (const s of standingsToDelete)
				await this.deleteStandings(s.id)

			// 7. Update the current standings to this standings
			const placeholderStandingsId = standings.id// Update the standings with the new details
			standings.details = details
			standings = await this.CreateOrUpdateStandings(standings, enums.STANDINGS_ID.Current, enums.OPERATION_TYPE.UPDATE)

			// 8. Delete the standings used to this point. It's been saved as the current standing
			await this.deleteStandings(placeholderStandingsId)

			// 9. Set the ladder standings and return the full ladder
			ladder.standings = standings
			return ladder

		}
		catch (e) {
			console.log("failed to update standings", e)
			throw e
		}
	},

	GetAllLadderStandingsDates: async function (ladderId, fromDate = null) {
		const apiData = await API.graphql({
			query: qStandingsByLadder,
			variables: {
				ladderID: ladderId,
				// make sure we never delete the current standings
				filter: { not: { id: { beginsWith: "cur#" } } },
				...fromDate ? { postedOn: { ge: fromDate } } : null
			}
		})

		return apiData.data.standingsByLadder.items
	},

	GetStandingsDetails: async function (id) {
		const apiData = await API.graphql({
			query: qGetStandingsDetails,
			variables: { id: id }
		})

		return apiData.data.getStandings
	},

	deleteStandings: async function (id) {
		try {
			await API.graphql({
				query: deleteStandings,
				variables: { input: { id } },
			});
			return true
		}
		catch (e) {
			console.log(`failed to delete standings: ${id}`, e);
			return false;
		}
	},

	deleteLadder: async function (id) {
		try {
			await API.graphql({
				query: deleteLadderMutation,
				variables: { input: { id } },
			});
			return true
		}
		catch (e) {
			console.log(`failed to delete ladder: ${id}`, e);
			return false;
		}
	},

	setDefaultPlayerSettings: function (player, playerTemplate) {
		player.wins ??= 0
		player.losses ??= 0
		userFunctions.SetPlayerImage(playerTemplate)

		if (playerTemplate.imageUrl)
			player.imageUrl = playerTemplate.imageUrl
	},

	GetStandingsForDate: async function (ladderId, playedOn, includeSameDate = false) {
		// get the standings at the specific playedOn date
		let dateComparison = { lt: playedOn }
		if (includeSameDate)
			dateComparison = { le: playedOn }

		let apiData = await API.graphql({
			query: standingsByLadder,
			variables: {
				ladderID: ladderId,
				postedOn: dateComparison,
				sortDirection: 'DESC',
				limit: 1
			}
		})

		// if there are no earlier standings, get the current standings instead
		if (!apiData.data.standingsByLadder.items.length) {
			return await ladderHelper.GetStandingsDetails(`cur#${ladderId}`)
		}

		return apiData.data.standingsByLadder.items[0]
	}

}

async function GetStandingsForDate(ladderId, playedOn) {
	// get the standings at the specific playedOn date
	let apiData = await API.graphql({
		query: standingsByLadder,
		variables: {
			ladderID: ladderId,
			postedOn: { lt: playedOn },
			sortDirection: 'DESC',
			limit: 1
		}
	})

	// if there are no earlier standings, get the current standings instead
	if (!apiData.data.standingsByLadder.items.length) {
		return await ladderHelper.GetStandingsDetails(`cur#${ladderId}`)
	}

	return apiData.data.standingsByLadder.items[0]
}

export default ladderHelper;