import { API } from 'aws-amplify';
import { getMatch, getMatchByDetails, getPlayerMatchByPlayer, getPlayerMatchByPlayerVs, listComments, listMatches as findMatches } from "../graphql/queries";
//import { listMatches } from 'graphql/customQueries';
import {
    createMatch as createMatchMutation,
    updateMatch as updateMatchMutation,
    deleteMatch as deleteMatchMutation,
    createComment,
    createPlayerMatch
} from "../graphql/mutations";
import { helpers, userFunctions as uf } from 'helpers';
//import userFunctions from './userFunctions';


const MatchFunctions = {

    createMatchesFromArray: async function (matches) {
        let counter = 0
        for (let m of matches) {
            if (m.Date && m.Win && m.Result) {
                // use counter to limit the number of matches to import
                //if (counter === 40) break
                // Get or create opponent
                const me = await uf.createPlayerIfNotExist()
                const opponent = await uf.createPlayerIfNotExist(m.Opponent)
                // create match
                // create playermatch for player
                // create playermatch for opponent
                const match = {
                    winner: { id: m.Win === 'W' ? me.id : opponent.id },
                    loser: { id: m.Win === 'L' ? me.id : opponent.id },
                    playedOn: m.Date,
                    ladderID: '-1',
                    type: 'SINGLES',
                    score: m.Result.replace(/\s/g, '').split(','),
                    ...m.Notes ? {
                        comment: {
                            content: m.Notes,
                            postedByID: me.id,
                            private: true,
                            postedOn: helpers.formatAWSDate(m.Date)
                        }
                    } : null
                }
                await this.createMatch(match, m.Win === 'L')
            }
            counter++
        }

    },

    createMatch: async function (match, flipScoreOnLoss = false) {

        const playedOn = helpers.formatAWSDate(match.playedOn, 0)

        const loadData = {
            winnerID: match.winner.id,
            loserID: match.loser.id,
            playedOn: playedOn,
            type: match.type,
            year: new Date(playedOn).getFullYear(),
            ladderID: match.ladderID,
            score: scoreToString(match.score, flipScoreOnLoss)
        };
        
        // check that the match hasn't already been added
        const matchCheck = await this.findMatch(loadData)
        console.log("find", matchCheck)
        if (matchCheck) return matchCheck

        try {
            const apiData = await API.graphql({
                query: createMatchMutation,
                variables: { input: loadData }
            })
            const matchID = apiData.data.createMatch.id
            //.then((result) => {
            console.log('New Match created', apiData)

            // create the playerMatches
            
            let playerMatchInput = setPlayerMatchInput(match, matchID, flipScoreOnLoss, true)
            await API.graphql({
                query: createPlayerMatch,
                variables: { input: playerMatchInput }
            })
            playerMatchInput = setPlayerMatchInput(match, matchID, flipScoreOnLoss, false)
            await API.graphql({
                query: createPlayerMatch,
                variables: { input: playerMatchInput}
            })

            if (match.comment) {
                console.log("add comment", match.comment)
                const comment = await API.graphql({
                    query: createComment,
                    variables: {
                        input: {
                            matchID: matchID,
                            content: match.comment.content,
                            ...match.comment.postedByID ? { postedByID: match.comment.postedByID } : null,
                            ...match.comment.private ? { private: match.comment.private } : null,
                            ...match.comment.postedOn ? { postedOn: match.comment.postedOn } : null
                        }
                    }
                })
                apiData.data.createMatch.comments = [{...comment.data.createComment}]
            }

            return apiData.data.createMatch
            //}).catch((e) => { console.log("Failed to create Match", e) });
        }
        catch (e) {
            console.error("failed to create a Match", e);
        }
    },

    findMatch: async function (loadData) {
        // check if there already is a match played on this exact day 
        // with the same players and outcome
        const variables = {
            winnerID: loadData.winnerID,
            loserIDTypeLadderIDPlayedOnScore: {
                eq: {
                    loserID: loadData.loserID,
                    type: 'SINGLES',
                    ladderID: loadData.ladderID,
                    playedOn: loadData.playedOn,
                    score: loadData.score
                }
            }
        }
        
        const matches = await API.graphql({
            query: getMatchByDetails,
            variables: variables
        })  //await this.listMatches(null, null, null, null, filter)
        //console.log(matches)
        if (matches.data.getMatchByDetails.items.length > 0)
            return matches.data.getMatchByDetails.items[0] //matches[0]

        return false
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

    getMatchesForPlayer: async function (player, ladder, startDate, endDate, findFilter = null, limit = 10, nextToken) {

        const apiData = await API.graphql({
            query: getPlayerMatchByPlayer,
            variables: { 
                playerID: player.id, 
                limit: limit,
                sortDirection: 'DESC', 
                nextToken: nextToken
            }
        })

        let data = {
            // massage data to add winner and loser
            matches: setMatchWinnerLoserScore(apiData.data.getPlayerMatchByPlayer.items),
            nextToken: apiData.data.getPlayerMatchByPlayer.nextToken
        }
        //const matches = setMatchWinnerLoserScore(apiData.data.getPlayerMatchByPlayer.items)
        console.log(data)
        
        return data
    },

    // listMatches: async function (player, ladder, startDate, endDate, findFilter = null) {
    //     let filter = findFilter ?? {
    //         playedOn: { lt: helpers.formatAWSDate(endDate) },
    //         ...(startDate && { playedOn: { gt: helpers.formatAWSDate(startDate) } }),
    //         ...(player && {
    //             or: [
    //                 { winnerID: { eq: player.id } },
    //                 { loserID: { eq: player.id } }
    //             ]
    //         }),
    //         ...(ladder && { ladderID: { eq: ladder.id } })
    //     }
    //     //console.log(filter)
    //     const apiData = await API.graphql({
    //         query: findFilter ? findMatches : listMatches,
    //         variables: {
    //             filter: filter,
    //             sort: [{ field: "playedOn", direction: "desc" }]
    //         }
    //     })
    //     //console.log(apiData.data)
    //     const MatchsFromAPI = findFilter ? apiData.data.listMatches.items : apiData.data.searchMatches.items

    //     return MatchsFromAPI;
    // },

    GetComments: async function (matchId) {
        const apiData = await API.graphql({
            query: listComments,
            variables: { filter: { matchID: { eq: matchId } } }
        })
        console.log(apiData.data.listComments.items)
        return apiData.data.listComments.items
    }
}

function scoreToString(score, flipScore) {

    if (!flipScore) return score.filter(Boolean).join(', ')
    let flippedScore = []
    for (const set of score) {
        const games = set.split('-')
        // keep tiebreak score to the right side
        if(games[1].indexOf("(") > 0) {
            games[0] += games[1].substring(games[1].indexOf("("))
            games[1] = games[1].substring(0,games[1].indexOf("("))
        }

        flippedScore.push(games[1] + '-' + games[0])
    }
    return flippedScore.filter(Boolean).join(', ')
}

function setPlayerMatchInput(match, matchID, flipScoreOnLoss, winner) {
    const scoreBreakdown = parseScore(match.score, winner ? flipScoreOnLoss : !flipScoreOnLoss) 
    const playerMatchInput = 
    {
        matchID: matchID,
        playerID: winner ? match.winner.id : match.loser.id,
        opponentID: winner ? match.loser.id : match.winner.id,
        ladderID: match.ladderID,
        playedOn: helpers.formatAWSDate(match.playedOn, 0),
        matchType: match.type,
        win: winner,
        ...scoreBreakdown
    }
    console.log(playerMatchInput)
    return playerMatchInput
}

function parseScore(score, flipScore) {

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
                if (games[1] > games[0] && Math.abs(games[1] - games[0]) === 1)
                    breakdown.tiebreaksLost++
            }

            breakdown.gamesWon += games[0]
            breakdown.gamesLost += games[1]
        }
    })
    if (flipScore)
        breakdown = {
            setsWon: breakdown.setsLost,
            setsLost: breakdown.setsWon,
            gamesWon: breakdown.gamesLost,
            gamesLost: breakdown.gamesWon,
            tiebreaksWon: breakdown.tiebreaksLost,
            tiebreaksLost: breakdown.tiebreaksWon
        }

    return breakdown
}

function setMatchWinnerLoserScore(matches) {
    //console.log(matches)
    matches.map((m) => {
        // set the winner and loser objects
        m.winner = m.win ? m.player : m.opponent
        m.loser = m.win ? m.opponent : m.player
        // flip the score if it's a loss
        if(!m.win) m.score = scoreToString(m.match.score.replace(/\s/g, '').split(','), true)
    })
    return matches
}

export default MatchFunctions;