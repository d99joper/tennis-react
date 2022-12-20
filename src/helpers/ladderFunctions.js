import { API } from 'aws-amplify';
import { listLadders, getLadder, listLadderPlayers } from "../graphql/queries";
import {
    createLadder as createLadderMutation,
    updateLadder as updateLadderMutation,
    deleteLadder as deleteLadderMutation,
    createLadderPlayer
} from "../graphql/mutations";
import { useEffect, useState } from 'react';

const ladderFunctions = {


    // export const listLadderPlayers = /* GraphQL */ `
    // query ListLadderPlayers(
    //   $filter: ModelLadderPlayerFilterInput
    //   $limit: Int
    //   $nextToken: String
    // ) {
    //   listLadderPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    //     items {
    //       id
    //       player {
    //         name
    //         id
    //       }
    //       playerID
    //       ladderID
    //       createdAt
    //       updatedAt
    //     }
    //     nextToken
    //   }
    // }

    useLadderPlayersData: function (ladderId) {
        const [data, setData] = useState([]);
        useEffect(() => {
            const fetchData = async () => {
                const ladderPlayers = await ladderFunctions.GetLadderPlayers(ladderId)
                setData(ladderPlayers)
            }
            fetchData()
        }, [ladderId])

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
            location: ladder.location
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

    GetLadderPlayers: async function (ladderId) {
        try {
            const filter = { ladderID: { eq: ladderId } }
            console.log(filter)
            const apiData = await API.graphql({
                query: listLadderPlayers
            })

            const result = apiData.data.listLadderPlayers.items
            let players = new Array(result.length)
            console.log("GetLadderPlayers", result)
            result.forEach((p, i) => {
                players[i] = p.player
            })
            return players
        }
        catch (e) {
            console.log("GetLadderPlayers", e)
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