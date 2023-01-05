import { API, Auth, Storage } from 'aws-amplify';
import { listPlayers, getPlayer } from "../graphql/queries";
import {
    createPlayer as createPlayerMutation,
    updatePlayer as updatePlayerMutation,
    deletePlayer as deletePlayerMutation,
} from "../graphql/mutations";
import ladderFunctions from './ladderFunctions';
import { GetUserStatsOnLoss, GetUserStatsOnWin } from 'graphql/customQueries';

const userFunctions = {

    createPlayerIfNotExist: async function () {
        const user = await Auth.currentAuthenticatedUser();

        console.log(user);
        if (typeof user != 'undefined') {
            const player = await this.getPlayerByEmail(user.attributes.email);
            console.log("createPlayerIfNotExist", player);
            if (player === 'undefined' || player.length === 0) {
                // user doesn't create, so create it
                this.createPlayer(user.attributes.name, user.attributes.email, user.attributes.sub, user.attributes.sub);
            }
        }
    },

    getPlayersForLadder: async function (ladderId) {
        const ladder = await ladderFunctions.GetLadder(ladderId)

        console.log("ladder and ladder.players", ladder, ladder.players)
        return [{ name: 'Jonas', id: 1 }, { name: 'Gurra B', id: 2 }]
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
                phone: (typeof player.phone !== "undefined")
                    ? (player.phone.length === 0 ? null : player.phone)
                    : player.phone,
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

    createPlayer: async function (name, email, id, userGUID) {
        console.log('createPlayer');

        const loadData = {
            name: name,
            email: email,
            id: id,
            userGUID: userGUID
        };

        console.log(loadData);

        try {
            API.graphql({
                query: createPlayerMutation,
                variables: { input: loadData },
            }).then((result) => {
                console.log('New player created', result);
                return result;
            }).catch((e) => { console.log(e) });
        }
        catch (e) {
            console.error("failed to create a player", e);
        }
    },

    getCurrentlyLoggedInPlayer: async function () {
        try {
            let user = await Auth.currentAuthenticatedUser();
            console.log("getCurrentlyLoggedInPlayer", user);
            //console.log(typeof user !== 'undefined');

            if (typeof user !== 'undefined') {
                const player_array = await this.getPlayerByEmail(user.attributes.email);
                let player = player_array[0];
                console.log(player)
                if (player.image)
                    player.imageUrl = await Storage.get(player.image)

                return player;
            }
            else return;

        }
        catch (e) { console.log(e); }
    },

    getPlayer: async function (id) {
        try {
            const apiData = await API.graphql({
                query: getPlayer,
                variables: { id: id },
            });

            const playerFromAPI = apiData.data.getPlayer;

            if (playerFromAPI.image)
                playerFromAPI.imageUrl = await Storage.get(playerFromAPI.image)

            return playerFromAPI;
        }
        catch (e) {
            console.log("failed to get player", e);
            return;
        }
    },

    getPlayerByEmail: async function (email, includeImage = false) {

        try {
            if (!email) return [];

            const emailFilter = {
                email: {
                    eq: email
                }
            };
            console.log(emailFilter)
            console.log('getPlayerByEmail');
            const apiData = await API.graphql({ query: listPlayers, variables: { filter: emailFilter } });

            const playersFromAPI = apiData.data.listPlayers.items;
            console.log(playersFromAPI)
            if (includeImage)
                await Promise.all(
                    playersFromAPI.map(async (player) => {
                        console.log(player);
                        if (player.image) {
                            const url = await Storage.get(player.image);
                            player.imageUrl = url;
                        }
                        return player;
                    })
                );

            return playersFromAPI;
        }
        catch (e) {
            console.log("failed to getPlayerByEmail", e);
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
        // let filter = {
        //     email: {
        //         eq: email // filter priority = 1
        //     }
        // };
        const apiData = await API.graphql({ query: listPlayers, variables: { filter: filter } });

        const playersFromAPI = apiData.data.listPlayers.items;

        await Promise.all(
            playersFromAPI.map(async (player) => {
                console.log(player);
                if (player.image) {
                    const url = await Storage.get(player.name);
                    player.image.url = url;
                }
                return player;
            })
        );

        return playersFromAPI;
    },

    getPlayerStats: async function (playerId, singlesOrDoubles) {

        // get all active years
        
        // loop active years

        // add year and data to array, and add a total

        let stats = {}

        const fetchData = async () => {
            let stats = {}
            // Get win stats
            const winData = await PrivateFunc.GetStats(playerId, singlesOrDoubles, 'W')
            // Get loss stats
            const lossData = await PrivateFunc.GetStats(playerId, singlesOrDoubles, 'L', 2022)
            // Set the data
            const data = {
                wins: {
                    total: winData.searchMatches.total,
                    agg: winData.searchMatches.aggregateItems
                },
                losses: {
                    total: lossData.searchMatches.total,
                    agg: lossData.searchMatches.aggregateItems
                }
            }
            // massage data
            const gamesWon = PrivateFunc.GetTotalValue(data.wins.agg, "gamesWon", data.losses.agg, "gamesLost")
            const gamesLost = PrivateFunc.GetTotalValue(data.wins.agg, "gamesLost", data.losses.agg, "gamesWon")
            const setsWon = PrivateFunc.GetTotalValue(data.wins.agg, "setsWon", data.losses.agg, "setsLost")
            const setsLost = PrivateFunc.GetTotalValue(data.wins.agg, "setsLost", data.losses.agg, "setsWon")
            const tBWon = PrivateFunc.GetTotalValue(data.wins.agg, "tiebreaksWon", data.losses.agg, "tiebreaksLost")
            const tBLost = PrivateFunc.GetTotalValue(data.wins.agg, "tiebreaksLost", data.losses.agg, "tiebreaksWon")

            stats = {
                totalWins: data.wins.total,
                totalLosses: data.losses.total,
                winPercentage: data.wins.total === 0 ? 0 : Math.round(100 * data.wins.total / (data.wins.total + data.losses.total), 2),
                gamesWon: gamesWon,
                gamesLost: gamesLost,
                gamesWonPercentage: gamesWon === 0 ? 0 : Math.round(100 * gamesWon / (gamesWon + gamesLost), 2),
                setsWon: setsWon,
                setsLost: setsLost,
                setsWonPercentage: setsWon === 0 ? 0 : Math.round(100 * setsWon / (setsWon + setsLost), 2),
                tiebreaksWon: tBWon,
                tiebreaksLost: tBLost,
                tiebreakPercentage: tBWon === 0 ? 0 : Math.round(100 * tBWon / (tBWon + tBLost), 2),
            }
            return stats
        }

        stats = await fetchData()

        console.log(stats)
        return stats
    }
}

const PrivateFunc = {

    GetTotalValue: function (array1, name1, array2, name2) {

        const item1 = array1.find(x => x.name === name1)
        const item2 = array2.find(x => x.name === name2)

        return item1.result.value + item2.result.value
    },

    GetStats: async function (playerId, singlesOrDoubles, WinLoss, year) {

        let apiData
        
        if (WinLoss === 'L')
            apiData = await API.graphql({
                query: GetUserStatsOnLoss,
                variables: {
                    playerId: playerId,
                    type: singlesOrDoubles,
                    startDate: year+"-01-01",
                    endDate: year+"-12-31"
                }
            })
        else if (WinLoss === 'W')
            apiData = await API.graphql({
                query: GetUserStatsOnWin,
                variables: {
                    playerId: playerId,
                    type: singlesOrDoubles
                }
            })

        return apiData.data
    },


}

export default userFunctions;