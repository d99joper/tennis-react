import { API } from 'aws-amplify';
import { getMatch, listComments, listMatches as findMatches } from "../graphql/queries";
import { listMatches } from 'graphql/customQueries';
import {
    createMatch as createMatchMutation,
    updateMatch as updateMatchMutation,
    deleteMatch as deleteMatchMutation,
    createComment
} from "../graphql/mutations";
import { helpers, userFunctions as uf } from 'helpers';
//import userFunctions from './userFunctions';

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

    createMatchesFromArray: async function(matches) {
        let counter = 0
        for (let m of matches) {
            if(m.Date && m.Win && m.Result) {
                // use counter to limit the number of matches to import
                // if(counter === 40) break
                // Get or create opponent
                const me = await uf.createPlayerIfNotExist()
                const opponent = await uf.createPlayerIfNotExist(m.Opponent)
                //console.log(m)
                const match = {
                    winner: {id: m.Win === 'W' ? me.id : opponent.id},
                    loser: {id: m.Win === 'L' ? me.id : opponent.id},
                    playedOn: m.Date,
                    ladderID: '-1',
                    score: m.Result.replace(/\s/g,'').split(','),
                    ... m.Notes ? {comment: {
                        content: m.Notes,
                        postedByID: me.id,
                        private: true,
                        postedOn: helpers.formatAWSDate(m.Date)
                    }} :null
                }
                this.createMatch(match)
            }
            counter++
        }

    },

    createMatch: async function (match) {

        const scoreBreakdown = parseScore(match.score)

        const playedOn = helpers.formatAWSDate(match.playedOn,0)
       
        const loadData = {
            winnerID: match.winner.id,
            loserID: match.loser.id,
            playedOn: playedOn,
            year: new Date(playedOn).getFullYear(),
            // don't add ladder if the type is 'Other'
            ladderID: match.ladderID,
            score: match.score.filter(Boolean).join(', '),
            ...scoreBreakdown
        };

        // check that the match hasn't already been added
        const matchCheck = await this.findMatch(loadData)
        console.log(matchCheck)
        if(matchCheck) return matchCheck 

        try {
            API.graphql({
                query: createMatchMutation,
                variables: { input: loadData },
            }).then((result) => {
                // add comment
                console.log('New Match created', result, match.comment);
                if (match.comment) {
                    console.log("add comment", match.comment)
                    API.graphql({
                        query: createComment,
                        variables: { input: { 
                            matchID: result.data.createMatch.id, 
                            content: match.comment.content,
                            ... match.comment.postedByID ? {postedByID: match.comment.postedByID} :null,
                            ... match.comment.private ? {private: match.comment.private} :null,
                            ... match.comment.postedOn ? {postedOn: match.comment.postedOn} :null 
                        }}
                    }).then((commentResult) => {
                        result.data.comment = commentResult.data.createComment;
                    }).catch((e) => { console.log("failed to create match comment", e) })
                }

                return result;
            }).catch((e) => { console.log("Failed to create Match", e) });
        }
        catch (e) {
            console.error("failed to create a Match", e);
        }
    },

    findMatch: async function(loadData) {
        // check if there already is a match played on this exact day 
        // with the same players and outcome
        
        const filter = {
            playedOn: { eq: loadData.playedOn },
            score: { eq: loadData.score },
            winnerID: { eq: loadData.winnerID },
            loserID: { eq: loadData.loserID },
            ladderID: { eq: loadData.ladderID }
        }
        //console.log(filter)
        const matches = await this.listMatches(null, null, null, null, filter)
        //console.log(matches)
        if(matches.length > 0) 
            return matches[0]
        
        return
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

    listMatches: async function (player, ladder, startDate, endDate, findFilter = null) {
        let filter = findFilter ?? {
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
        //console.log(filter)
        const apiData = await API.graphql({
            query: findFilter ? findMatches : listMatches,
            variables: { 
                filter: filter, 
                sort: [{ field: "playedOn", direction: "desc" }] 
            }
        })
        //console.log(apiData.data)
        const MatchsFromAPI = findFilter ? apiData.data.listMatches.items : apiData.data.searchMatches.items
        
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