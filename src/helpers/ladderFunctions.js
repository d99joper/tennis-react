import { API } from 'aws-amplify'
import { findNearbyLadders, standingsByLadder } from "../graphql/queries"
import { 
    listLadderPlayersAsObjects, 
    listOtherPlayersAsObjects, 
    qCheckIfPlayerInLadder, 
    qGetLadder, 
    qGetMatchByLadderID, 
    qGetStandingsDetails, 
    qListLadders 
} from "../graphql/customQueries"
import {
    createLadder as createLadderMutation,
    updateLadder as updateLadderMutation,
    deleteLadder as deleteLadderMutation,
    createLadderPlayer,
    createStandings as createStandingsMutation,
    updateStandings
} from "../graphql/mutations"
import { useEffect, useState } from 'react'
import { helpers, enums, userFunctions } from 'helpers'

const ladderFunctions = {

    useLadderPlayersData: function (ladderId, searchInput) {
        const [data, setData] = useState({ ladder: {}, players: [{ name: 'no players found', id: 0 }] });
        useEffect(() => {
            const fetchData = async () => {
                let ladderPlayers
                if (ladderId == '-1') {
                    //console.log("updated the search input on 'Other' ladder")
                    // get all players, not only players attached to a ladder
                    ladderPlayers = await ladderFunctions.GetLadderPlayersForOther(searchInput)

                } else {
                    //console.log("changed normal ladder")
                    ladderPlayers = await ladderFunctions.GetLadderPlayers(ladderId)
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
                const ladders = await ladderFunctions.GetPlayerLadders(playerId)
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

    IsPlayerInLadder: async function (playerId, ladderId) {
        try {
            console.log("IsPlayerInLadder", `${ladderId}#${playerId}`)
            const apiData = await API.graphql({
                query: qCheckIfPlayerInLadder,
                variables: {
                    filter: { 
                        ladderID: { eq: ladderId }, 
                        playerID: { eq: playerId } 
                    }
                }
            })
            //console.log(apiData)
            if (apiData.data.listLadderPlayers.items.length > 0)
                return true
            else return false
        }
        catch (error) {
            const errorMessage = `Failed to check if player ${playerId} is in ladder ${ladderId}.`
            console.log(errorMessage, error)
            throw error
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
            const standings = await API.graphql({
                query: qGetStandingsDetails,
                variables: { id: standingsId }
            })

            let details = JSON.parse(standings.data.getStandings.details)

            const maxPosition = details.length //Math.max(...details.map(o => o.position))
            const player = await userFunctions.getPlayer(playerId)
            let standing = {
                position: maxPosition + 1,
                points: 0,
                player: {
                    id: playerId,
                    name: player.name
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
            this.CreateStandings(
                {
                    id: standingsID, 
                    details: "[]", 
                    postedOn: new Date().toISOString(), 
                    ladderID: ladderId
                }, 
                enums.STANDINGS_ID.Current
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

    GetLadder: async function (id) {
        //console.log(id)
        try {
            const apiData = await API.graphql({
                query: qGetLadder,
                variables: { id: id },
            });

            const ladderFromAPI = apiData.data.getLadder;

            return ladderFromAPI;
        }
        catch (e) {
            console.log("failed to get ladder", e);
            return;
        }
    },

    GetLadderPlayersForOther: async function (matchPhrase) {
        try {
            console.log("getLadderPlayers with phrase")
            const filter = { ...matchPhrase && { name: { matchPhrase: matchPhrase } } }
            const limit = 20
            const query = listOtherPlayersAsObjects
            const apiData = await API.graphql({
                query: query,
                variables: { filter: filter, limit: limit }
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
            return { ladder: { name: 'no ladder found', id: 0 }, players: [{ name: 'no players found', id: 0 }] }
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
                query: findNearbyLadders,
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
            return { ladder: { name: 'no ladder found', id: 0 }, players: [{ name: 'no players found', id: 0 }] }
        }
        catch (e) {
            console.log("GetLadderPlayers", e)
            return
        }
    },

    GetLadders: async function() {
        const laddersAPI = await API.graphql({
            query: qListLadders
        })
        return laddersAPI.data.listLadders.items
    },

    GetPlayerLadders: async function (playerId = null) {
        try {
            const filter = { ... playerId && {playerID: { eq: playerId } }}
            const query = playerId ? listLadderPlayersAsObjects : qListLadders

            const apiData = await API.graphql({
                query: query,
                variables: { filter: filter }
            })

            if(!playerId) return apiData.data.listLadders.items

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

    CreateStandings: async function(standings, oldOrCur) {
        const standingId = oldOrCur === enums.STANDINGS_ID.Current 
            ? `cur#${standings.ladderID}`
            : helpers.getGUID()

        const apiData = await API.graphql({
            query: createStandingsMutation,
            variables: {
                input: {
                    id: standingId,
                    details: standings.details,
                    postedOn: standings.postedOn,
                    ladderID: standings.ladderID
                }
            }
        })

        return apiData.data.createStandings
    },

    UpdateStandings: async function(ladderId, playedOn) {
        try{
            function loserGamesCount(score) {
                const sets = score.split(/[\s,]+/)
                let gameCount = 0
                for (const set of sets) {
                    const games = set.split('-')
                    gameCount += parseInt(games[1].substring(0, games[1].indexOf('(') === -1 ? games[1].length : games[1].indexOf('(')))
                }
                return gameCount
            }
            // get all matches for the ladder since the match date, sorted by date
            let apiData = await API.graphql({
                query: qGetMatchByLadderID,
                variables: {ladderID: ladderId, playedOn: {ge: playedOn}, sortDirection: 'ASC'}
            })
            const matches = apiData.data.getMatchByLadderID.items
            console.log("matches", matches)
            // get the standings at the specific playedOn date
            apiData = await API.graphql({
                query: standingsByLadder,
                variables: {
                    ladderID: ladderId, 
                    postedOn: {le: playedOn}, 
                    sortDirection: 'DESC', 
                    limit: 1}
            })
            let standings = apiData.data.standingsByLadder.items[0]
            console.log("standings", standings)
            let details = JSON.parse(standings.details)
            // create a copy of the current standings and set to 'old'
            if(standings.id.substring(0,3) === 'cur') {
                await this.CreateStandings(standings, enums.STANDINGS_ID.Old)
            } else {
                const apiData = await API.graphql({
                    query: qGetStandingsDetails,
                    variables: {id: `cur#${ladderId}`}
                })
                const currentStandings = apiData.data.getStandings
                await this.CreateStandings(currentStandings, enums.STANDINGS_ID.Old)
            }

            // for each match, 
            matches.map((match) => {
                console.log(match)
                // 1. find the players in the standings
                let winner = details.find(x => x.player.id === match.winnerID)
                let loser = details.find(x => x.player.id === match.loserID)
                console.log("winner", winner, "loser", loser)
                // 2. update the players points
                if(winner.points > loser.points) 
                    winner.points += 20
                else 
                    winner.points = loser.points + 20
                
                loser.points += parseInt(loserGamesCount(match.score))
                // 3. put them back in the standings - is this needed?
                console.log("winner", winner, "loser", loser)
            })
            
            // sort the standings and update positions
            details.sort((a,b) => { return b.points - a.points })
            console.log("details after sort", details)
            // Update the current standings and ladder
            //standings.details = JSON.stringify(details)
            await API.graphql({
                query: updateStandings,
                variables: {input: {
                    id: `cur#${ladderId}`,
                    details: JSON.stringify(details),
                    postedOn: new Date(playedOn).toISOString(), 
                    ladderID: ladderId
                }}
            })

            return true

        }
        catch(e) {
            console.log("failed to update standings", e)
            throw e
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
            console.log("failed to delete ladder", e);
            return false;
        }
    }
}

export default ladderFunctions;