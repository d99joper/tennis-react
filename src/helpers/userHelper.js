import { API, Auth, DataStore, Storage } from 'aws-amplify';
import { helpers, enums } from '../helpers/index';
import { SlUser } from 'react-icons/sl';
import { playerAPI } from 'api/services';
import React from 'react';
import { View } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';

const userHelper = {

	// createPlayerIfNotExist: async function (name, email, override = false) {
	// 	const user = {}//await Auth.currentAuthenticatedUser();

	// 	let players
	// 	//console.log(user);
	// 	// override is set to true if you want to create the user regardless
	// 	if (!override) {
	// 		if (typeof user != 'undefined') {
	// 			// check if the email already exists
	// 			if (email)
	// 				players = await playerAPI.getPlayerByFilter(email)

	// 			if (players)
	// 				return { message: 'A player with that email already exists', players: players, type: enums.PLAYER_EXISTS.Username }

	// 			// get player by name to see if there are other players like this one 
	// 			// (would be nice with an 'equals' filter here)
	// 			players = await playerAPI.getPlayers(name)
	// 			if (players)
	// 				return { message: 'Players with that name already exists', players: players, type: enums.PLAYER_EXISTS.Name }
	// 		}
	// 	}

	// 	// if no similar players were found,player doesn't exist, so create it
	// 	let player
	// 	// by name and email
	// 	if (name && email) player = await playerAPI.createPlayer({ name: name, email: email })
	// 	// by name
	// 	else if (name) player = await playerAPI.createPlayer({ name: name, email: 'noEmail@mytennis.space' })
	// 	// by logged in user (first time you log in a player is created for your profile)
	// 	else player = await playerAPI.createPlayer({ name: user.attributes.name, email: user.attributes.email })

	// 	console.log("create a new player", player)
	// 	// return the player
	// 	return player
	// },

	// UpdatePlayer: async function (player, userId, image) {

	// 	try {
	// 		const arrayBuffer = await image.arrayBuffer()
	// 		const text = await image.text()
	// 		console.log(arrayBuffer)
	// 		console.log(text)
	// // 		var reader = new FileReader();
	// // reader.onload = function() {

	// //   var arrayBuffer = this.result,
	// //     array = new Uint8Array(arrayBuffer),
	// //     binaryString = String.fromCharCode.apply(null, array);

	// //   console.log(binaryString);

	// // }
	// // reader.readAsArrayBuffer(image);

	// 		let imageName = (!!player.image ? player.image.name : undefined)
	// 		if (image) {
	// 			const nameArr = image.name.split('.')
	// 			imageName = nameArr[0] + '_' + Date.now() + '.' + nameArr.pop()
	// 		}

	// 		let inputData = {
	// 			id: userId,
	// 			...(player.name && { name: player.name }),
	// 			...(image && { image: imageName }),
	// 			...(player.phone && { phone: player.phone }),
	// 			about: player.about,
	// 			NTRP: player.NTRP,
	// 			UTR: player.UTR
	// 		};

	// 		if (!!(inputData.image && image)) {
	// 			// add the new image
	// 			await Storage.put(imageName, image);
	// 			// remove the old image
	// 			if (!!player.image)
	// 				Storage.remove(player.image)
	// 		}

	// 		const updatedPlayer = await playerAPI.updatePlayer(inputData)

	// 		// set the image url and return the player
	// 		//updatedPlayer.image = await Storage.get(updatedPlayer.image);

	// 		return updatedPlayer
	// 	}
	// 	catch (e) {
	// 		console.log("failed to update players", e);
	// 		return {error: 'Failed to update player'}
	// 	}
	// },

	// stringAvatar: function (player, size, randomNumber) {
	// 	try {
	// 		// create a random number to avoid image being cached
	// 		if(!randomNumber)
	// 			randomNumber = Math.floor(Math.random() * 1000000);
	// 		const jsonObj = {
	// 			sx: {
	// 				...player ? { bgcolor: helpers.stringToColor(player.name) } : null,
	// 				width: size,
	// 				height: size,
	// 				border: 1
	// 			},
	// 			...player && player.image
	// 				? { src: player.image+'?dummy='+randomNumber}
	// 				: { children: <SlUser {...size ? { size: size * 0.65 } : null} /> }
	// 		}

	// 		return jsonObj
	// 	}
	// 	catch (e) { console.log(e) }
	// },

	// createPlayer: async function (name, email = 'noEmail@mytennis.space.com', id) {
	// 	console.log('createPlayer')

	// 	// check if the player already exists
	// 	const player = this.getPlayer

	// 	const loadData = {
	// 		name: name,
	// 		email: email,
	// 		...id ? { id: id } : null,
	// 		verified: (id ? true : false)
	// 	};
	// 	console.log(loadData);

	// 	try {
	// 		const result = await API.graphql({
	// 			query: createPlayerMutation,
	// 			variables: { input: loadData },
	// 		}) //.then((result) => {
	// 		console.log('New player created', result);
	// 		return result.data.createPlayer;
	// 		//}).catch((e) => { console.log(e) });
	// 	}
	// 	catch (e) {
	// 		console.error("failed to create a player", e);
	// 	}
	// },

	// getCurrentlyLoggedInPlayer: async function () {
	// 	try {
	// 		let user = await Auth.currentAuthenticatedUser()
	// 		//console.log("getCurrentlyLoggedInPlayer", user);

	// 		if (typeof user !== 'undefined') {
	// 			// const player = await this.getPlayerFromAPI(user.attributes.email, null, true)
	// 			const player = await playerAPI.getPlayerByFilter(user.attributes.email)
	// 			return player
	// 		}
	// 		else return

	// 	}
	// 	catch (e) { console.log(e) }
	// },

	// getPlayer: async function (id) {
	// 	try {
	// 		const playerFromAPI = await this.getPlayerFromAPI(null, id, true)
	// 		playerFromAPI.name = playerFromAPI.name + (playerFromAPI.verified ? "" : "*")
	// 		return playerFromAPI;
	// 	}
	// 	catch (e) {
	// 		console.log("failed to get player", e);
	// 		return;
	// 	}
	// },

	// getGreatestRivals: async function (id) {
	// 	const apiResult = await API.graphql({
	// 		query: GetGreatestRivals,
	// 		variables: {
	// 			filter_winner: { winnerID: { eq: id } },
	// 			filter_loser: { loserID: { eq: id } },
	// 			limit: 5
	// 		}
	// 	})

	// 	let rivals = []
	// 	// start with the wins
	// 	console.log(apiResult.data)
	// 	if (apiResult.data.wins.players.length > 0) {
	// 		for (const rival of apiResult.data.wins.players[0].result.buckets) {
	// 			const player = await this.getPlayerFromAPI(null, rival.key, true)

	// 			const lossItem = apiResult.data.losses.players[0].result.buckets.find(a => a.key === rival.key)
	// 			const lossCount = lossItem ? lossItem.doc_count : 0

	// 			const newRival = {
	// 				player: player,
	// 				wins: rival.doc_count,
	// 				losses: lossCount,
	// 				totalMatches: lossCount + rival.doc_count
	// 			}
	// 			rivals.push(newRival)
	// 		}
	// 	}
	// 	// now the loss bucket (to catch any players there are only losses against)
	// 	if (apiResult.data.losses.players.length > 0)
	// 		for (const rival of apiResult.data.losses.players[0].result.buckets) {
	// 			// check if the rival is already in the array
	// 			const rivalExists = rivals ? rivals.find(x => x.player.id === rival.key) : false
	// 			if (!rivalExists) { // if the rival exists, we've already taken care of the losses 
	// 				const player = await this.getPlayerFromAPI(null, rival.key, true)
	// 				const newRival = {
	// 					player: player,
	// 					wins: 0,
	// 					losses: rival.doc_count,
	// 					totalMatches: rival.doc_count
	// 				}
	// 				rivals.push(newRival)
	// 			}
	// 		}
	// 	// sort the most matches first in the list
	// 	return rivals.filter(a => a.totalMatches > 1).sort((a, b) => b.totalMatches - a.totalMatches)
	// },

	// GetMatches: async function () {
	// 	try {
	// 		const matches = await DataStore.query(Match);
	// 		console.log("matches retrieved successfully!", JSON.stringify(matches, null, 2));
	// 	} catch (error) {
	// 		console.log("Error retrieving matches", error);
	// 	}
	// },

	// GetPlayers: async function () {
	// 	const playersAPI = await API.graphql({
	// 		query: listPlayers
	// 	})

	// 	return AddAsteriskToUnverifiedPlayers(playersAPI.data.listPlayers.items);
	// },

	// getPlayers: async function () {
	//     try {
	//         const players = await DataStore.query(Player);
	//         console.log("Players retrieved successfully!", JSON.stringify(players, null, 2));
	//     } catch (error) {
	//         console.log("Error retrieving players", error);
	//     }
	// },

	// createPlayer_DataStore: async function (Player) {
	// 	try {
	// 		await DataStore.save(Player);
	// 		console.log("Player saved successfully!");
	// 	} catch (error) {
	// 		console.log("Error saving player", error);
	// 	}
	// },

	// getPlayerFromAPI: async function (email = null, id = null, includeImage = false, name = null) {

	// 	try {
	// 		const query = id ? qGetPlayer : qGetPlayerByEmail
	// 		const variables = id ? { id: id }
	// 			: { email: email, ...name ? { name: { eq: name } } : null }

	// 		const apiData = await API.graphql({
	// 			query: query,
	// 			variables: variables
	// 		})

	// 		const playerFromAPI = id ? apiData.data.getPlayer : apiData.data.playerByEmail.items[0]

	// 		if (playerFromAPI && includeImage)
	// 			await this.SetPlayerImage(playerFromAPI)

	// 		// Get potentially unlinked matches
	// 		const unlinkedMatches = await API.graphql({
	// 			query: qGetUnlinkedMatches,
	// 			variables: {
	// 				email: 'noEmail@mytennis.space',
	// 				name: { eq: playerFromAPI.name },
	// 				ignoredBy: playerFromAPI.id,
	// 				filter: { not: { id: { eq: playerFromAPI.id } } }
	// 			}
	// 		})
	// 		playerFromAPI.unLinkedMatches = unlinkedMatches.data?.playerByEmail?.items[0]
	// 			?.playerMatches?.items
	// 			.sort((a, b) => { return a.playedOn - b.playedOn })

	// 		//console.log("getPlayerFromAPI", playerFromAPI)
	// 		return playerFromAPI;
	// 	}
	// 	catch (e) {
	// 		console.log("failed to getPlayerFromAPI", e);
	// 		return;
	// 	}
	// },

	// CheckIfSignedIn: async function () {
	// 	try {
	// 		let user = await Auth.currentAuthenticatedUser();
	// 		if (!user) {
	// 			return false;
	// 		}
	// 		if (user === 'The user is not authenticated') {
	// 			return false;
	// 		}
	// 		else return true;
	// 	}
	// 	catch (e) {
	// 		console.log("CheckIfSignedIn", e)
	// 		return false;
	// 	}
	// },

	// getUserAttributes: async function () {
	// 	return Auth.currentUserInfo();
	// },

	signOut: function () {
		localStorage.clear()
		// Auth.signOut()
		// 	.then(data => console.log(data))
		// 	.catch(err => console.log('err' + err))
	},

	// deletePlayer: async function (id, onlyDeleteIfNoMatches = true) {
	// 	try {
	// 		let doDelete = !onlyDeleteIfNoMatches
	// 		if (onlyDeleteIfNoMatches) {
	// 			// get player matches count
	// 			const playerMatches = await API.graphql({
	// 				query: getPlayerMatchByPlayer,
	// 				variables: { playerID: id }
	// 			})
	// 			doDelete = playerMatches.data?.getPlayerMatchByPlayer?.items.length > 0
	// 		}
	// 		if (doDelete) {
	// 			await API.graphql({
	// 				query: deletePlayerMutation,
	// 				variables: { input: { id } },
	// 			});
	// 			return true
	// 		}
	// 		else
	// 			return true
	// 	}
	// 	catch (e) {
	// 		console.log("failed to delete player", e);
	// 		return false;
	// 	}
	// },

	// fetchPlayers: async function (email, filter) {
	//     const apiData = await API.graphql({ query: listPlayers, variables: { filter: filter } });

	//     const playersFromAPI = apiData.data.listPlayers.items;

	//     await Promise.all(
	//         playersFromAPI.map(async (player) => {
	//             console.log(player);
	//             SetPlayerImage(player)
	//             return player;
	//         })
	//     );

	//     return playersFromAPI;
	// },

	// getPlayerH2H: async function (player1, player2) {
	// 	const filter = {
	// 		and: [
	// 			{ playerID: { eq: player1.id } },
	// 			{ opponentID: { eq: player2.id } }
	// 		]
	// 	}

	// 	const apiData = await API.graphql({
	// 		query: H2HStats,
	// 		variables: { filter: filter }
	// 	})
	// 	// add potential player images
	// 	await this.SetPlayerImage(player1)
	// 	await this.SetPlayerImage(player2)
	// 	console.log(apiData.data)

	// 	let data = {
	// 		player1: player1,
	// 		player2: player2,
	// 		matches: apiData.data.result.matches,
	// 		stats: MassageStats(apiData.data.result)
	// 	}
	// 	console.log("getPlayerH2H", data)

	// 	return data
	// },

	// getPlayerStatsByYear: async function (playerId, singlesOrDoubles) {

	// 	// get all active years
	// 	let years = []
	// 	const result = await API.graphql({
	// 		query: GetYearsPlayed,
	// 		variables: { playerId: playerId, type: singlesOrDoubles }
	// 	})
	// 	console.log(result)
	// 	// loop active years
	// 	if (result.data.searchMatches.total) {
	// 		years = await Promise.all(result.data.searchMatches.aggregateItems[0].result.buckets.map(async (y) => {
	// 			const year = y.key
	// 			//const stats = await this.getPlayerStats(playerId, singlesOrDoubles, year)
	// 			//const stats = await this.GetUserStatsAllByYear(playerId, singlesOrDoubles, year)
	// 			const apiData = await API.graphql({
	// 				query: GetUserStatsByYear,
	// 				variables: { playerId: playerId, type: singlesOrDoubles, startDate: `${year}-01-01`, endDate: `${year}-12-31` }
	// 			})

	// 			// massage the data
	// 			console.log(apiData.data)
	// 			let stats = MassageStats(apiData.data.result)
	// 			// add year and data to array, and add a total
	// 			return { year: y.key, count: y.doc_count, stats: stats }
	// 		}))
	// 	}
	// 	else return years

	// 	const clone = structuredClone(years[0].stats)//JSON.parse(JSON.stringify(years[0].stats))

	// 	let totals = { year: 'all', count: years[0].stats.matches.total, stats: clone }

	// 	totals.stats.raw = null
	// 	//console.log("totals init", totals)
	// 	years.forEach((item, i) => {
	// 		if (i !== 0) {
	// 			console.log("index", i)
	// 			totals.count += item.count
	// 			MergeStats(totals.stats, item.stats)
	// 		}
	// 	})
	// 	years.totals = totals
	// 	console.log("getPlayerStatsByYear", years)
	// 	return years.sort((a, b) => (b.year - a.year))
	// },

	// SetPlayerImage: async function (player) {
	// 	if (player?.image) {
	// 		if (!player.imageUrl) {
	// 			const url = await Storage.get(player.image)
	// 			player.imageUrl = url
	// 		}
	// 	}
	// },



	SetPlayerName_old: function (player, lastnameOnly, boldText) {
		let name = player.name
		if (lastnameOnly)
			name = name.split(' ').filter(Boolean).slice(-1)[0]


		if (boldText) {

			if (boldText) {
				let regex = new RegExp(boldText, 'ig')
				const replaceText = name.match(regex)
				console.log(replaceText)
				name = name.split(regex).map((part, index) => {
					console.log(part, index)
					return index % 2 === 0 ? (
						// Non-matching part
						<React.Fragment key={index}>{part}<b>{replaceText[index]}</b></React.Fragment>
					) : (
						// Matching part
						<React.Fragment key={index}>{part}</React.Fragment>
					)
				}
				)
			}
		}
		return <>{name}</> //+ (player.verified ? "" : "*")
	},

	SetPlayerName: (players, setLink = true, boldText) => {
		// only display lastnames if doubles, and add a / between names (i > 0)
		const isDoubles = players.length > 1

		function getName(player) {
			let name = player.name
			if (isDoubles)
				name = name.split(' ').filter(Boolean).slice(-1)[0]

			if (boldText) {
				let regex = new RegExp(boldText, 'ig')
				const replaceText = name.match(regex)
				console.log(replaceText)
				name = name.split(regex).map((part, index) => {
					console.log(part, index)
					return index % 2 === 0 ? (
						// Non-matching part
						<React.Fragment key={index}>{part}<b>{replaceText[index]}</b></React.Fragment>
					) : (
						// Matching part
						<React.Fragment key={index}>{part}</React.Fragment>
					)
				})
			}
			return <>{name}</>
		}
		return players.map((p, i) => {
			const name = getName(p, isDoubles)
			if (setLink) {
				return (
					<React.Fragment key={`Fragment_${i}`}>
						<View as='span'>{i > 0 ? ' / ' : ''}</View>
						<Link to={`/profile/${p.id}`} >{name}</Link>
					</React.Fragment>
				)
			}
			else 
				return (
					<React.Fragment key={`Fragment_${i}`}>
					<View as='span'>{i > 0 ? ' / ' : ''}</View>
					{name}
				</React.Fragment>
				)
		})
	},
}

export default userHelper;
