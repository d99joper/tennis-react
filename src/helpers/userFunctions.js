import { API, Auth, DataStore, Storage } from 'aws-amplify';
import { getPlayer, listPlayers, playerByEmail } from "../graphql/queries";
import {
    createPlayer as createPlayerMutation,
    updatePlayer as updatePlayerMutation,
    deletePlayer as deletePlayerMutation,
} from "../graphql/mutations";
import { GetUserStatsByYear, GetYearsPlayed, H2HStats, GetGreatestRivals } from 'graphql/customQueries';
import { Match, Player } from 'models';

const userFunctions = {
    
    createPlayerIfNotExist: async function (name) {
        const user = await Auth.currentAuthenticatedUser();

        //console.log(user);
        if (typeof user != 'undefined') {
            let player
            if(name) player = await this.getPlayerFromAPI('noEmail@mytennis.space', null, null, name);
            else player = await this.getPlayerFromAPI(user.attributes.email, null, null, null);
            //console.log("createPlayerIfNotExist", player);
            if (player === 'undefined' || !player) {
                // user doesn't exist, so create it
                // by name
                if(name) player = await this.createPlayer(name, 'noEmail@mytennis.space', null)
                else player = await this.createPlayer(user.attributes.name, user.attributes.email, user.attributes.sub)
                console.log("createPlayerIfNotExist",player)
                return player
            }
            else return player
        }
    },

    UpdatePlayer: async function (player, userId, image) {

        try {
            let imageName = (!!player.image ? player.image.name : undefined)
            if (image) {
                const nameArr = image.name.split('.')
                imageName = nameArr[0] + '_' + Date.now() + '.' + nameArr.pop()
            }

            let inputData = {
                id: userId,
                ...(player.name && { name: player.name }),
                ...(image && { image: imageName }),
                ...(player.phone && { phone: player.phone }),
                about: player.about,
                NTRP: player.NTRP,
                UTR: player.UTR
            };

            if (!!(inputData.image && image)) {
                // add the new image
                await Storage.put(imageName, image);
                // remove the old image
                if (!!player.image)
                    Storage.remove(player.image)
            }

            const result = await API.graphql({
                query: updatePlayerMutation,
                variables: {
                    input: inputData,
                    conditions: { id: userId } // required
                }
            })

            console.log('Player updated', result.data.updatePlayer)
            let updatedPlayer = result.data.updatePlayer

            // set the image url and return the player
            updatedPlayer.imageUrl = await Storage.get(updatedPlayer.image);

            return updatedPlayer
        }
        catch (e) {
            console.log("failed to update players", e);
            return null
        }
        //   finally {
        //     return inputData;
        //   }
    },

    createPlayer: async function (name, email, id) {
        console.log('createPlayer');

        const loadData = {
            name: name,
            email: email,
            ... id ? {id: id}: null,
            verified: (id ? true : false)
        };
        console.log(loadData);

        try {
            const result = await API.graphql({
                query: createPlayerMutation,
                variables: { input: loadData },
            }) //.then((result) => {
            console.log('New player created', result);
            return result.data.createPlayer;
            //}).catch((e) => { console.log(e) });
        }
        catch (e) {
            console.error("failed to create a player", e);
        }
    },

    getCurrentlyLoggedInPlayer: async function () {
        try {
            let user = await Auth.currentAuthenticatedUser();
            //console.log("getCurrentlyLoggedInPlayer", user);
            
            if (typeof user !== 'undefined') {
                const player = await this.getPlayerFromAPI(user.attributes.email, null, true);

                return player;
            }
            else return;

        }
        catch (e) { console.log(e); }
    },

    getPlayer: async function (id) {
        try {
            const playerFromAPI = await this.getPlayerFromAPI(null, id, true)

            return playerFromAPI;
        }
        catch (e) {
            console.log("failed to get player", e);
            return;
        }
    },

    getGreatestRivals: async function(id) {
        const apiResult = await API.graphql({
            query: GetGreatestRivals,
            variables: {
                filter_winner: { winnerID: { eq: id }}, 
                filter_loser: { loserID: { eq: id }},
                limit: 5
            }
        })

        let rivals = []
        // start with the wins
        console.log(apiResult.data)
        if(apiResult.data.wins.players.length > 0)  {
            for(const rival of apiResult.data.wins.players[0].result.buckets) {
                const player = await this.getPlayerFromAPI(null, rival.key, true)

                const lossItem = apiResult.data.losses.players[0].result.buckets.find(a => a.key === rival.key)
                const lossCount = lossItem ? lossItem.doc_count : 0
            
                const newRival = {
                    player: player,
                    wins: rival.doc_count,
                    losses: lossCount,
                    totalMatches: lossCount + rival.doc_count
                }
                rivals.push(newRival)
            }
        }
        // now the loss bucket (to catch any players there are only losses against)
        if(apiResult.data.losses.players.length > 0) 
        for(const rival of apiResult.data.losses.players[0].result.buckets) {
            // check if the rival is already in the array
            const rivalExists = rivals ? rivals.find(x => x.player.id === rival.key) : false
            if(!rivalExists) { // if the rival exists, we've already taken care of the losses 
                const player = await this.getPlayerFromAPI(null, rival.key, true)
                const newRival = {
                    player: player,
                    wins: 0,
                    losses: rival.doc_count,
                    totalMatches: rival.doc_count
                }
                rivals.push(newRival)
            }
        }
        // sort the most matches first in the list
        return rivals.filter(a => a.totalMatches > 1).sort((a,b) => b.totalMatches - a.totalMatches)
    },

    GetMatches: async function () {
        try {
            const matches = await DataStore.query(Match);
            console.log("matches retrieved successfully!", JSON.stringify(matches, null, 2));
        } catch (error) {
            console.log("Error retrieving matches", error);
        }
    },

    GetPlayers: async function() {
        const playersAPI = await API.graphql({
            query: listPlayers
        })

        return playersAPI.data.listPlayers.items;
    },

    getPlayers: async function () {
        try {
            const players = await DataStore.query(Player);
            console.log("Players retrieved successfully!", JSON.stringify(players, null, 2));
        } catch (error) {
            console.log("Error retrieving players", error);
        }
    },

    createPlayer_DataStore: async function (Player) {
        try {
            await DataStore.save(Player);
            console.log("Player saved successfully!");
        } catch (error) {
            console.log("Error saving player", error);
        }
    },

    getPlayerFromAPI: async function (email = null, id = null, includeImage = false, name = null) {

        try {
            const query = id ? getPlayer : playerByEmail
            const variables = id ? {id: id} 
                : { email: email, ...name ? {name: {eq: name}} : null }

            const apiData = await API.graphql({ 
                query: query, 
                variables: variables 
            })

            const playerFromAPI = id ? apiData.data.getPlayer : apiData.data.playerByEmail.items[0]
            
            if (playerFromAPI && includeImage)
                await SetPlayerImage(playerFromAPI)

            //console.log("getPlayerFromAPI", playerFromAPI)
            return playerFromAPI;
        }
        catch (e) {
            console.log("failed to getPlayerFromAPI", e);
            return;
        }
    },

    CheckIfSignedIn: async function () {
        try {
            let user = await Auth.currentAuthenticatedUser();
            if (!user) {
                return false;
            }
            if (user === 'The user is not authenticated') {
                return false;
            }
            else return true;
        }
        catch (e) {
            console.log("CheckIfSignedIn", e)
            return false;
        }
    },

    getUserAttributes: async function () {
        return Auth.currentUserInfo();
    },

    signOut: function () {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log('err' + err))
    },

    deletePlayer: async function (id) {
        try {
            await API.graphql({
                query: deletePlayerMutation,
                variables: { input: { id } },
            });
            return true
        }
        catch (e) {
            console.log("failed to delete player", e);
            return false;
        }
    },

    fetchPlayers: async function (email, filter) {
        const apiData = await API.graphql({ query: listPlayers, variables: { filter: filter } });

        const playersFromAPI = apiData.data.listPlayers.items;

        await Promise.all(
            playersFromAPI.map(async (player) => {
                console.log(player);
                SetPlayerImage(player)
                return player;
            })
        );

        return playersFromAPI;
    },

    getPlayerH2H: async function(player1, player2){
        const filter = {
            and: [
                { playerID: { eq: player1.id }},
                { opponentID: { eq: player2.id }}
            ]
        }
    
        const apiData = await API.graphql({
            query: H2HStats,
            variables: {filter: filter}
        })
        // add potential player images
        await SetPlayerImage(player1)
        await SetPlayerImage(player2)
        console.log(apiData.data)
        //let matches = apiData.data.result.matches 
           // .sort((a,b) => new Date(b.playedOn).getTime() - new Date(a.playedOn).getTime())

        let data = {
            player1: player1,
            player2: player2,
            matches: apiData.data.result.matches,
            stats: MassageStats(apiData.data.result)
        }
        console.log("getPlayerH2H",data)

        return data
    },

    
    // GetUserStatsAllByYear: async function (playerId, singlesOrDoubles, year) {
    //     const apiData = await API.graphql({
    //         query: GetUserStats_All,
    //         variables: { playerId: playerId, type: singlesOrDoubles, year: year }
    //     })
        
    //     // massage the data
    //     let data = MassageStats(apiData.data)
            
    //     console.log(data)
    //     return data
    // },

    getPlayerStatsByYear: async function (playerId, singlesOrDoubles) {
        
        // get all active years
        let years = []
        const result = await API.graphql({
            query: GetYearsPlayed,
            variables: { playerId: playerId, type: singlesOrDoubles }
        })
        console.log(result)
        // loop active years
        if (result.data.searchMatches.total) {
            years = await Promise.all(result.data.searchMatches.aggregateItems[0].result.buckets.map(async (y) => {
                const year = y.key
                //const stats = await this.getPlayerStats(playerId, singlesOrDoubles, year)
                //const stats = await this.GetUserStatsAllByYear(playerId, singlesOrDoubles, year)
                const apiData = await API.graphql({
                    query: GetUserStatsByYear,
                    variables: { playerId: playerId, type: singlesOrDoubles, startDate: `${year}-01-01` , endDate: `${year}-12-31` }
                })
                
                // massage the data
                console.log(apiData.data)
                let stats = MassageStats(apiData.data.result)
                // add year and data to array, and add a total
                return { year: y.key, count: y.doc_count, stats: stats }
            }))
        }
        else return years

        const clone = structuredClone(years[0].stats)//JSON.parse(JSON.stringify(years[0].stats))
        
        let totals = { year: 'all', count: years[0].stats.matches.total, stats: clone} 
                
        totals.stats.raw = null
        //console.log("totals init", totals)
        years.forEach((item,i) => {
            if(i !== 0) {
                console.log("index",i)
                totals.count += item.count              
                MergeStats(totals.stats, item.stats)                
            }
        })
        years.totals = totals
        console.log("getPlayerStatsByYear", years)
        return years.sort((a, b) => (b.year - a.year))
    }
}

    
async function SetPlayerImage(player) {
    if (player.image) {
        if(!player.imageUrl) {
        const url = await Storage.get(player.image);
        player.imageUrl = url;
        }   
    }
}

