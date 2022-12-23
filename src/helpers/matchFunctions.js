import { API } from 'aws-amplify';
import { getMatch, listComments } from "../graphql/queries";
import { listMatches } from 'graphql/customQueries';
import {
    createMatch as createMatchMutation,
    updateMatch as updateMatchMutation,
    deleteMatch as deleteMatchMutation,
    createComment
} from "../graphql/mutations";
import { helpers } from './helpers';

function parseScore(score) {

    let breakdown = {
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        tiebreaksWon: 0,
        tiebreaksLost: 0
    }

    score.forEach((setScore) => {
        if (setScore) {
            const games = setScore.match(/\d+/g).map(Number);
            if (games[0] > games[1]) {
                breakdown.setsWon++
                if (games[0] > games[1] && Math.abs(games[0] - games[1]) === 1)
                    breakdown.tiebreaksWon++
            }
            if (games[1] > games[0]) {
                breakdown.setsLost++
                if (games[0] > games[1] && Math.abs(games[0] - games[1]) === 1)
                    breakdown.tiebreaksLost++
            }

            breakdown.gamesWon += games[0]
            breakdown.gamesLost += games[1]
        }
    })
    return breakdown
}

const MatchFunctions = {


    CreateMatch: async function (match) {
        console.log('createMatch');

        const scoreBreakdown = parseScore(match.score)

        const playedOn = helpers.formatAWSDate(match.playedOn)

        const loadData = {
            winnerID: match.winner.id,
            loserID: match.loser.id,
            playedOn: playedOn,
            ladderID: match.ladderID,
            score: match.score.filter(Boolean).join(', '),
            ...scoreBreakdown
        };

        console.log(loadData);

        try {
            API.graphql({
                query: createMatchMutation,
                variables: { input: loadData },
            }).then((result) => {
                console.log('New Match created', result);
                // add comment
                if (match.comment) {
                    API.graphql({
                        query: createComment,
                        variables: { input: { matchID: result.data.createMatch.id, content: match.comment } }
                    }).then((commentResult) => {

                    }).catch((e) => { console.log("failed to create match comment", e) })
                }

                return result;
            }).catch((e) => { console.log(e) });
        }
        catch (e) {
            console.error("failed to create a Match", e);
        }
    },

    UpdateMatch: async function (match) {
        try {

            let inputData = {
                name: match.name
            };

            const result = await API.graphql({
                query: updateMatchMutation,
                variables: {
                    input: inputData,
                    conditions: { id: match.id } // required
                }
            })

            console.log('Match updated', result.data.updateMatch)

            return result.data.updateMatch
        }
        catch (e) {
            console.log("failed to update Match", e);
            return null
        }
    },

    GetMatch: async function (id) {
        try {
            const apiData = await API.graphql({
                query: getMatch,
                variables: { id: id },
            });

            const MatchFromAPI = apiData.data.getMatch;

            return MatchFromAPI;
        }
        catch (e) {
            console.log("failed to get Match", e);
            return;
        }
    },

    deleteMatch: async function (id) {
        try {
            await API.graphql({
                query: deleteMatchMutation,
                variables: { input: { id } },
            });
            return true
        }
        catch (e) {
            console.log("failed to delete Match", e);
            return false;
        }
    },

    listMatches: async function (player, ladder, startDate, endDate) {
        let filter = {
            playedOn: { lt: helpers.formatAWSDate(endDate) },
            ...(startDate && { playedOn: { gt: helpers.formatAWSDate(startDate) } }),
            ...(player && {
                or: [
                    { winnerID: { eq: player.id } },
                    { loserID: { eq: player.id } }
                ]
            }),
            ...(ladder && { ladderID: { eq: ladder.id } })
        }

        const apiData = await API.graphql({
            query: listMatches,
            variables: { filter: filter, orderBy: [{ field: "playedOn", direction: "DESC" }] }
        })

        const MatchsFromAPI = apiData.data.listMatches.items
        
        return MatchsFromAPI;
    },

    GetComments: async function(matchId) {
        const apiData = await API.graphql({
            query: listComments, 
            variables: {filter: {matchID: {eq: matchId}}}
        })
        console.log(apiData.data.listComments.items)
        return apiData.data.listComments.items
    }
}

export default MatchFunctions;