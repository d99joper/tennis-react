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
    qStandingsByLadder
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
            const standings = await this.GetStandingsDetails(standingsId)

            let details = JSON.parse(standings.details)

            const maxPosition = details.length //Math.max(...details.map(o => o.position))
            const player = await userFunctions.getPlayer(playerId)
            let standing = {
                position: maxPosition + 1,
                points: 0,
                player: {
                    id: playerId,
                    name: player.name,
                    wins: 0,
                    losses: 0,
                    ... player.image ? {image: player.image} : null
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
                    postedOn: new Date('1900-01-01').toISOString(), 
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

    GetLadder: async function (id, nextMatchesToken) {
        //console.log(id)
        try {
            const apiData = await API.graphql({
                query: qGetLadder,
                variables: { id: id, matchLimit: 5, nextMatchesToken: nextMatchesToken },
            });

            let ladderFromAPI = apiData.data.getLadder;
            ladderFromAPI.matches.items = ladderFromAPI.matches.items.map((elem,i) => {
                //console.log(elem)
                return {match: elem}
            })
            
            const previousStandings = await this.GetAllLadderStandingsDates(id)

            let data = {
                ... apiData.data.getLadder,
                matches: {
                    nextToken: apiData.data.getLadder.matches.nextToken, 
                    matches: apiData.data.getLadder.matches.items
                },
                previousStandings: previousStandings
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

    UpdateStandings: async function(ladder, playedOn) {
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

            // 1. Get the ladder standing closest before the match date (playedOn). 
            //    If there's no earlier standings, use the current standings
            let standings = await GetStandingsForDate(ladderId, playedOn)
            console.log("standings", standings)
            let details = JSON.parse(standings.details)

            // 2. Create a copy of the current standings and set to 'old'. 
            //    Set the postedOn date to 
            let currentStandings = standings
            if(currentStandings.id.substring(0,3) !== 'cur') 
                currentStandings = await this.GetStandingsDetails(`cur#${ladderId}`)

            await this.CreateStandings(currentStandings, enums.STANDINGS_ID.Old) 

            // 3. Get all matches for the ladder since the match date, sorted by date
            let apiData = await API.graphql({
                query: qGetMatchByLadderID,
                variables: {ladderID: ladderId, playedOn: {ge: playedOn}, sortDirection: 'ASC'}
            })
            const matches = apiData.data.getMatchByLadderID.items
            console.log("matches", matches)
            
            // 4. For each match, update points, wins, and losses
            let maxMatchDate = new Date('1900-01-01')
            matches.map((match) => {
                console.log(match)
                const matchDate = new Date(match.playedOn)
                maxMatchDate = matchDate > maxMatchDate ? matchDate : maxMatchDate 
                // 4a. find the players in the standings
                let winner = details.find(x => x.player.id === match.winnerID)
                let loser = details.find(x => x.player.id === match.loserID)
                this.setDefaultPlayerSettings(winner, match.winner)
                this.setDefaultPlayerSettings(loser, match.loser)
                
                console.log("winner", winner, "loser", loser)
                // 4b. update the players points
                if(winner.points > loser.points) 
                    winner.points += 20
                else 
                    winner.points = loser.points + 20
                
                loser.points += parseInt(loserGamesCount(match.score))

                // 4c. update win/loss number
                winner.wins++
                loser.losses++

                console.log("winner", winner, "loser", loser)
            })
            
            // sort the standings and update positions
            details.sort((a,b) => { return b.points - a.points })
            console.log("details after sort", details)
            
            // 5. Update the current standings and ladder
            const updatedStandings = await API.graphql({
                query: updateStandings,
                variables: {input: {
                    id: `cur#${ladderId}`,
                    details: JSON.stringify(details),
                    postedOn: maxMatchDate.toISOString(), 
                    ladderID: ladderId
                }}
            })

            // 6. Delete all standings later than the current (can't have standings in the future)
            // 6a. Get ladder standings
            const standingsToDelete = await this.GetAllLadderStandingsDates(ladderId, maxMatchDate)
            // 6b. Loop to delete
            for (const s of standingsToDelete) 
                //await this.deleteStandings(s.id)
            
            ladder.standings = updatedStandings.data

            return ladder

        }
        catch(e) {
            console.log("failed to update standings", e)
            throw e
        }
    },

    GetAllLadderStandingsDates: async function(ladderId, fromDate = null) {
        const apiData = await API.graphql({
            query: qStandingsByLadder,
            variables: {
                ladderID: ladderId,
                // make sure we never delete the current standings
                filter: {not: {id: {beginsWith: "cur#"}}},
                ... fromDate ? {postedOn: {ge: fromDate}} : null
            }
        })

        return apiData.data.standingsByLadder.items
    },

    GetStandingsDetails: async function(id) {
        const apiData = await API.graphql({
            query: qGetStandingsDetails,
            variables: {id: id}
        })

        return apiData.data.getStandings
    },

    deleteStandings: async function(id) {
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

    setDefaultPlayerSettings: function(player, playerTemplate) {
        player.wins ??= 0
        player.losses ??= 0
        userFunctions.SetPlayerImage(playerTemplate)

        if(playerTemplate.imageUrl)
            player.imageUrl = playerTemplate.imageUrl
    }
     
}

async function GetStandingsForDate(ladderId, playedOn) {
    // get the standings at the specific playedOn date
    let apiData = await API.graphql({
        query: standingsByLadder,
        variables: {
            ladderID: ladderId, 
            postedOn: {lt: playedOn}, 
            sortDirection: 'DESC', 
            limit: 1}
    })

    // if there are no earlier standings, get the current standings instead
    if(!apiData.data.standingsByLadder.items.length) {
        return await ladderFunctions.GetStandingsDetails(`cur#${ladderId}`) 
    }

    return apiData.data.standingsByLadder.items[0]
}

export default ladderFunctions;