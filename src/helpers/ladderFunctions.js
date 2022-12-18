import { API } from 'aws-amplify';
import { listLadders, getLadder } from "../graphql/queries";
import {
    createLadder as createLadderMutation,
    updateLadder as updateLadderMutation,
    deleteLadder as deleteLadderMutation,
} from "../graphql/mutations";

const ladderFunctions = {

    GetPlayersForLadder: async function (ladderId) {
        return [{ name: 'Jonas', id: 1 }, { name: 'Gurra B', id: 2 }]
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
                id: ladder.id,
                players: {add: {id: player.id}}
            }

            API.graphql({
                query: updateLadderMutation,
                variables: {
                    input: inputData,
                    conditions: { id: ladder.id } // required
                }
            }).then((result) => {console.log(result)})
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