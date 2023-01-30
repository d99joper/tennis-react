import { API } from 'aws-amplify';
import { listLadders, getLadder } from "../graphql/queries";
import { listLadderPlayersAsObjects, listOtherPlayersAsObjects } from "../graphql/customQueries";
import {
    createLadder as createLadderMutation,
    updateLadder as updateLadderMutation,
    deleteLadder as deleteLadderMutation,
    createLadderPlayer
} from "../graphql/mutations";
import { useEffect, useState } from 'react';
import { responsiveFontSizes } from '@mui/material';

const ladderFunctions = {

    useLadderPlayersData: function (ladderId, searchInput) {
        const [data, setData] = useState({ ladder: {}, players: [{ name: 'no players found', id: 0 }] });
        useEffect(() => {
            const fetchData = async () => {
                let ladderPlayers
                if (ladderId == '-1') {
                    console.log("updated the search input on 'Other' ladder")
                    ladderPlayers = await ladderFunctions.GetLadderPlayersForOther(searchInput)

                } else {
                    console.log("changed normal ladder")
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

        console.log(data)
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
        console.log(data)
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

    CreateLadder: async function (ladder) {
        console.log('createLadder', ladder);

        const loadData = {
            name: ladder.name,
            matchType: ladder.matchType,
            ... ladder.geoData ? {geoData: ladder.geoData} :null,
            ... ladder.city ? {city: ladder.city} :null,
            ... ladder.zip ? {zip: ladder.zip} :null
        };

        console.log(loadData);

        try {
            API.graphql({
                query: createLadderMutation,
                variables: { input: loadData },
            }).then((result) => {
                console.log('New ladder created', result);
                return result;
            }).catch((e) => { console.log(e) });
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
        try {
            const apiData = await API.graphql({
                query: getLadder,
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
                    retVal.players[i] = {id: item.id, name: item.name}
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

    GetLadderPlayers: async function (ladderId) {
        try {
            let filter = { ladderID: { eq: ladderId } }
            let query = listLadderPlayersAsObjects

            console.log(filter)
            const apiData = await API.graphql({
                query: query,
                variables: { filter: filter }
            })

            const result = apiData.data.listLadderPlayers.items
            console.log("GetLadderPlayers", result)


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

    GetPlayerLadders: async function (playerId) {
        try {
            const filter = { playerID: { eq: playerId } }

            const apiData = await API.graphql({
                query: listLadderPlayersAsObjects,
                variables: { filter: filter }
            })

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
    },

    fetchLadders: async function (filter) {
        // let filter = {
        //     name: {
        //         eq: name // filter priority = 1
        //     }
        // };
        const apiData = await API.graphql({ query: listLadders, variables: { filter: filter } });

        const laddersFromAPI = apiData.data.listLadders.items;

        return laddersFromAPI;
    }
}

export default ladderFunctions;