function MergeStats(stats1, stats2) {
    //console.log(stats1,stats2)
    for(const prop in stats2) {
        if(prop !== 'raw') {
            console.log(prop)
            stats1[prop].total += stats2[prop].total
            stats1[prop].losses += stats2[prop].losses
            stats1[prop].wins += stats2[prop].wins
            stats1[prop].percentage = CalcPercentage(stats1[prop].wins, stats1[prop].losses)
        }
    }
    //return stats1
}

function MassageStats(rawData) {
    //console.log(rawData)
    const totals = {
            gamesWon: GetArrayItemValue(rawData.stats, 'name', 'gamesWon', 'result.value'),
            gamesLost: GetArrayItemValue(rawData.stats, 'name', 'gamesLost', 'result.value'),
            setsWon: GetArrayItemValue(rawData.stats, 'name', 'setsWon', 'result.value'),
            setsLost: GetArrayItemValue(rawData.stats, 'name', 'setsLost', 'result.value'),
            tiebreaksWon: GetArrayItemValue(rawData.stats, 'name', 'tiebreaksWon', 'result.value'),
            tiebreaksLost: GetArrayItemValue(rawData.stats, 'name', 'tiebreaksLost', 'result.value'),
    }
    const wins = GetArrayItemValue(GetArrayItemValue(rawData.stats, 'name', 'wins', 'result.buckets'), 'key', '1','doc_count') 
    const losses = GetArrayItemValue(GetArrayItemValue(rawData.stats, 'name', 'wins', 'result.buckets'), 'key', '0','doc_count') 
   
    let data = {
        raw: {
            // total matches
            total: rawData.total,
            aggregates: totals,
            losses: losses,
            wins: wins
        },
        matches: {
            wins: wins,
            losses: losses,
            percentage: CalcPercentage(wins, losses),
            total: rawData.total
        },
        sets: {
            wins: totals.setsWon,
            losses: totals.setsLost,
            percentage: CalcPercentage(totals.setsWon, totals.setsLost),
            total: totals.setsLost + totals.setsWon
        },
        games: {
            wins: totals.gamesWon,
            losses: totals.gamesLost,
            percentage: CalcPercentage(totals.gamesWon, totals.gamesLost),
            total: totals.gamesLost + totals.gamesWon
        },
        tiebreaks: {
            wins: totals.tiebreaksWon,
            losses: totals.tiebreaksLost,
            percentage: CalcPercentage(totals.tiebreaksWon, totals.tiebreaksLost),
            total: totals.tiebreaksLost + totals.tiebreaksWon
        }
    }
    
    return data
}

