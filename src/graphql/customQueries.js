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
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
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

export const GetUserStatsOnWin = /* GraphQL */ ` 
query GetUserStatsOnWin($playerId: ID!, $type: String) {
  searchMatches(filter: {
      or: [
        {type: { eq: $type}},
        {type: { exists: false}}
      ],
      winnerID: { eq: $playerId},
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
    aggregateItems {
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

export const GetUserStatsOnLoss = /* GraphQL */ ` 
query GetUserStatsOnLoss($playerId: ID!, $type: String) {
  searchMatches(filter: {
    # or: [
    #       { winnerID: { eq: $playerId } },
    #       { loserID: { eq: $playerId } }
    #     ],
    or: [
        {type: { eq: $type}},
        {type: { exists: false}}
      ],
      loserID: { eq: $playerId}    
    }, 
    aggregates: 
    [
      # {field: winnerID, name: "matchesWon", type: terms},
      # {field: loserID, name: "matchesLost", type: terms},
      {field: setsLost, name: "setsLost", type: sum},
      {field: setsWon, name: "setsWon", type: sum},
      {field: tiebreaksLost, name: "tiebreaksLost", type: sum},
      {field: tiebreaksWon, name: "tiebreaksWon", type: sum},
      {field: gamesLost, name: "gamesLost", type: sum},
      {field: gamesWon, name: "gamesWon", type: sum}
    ]) {
    total
    aggregateItems {
      result {
        ... on SearchableAggregateScalarResult {
          __typename
          value
        }
        # ... on SearchableAggregateBucketResult {
        #   __typename
        #   buckets {
        #     key
        #     doc_count
        #   }
        # }
      }
      name
    }
  }
}
`;
