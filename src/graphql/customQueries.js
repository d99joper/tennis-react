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
            image
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

export const listOtherPlayersAsObjects = /* GraphQL */ `
    query listOtherPlayersAsObjects(
      $filter: SearchablePlayerFilterInput
      $limit: Int
      $nextToken: String
    ) {
      searchPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
          id
          name
          createdOn
          updatedOn
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
          image
        }
        loser {
          id
          name
          image
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
fragment matchFrag on Match {
  id
      score
      retired
      playedOn
      winner {
        name
        id
        image
      }
      loser {
        name
        id
        image
      }
      ladder {
        id 
        name
      }
}
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
      ... matchFrag
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
      ... matchFrag
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

// Try ALL rivaleries using terms and buckets for winners, losers. Then merge and sort
export const GetGreatestRivals =   /* GraphQL */ ` 
query GetGreatestRivals(
        $filter_winner: SearchableMatchFilterInput
        $filter_loser: SearchableMatchFilterInput
        $limit: Int          
        $nextToken: String) {
  wins: searchMatches(filter: $filter_winner, limit: $limit, nextToken: $nextToken
    aggregates: 
    [
      {field: loserID, name: "wonOver", type: terms}
    ]) {
    players: aggregateItems {
      result {
        ... on SearchableAggregateBucketResult {
          __typename
          buckets {
            doc_count
            key
          }
        }
      }
    }
  },
  losses: searchMatches(filter: $filter_loser, limit: $limit, nextToken: $nextToken
    aggregates: 
    [
      {field: winnerID, name: "lostTo", type: terms}
    ]) {
    players: aggregateItems {
      result {
        ... on SearchableAggregateBucketResult {
          __typename
          buckets {
            doc_count
            key
          }
        }
      }
    }
  }
}
`;