function GetCombinedAggregates(wins, losses) {
    //console.log(wins, losses)
    const combined = wins.stats.map((item, i) => {
        // copy the wins child object
        let copy = { result: { value: 0 }, name: item.name }
        // find the equivalent losses child object
        const lossChildOject = losses.stats.find(x => x.name === item.name)
        // Calculate and set the new value 
        copy.result.value = 
            lossChildOject ? lossChildOject.result.value :0 
            + item ? item.result.value:0 
        // return the new item
        return copy
    })
    return combined
}

function GetTotalValue(array1, name1, array2, name2) {
    
    const item1 = array1.find(x => x.name === name1)
    const item2 = array2.find(x => x.name === name2)
    
    return item1.result.value + item2.result.value
}

function GetArrayItemValue(arr, variableName, variableValue, valueName) {
    let item = arr.find(x => x[variableName] == variableValue)
    let value = item

    if(item) {
        const itemNames = valueName.split('.')
        itemNames.forEach(element => {
            value = value[element]
        });
        return value
    }

    return 0
}

function GetTotalValue2(array1, array2, name) {
    const item1 = array1.find(x => x.name === name)
    const item2 = array2.find(x => x.name === name)
    
    const val1 = (item1 ? item1.result.value :0)
    const val2 = (item2 ? item2.result.value :0)
    //console.log(`val1:${val1}, val2:${val2}, result:${val1+val2}`)
    return val1+val2
}

