export const listLadderPlayersAsObjects = /* GraphQL */ `
    query listLadderPlayersAsObjects(
      $filter: ModelLadderPlayerFilterInput
      $limit: Int
      $nextToken: String
    ) {
      listLadderPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
          id
          player {
            id
            name
          }
          playerID
          ladderID
          ladder {
            id
            name
          }
          createdAt
          updatedAt
        }
        nextToken
      }
    }  
`;

export const listMatches = /* GraphQL */ `
  query ListMatches(
    $filter: SearchableMatchFilterInput #ModelMatchFilterInput
    $sort: [SearchableMatchSortInput]
    $limit: Int
    $nextToken: String
  ) {
    searchMatches(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
      items {
        id
        playedOn
        winnerID
        loserID
        score
        setsWon
        setsLost
        gamesWon
        gamesLost
        tiebreaksWon
        tiebreaksLost
        retired
        ladderID
        createdOn
        updatedOn
        playerMatchesId
        ladderMatchesId
        winner {
          id
          name
        }
        loser {
          id
          name
        }
        ladder {
          id 
          name
        }
      }
      nextToken
    }
  }
`;

export const GetYearsPlayed = /* GraphQL */ `
  query GetYearsPlayed($playerId: ID!, $type: String) {
    searchMatches(filter: {
       and: [
        {or: [
          { winnerID: { eq: $playerId } },
          { loserID: { eq: $playerId } }
        ]},
        {or: [
          { type: { eq: $type}},
          { type: { exists: false}}
        ]}
      ]
    },
    sort: {field: year, direction: desc},
    aggregates: {field: year, name: "year", type: terms}) {
    total
    aggregateItems {
      result {
        ... on SearchableAggregateBucketResult {
          __typename
          buckets {
            key
            doc_count
          }
        }
      }
    }
    } 
  }
`;


export const GetUserStats_All =   /* GraphQL */ ` 
query GetUserStats_All($playerId: ID!, $type: String, $year: Int) {
  losses: searchMatches(filter: 
  {
      and: 
      [
        { or: 
          [
            {type: { eq: $type}},
            {type: { exists: false}}
          ]
        }
        ,
        { loserID: { eq: $playerId }},
        { year: { eq: $year }}
      ]
    },
    aggregates: 
    [
      {field: setsLost, name: "setsWon", type: sum},
      {field: setsWon, name: "setsLost", type: sum},
      {field: tiebreaksLost, name: "tiebreaksWon", type: sum},
      {field: tiebreaksWon, name: "tiebreaksLost", type: sum},
      {field: gamesLost, name: "gamesWon", type: sum},
      {field: gamesWon, name: "gamesLost", type: sum}
    ]) {
    total
    stats: aggregateItems {
      result {
        ... on SearchableAggregateScalarResult {
          __typename
          value
        }
      }
      name
    }
  }
  wins: searchMatches(filter: {
      and: 
      [
        { or: 
          [
            {type: { eq: $type}},
            {type: { exists: false}}
          ]
        }
        ,
        { winnerID: { eq: $playerId }},
        { year: { eq: $year }}
      ]
    },
    aggregates: 
    [
      {field: setsLost, name: "setsLost", type: sum},
      {field: setsWon, name: "setsWon", type: sum},
      {field: tiebreaksLost, name: "tiebreaksLost", type: sum},
      {field: tiebreaksWon, name: "tiebreaksWon", type: sum},
      {field: gamesLost, name: "gamesLost", type: sum},
      {field: gamesWon, name: "gamesWon", type: sum}
    ]) {
    total
    stats: aggregateItems {
      result {
        ... on SearchableAggregateScalarResult {
          __typename
          value
        }
      }
      name
    }
  }
}
`;