function CalcPercentage(val1, val2) {
    return val1 === 0 ? 0 : Math.round(100 * val1 / (val1 + val2), 2)
}   


export default userFunctions;

// getPlayerStats: async function (playerId, singlesOrDoubles, year) {

//     let stats = {}

//     const fetchData = async () => {
//         let stats = {}
//         // Get win stats
//         const winData = await GetStats(playerId, singlesOrDoubles, 'W', year)
//         // Get loss stats
//         const lossData = await GetStats(playerId, singlesOrDoubles, 'L', year)
//         // Set the data
//         const data = {
//             wins: {
    //                 total: winData.searchMatches.total,
    //                 agg: winData.searchMatches.aggregateItems
    //             },
    //             losses: {
        //                 total: lossData.searchMatches.total,
        //                 agg: lossData.searchMatches.aggregateItems
        //             }
        //         }
        //         // massage data
        //         const gamesWon = GetTotalValue(data.wins.agg, "gamesWon", data.losses.agg, "gamesLost")
        //         const gamesLost = GetTotalValue(data.wins.agg, "gamesLost", data.losses.agg, "gamesWon")
//         const setsWon = GetTotalValue(data.wins.agg, "setsWon", data.losses.agg, "setsLost")
//         const setsLost = GetTotalValue(data.wins.agg, "setsLost", data.losses.agg, "setsWon")
//         const tBWon = GetTotalValue(data.wins.agg, "tiebreaksWon", data.losses.agg, "tiebreaksLost")
//         const tBLost = GetTotalValue(data.wins.agg, "tiebreaksLost", data.losses.agg, "tiebreaksWon")

//         stats = {
//             totalWins: data.wins.total,
//             totalLosses: data.losses.total,
//             winPercentage: data.wins.total === 0 ? 0 : Math.round(100 * data.wins.total / (data.wins.total + data.losses.total), 2),
//             gamesWon: gamesWon,
//             gamesLost: gamesLost,
//             gamesWonPercentage: gamesWon === 0 ? 0 : Math.round(100 * gamesWon / (gamesWon + gamesLost), 2),
//             setsWon: setsWon,
//             setsLost: setsLost,
//             setsWonPercentage: setsWon === 0 ? 0 : Math.round(100 * setsWon / (setsWon + setsLost), 2),
//             tiebreaksWon: tBWon,
//             tiebreaksLost: tBLost,
//             tiebreakPercentage: tBWon === 0 ? 0 : Math.round(100 * tBWon / (tBWon + tBLost), 2),
//         }
//         return stats
//     }

//     stats = await fetchData()

//     console.log(stats)
//     return stats
// },
// GetStats: async function (playerId, singlesOrDoubles, WinLoss, year) {
    
    //     let apiData
    //     const vars = {
        //         playerId: playerId,
        //         type: singlesOrDoubles,
        //         year: year
        //         // startDate: year + "-01-01",
        //         // endDate: year + "-12-31"
        //     }
        
        //     if (WinLoss === 'L')
        //         apiData = await API.graphql({
            //             query: GetUserStatsOnLoss,
            //             variables: vars
            //         })
            //     else if (WinLoss === 'W')
            //         apiData = await API.graphql({
                //             query: GetUserStatsOnWin,
                //             variables: vars
                //         })
                
                //     return apiData.data
                // },
                