export const H2HStats =   /* GraphQL */ ` 
query H2HStats($filter_winner: SearchableMatchFilterInput, $filter_loser: SearchableMatchFilterInput) {
  wins: searchMatches(filter: $filter_winner,
    aggregates: 
    [
      {field: setsLost, name: "setsLost", type: sum},
      {field: setsWon, name: "setsWon", type: sum},
      {field: tiebreaksLost, name: "tiebreaksLost", type: sum},
      {field: tiebreaksWon, name: "tiebreaksWon", type: sum},
      {field: gamesLost, name: "gamesLost", type: sum},
      {field: gamesWon, name: "gamesWon", type: sum}
    ]) {
    total
    items {
      id
      score
      retired
      playedOn
      winner {
        name
        id
      }
      loser {
        name
        id
      }
      ladder {
        id 
        name
      }
      # comments {
      #   content
      #   createdAt
      #   postedBy {
      #     name
      #     id
      #   }
      # }
    }
    stats: aggregateItems {
      result {
        ... on SearchableAggregateScalarResult {
          __typename
          value
        }
      }
      name
    }
  },
  losses: searchMatches(filter: $filter_loser,
    aggregates: 
    [
      {field: setsLost, name: "setsWon", type: sum},
      {field: setsWon, name: "setsLost", type: sum},
      {field: tiebreaksLost, name: "tiebreaksWon", type: sum},
      {field: tiebreaksWon, name: "tiebreaksLost", type: sum},
      {field: gamesLost, name: "gamesWon", type: sum},
      {field: gamesWon, name: "gamesLost", type: sum}
    ]) {
    total
    items {
      id
      score
      retired
      playedOn
      winner {
        name
        id
      }
      loser {
        name
        id
      }
      ladder {
        id 
        name
      }
      # comments {
      #   content
      #   createdAt
      #   postedBy {
      #     name
      #     id
      #   }
      # }
    }
    stats: aggregateItems {
      result {
        ... on SearchableAggregateScalarResult {
          __typename
          value
        }
      }
      name
    }
  }
}
`;

// export const GetUserStatsOnWin = /* GraphQL */ ` 
// query GetUserStatsOnWin($playerId: ID!, $type: String, $year: Int!) {
//   searchMatches(filter: {
//       and: 
//       [
//         { or: 
//           [
//             {type: { eq: $type}},
//             {type: { exists: false}}
//           ]
//         }
//         ,
//         { winnerID: { eq: $playerId }},
//         { year: { eq: $year }}
//       ]
//     },
//     aggregates: 
//     [
//       {field: setsLost, name: "setsLost", type: sum},
//       {field: setsWon, name: "setsWon", type: sum},
//       {field: tiebreaksLost, name: "tiebreaksLost", type: sum},
//       {field: tiebreaksWon, name: "tiebreaksWon", type: sum},
//       {field: gamesLost, name: "gamesLost", type: sum},
//       {field: gamesWon, name: "gamesWon", type: sum}
//     ]) {
//     total
//     aggregateItems {
//       result {
//         ... on SearchableAggregateScalarResult {
//           __typename
//           value
//         }
//       }
//       name
//     }
//   }
// }
// `;

// export const GetUserStatsOnLoss =   /* GraphQL */ ` 
// query GetUserStatsOnLoss($playerId: ID!, $type: String, $year: Int) {
//   searchMatches(filter: {
//       and: 
//       [
//         { or: 
//           [
//             {type: { eq: $type}},
//             {type: { exists: false}}
//           ]
//         }
//         ,
//         { loserID: { eq: $playerId }},
//         { year: { eq: $year }}
//       ]
//     },
//     aggregates: 
//     [
//       # {field: winnerID, name: "matchesWon", type: terms},
//       # {field: loserID, name: "matchesLost", type: terms},
//       {field: setsLost, name: "setsLost", type: sum},
//       {field: setsWon, name: "setsWon", type: sum},
//       {field: tiebreaksLost, name: "tiebreaksLost", type: sum},
//       {field: tiebreaksWon, name: "tiebreaksWon", type: sum},
//       {field: gamesLost, name: "gamesLost", type: sum},
//       {field: gamesWon, name: "gamesWon", type: sum}
//     ]) {
//     total
//     aggregateItems {
//       result {
//         ... on SearchableAggregateScalarResult {
//           __typename
//           value
//         }
//       }
//       name
//     }
//   }
// }
// `;
