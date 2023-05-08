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
            players {
              items {id}
            }
            level {min max}
            location {lon lat}
            description
            matchType
            matches {
              items {id}
            }
          }
          createdAt
          updatedAt
        }
        nextToken
      }
    }  
`;

export const qCheckIfPlayerInLadder = /* GraphQL */ `
  query qCheckIfPlayerInLadder(
    $filter: ModelLadderPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLadderPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
    }
  }
`;

export const qGetStandingsDetails = /* GraphQL */ `
  query qGetStandingsDetails($id: ID!) {
    getStandings(id: $id) {
      details
      id
      ladderID
      postedOn
    }
  }
`;
export const qfindNearbyLadders = /* GraphQL */ `
  query FindNearbyLadders($input: FindNearbyLaddersInput!) {
    findNearbyLadders(input: $input) {
      items {
        id
        matchType
        name
        description
        level {
          min
          max
        }
        location {
          lat
          lon
        }
        city
        zip
        matches {
          items { id } 
        }
        players {
          items { id }
        }
        playerMatches {
          nextToken
        }
        standingsID
        standings {
          id
          details
          postedOn
          ladderID
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;

export const qStandingsByLadder = /* GraphQL */ `
query qStandingsByLadder(
    $ladderID: ID!
    $postedOn: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    standingsByLadder(
      ladderID: $ladderID
      postedOn: $postedOn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        postedOn
        ladderID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const qGetPlayer = /* GraphQL */ `
  query qGetPlayer($id: ID!) {
    getPlayer(id: $id) {
      id
      name
      email
      phone
      about
      image
      NTRP
      UTR
      verified
      isAdmin
      ladders {
        items {
          ladder {
            id
            name
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const qGetUnlinkedMatches = /* GraphQL */ `
query qGetPlayerByEmail(
  $email: AWSEmail!
  $name: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
) {
  playerByEmail(
    email: $email
    name: $name
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      email
      id
      name
      playerMatches {
        items {
          playerID
          match {
            id
            score
            playedOn
            type
            winner {
              id
              email
              image
              name
            }
            loser {
              id
              email
              image
              name
            }
            ladder {
              id
              name
            }
          }
        }
    }
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;

export const qGetPlayerByEmail = /* GraphQL */ `
  query qGetPlayerByEmail(
    $email: AWSEmail!
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerByEmail(
      email: $email
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        isAdmin
        ladders {
          items {
            ladder {
              id
              name
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const qGetLadder = /* GraphQL */ `
  query qGetLadder(
    $id: ID! 
    $matchLimit: Int=5
    $nextMatchesToken: String
  ) {
    getLadder(id: $id) {
      id
      matchType
      name
      description
      level {
        min
        max
      }
      location {
        lat
        lon
      }
      city
      zip
      matches(limit: $matchLimit, sortDirection: DESC, nextToken: $nextMatchesToken) {
        items {
          id
          type
          playedOn
          year
          winner {
            id
            name
            image
          }
          winnerID
          ladder {
            id
            name
          }
          loser {
            id
            name
            image
          }
          loserID
          score
          ladderID
          createdAt
          updatedAt
        }
        nextToken
      }
      standingsID
      standings {
        id
        details
        postedOn
        ladderID
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const qListLadders = /* GraphQL */ `
  query qListLadders(
    $id: ID
    $filter: ModelLadderFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLadders(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        matchType
        name
        description
        level {
          min
          max
        }
        location {
          lat
          lon
        }
        city
        zip
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const qGetMatchByLadderID = /* GraphQL */ `
  query GetMatchByLadderID(
    $ladderID: ID!
    $playedOn: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getMatchByLadderID(
      ladderID: $ladderID
      playedOn: $playedOn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        playedOn
        year
        winnerID
        winner {
          id
          name
          image
        }
        loserID
        loser {
          id
          name
          image
        }
        score
      }
      nextToken
    }
  }
`;

export const listOtherPlayersAsObjects = /* GraphQL */ `
    query listOtherPlayersAsObjects(
      $filter: SearchablePlayerFilterInput
      $sort: [SearchablePlayerSortInput]
      $limit: Int
      $nextToken: String
    ) {
      searchPlayers(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
        items {
          id
          name
          createdAt
          updatedAt
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

export const GetUserStatsByYear =   /* GraphQL */ ` 
query GetUserStatsByYear($playerId: ID!, $type: String!, $startDate: String, $endDate: String) {
  result: searchPlayerMatches(filter: {
      playerID: {eq: $playerId}, 
      playedOn: {range: [$startDate, $endDate]}
      matchType: {eq: $type}
    }, 
    aggregates: [
      {field: setsLost, name: "setsLost", type: sum},
      {field: setsWon, name: "setsWon", type: sum},
      {field: tiebreaksLost, name: "tiebreaksLost", type: sum},
      {field: tiebreaksWon, name: "tiebreaksWon", type: sum},
      {field: gamesLost, name: "gamesLost", type: sum},
      {field: gamesWon, name: "gamesWon", type: sum},
      {field: win, name: "wins", type: terms}
    ]
  ) {
    nextToken
    total
    stats: aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          __typename
          value
        }
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

export const H2HStats =   /* GraphQL */ ` 
query H2HStats($filter: SearchablePlayerMatchFilterInput) {
  result: searchPlayerMatches(
    filter: $filter,
    sort: {direction: desc, field: playedOn}
    aggregates: 
    [
      {field: setsLost, name: "setsLost", type: sum},
      {field: setsWon, name: "setsWon", type: sum},
      {field: tiebreaksLost, name: "tiebreaksLost", type: sum},
      {field: tiebreaksWon, name: "tiebreaksWon", type: sum},
      {field: gamesLost, name: "gamesLost", type: sum},
      {field: gamesWon, name: "gamesWon", type: sum},
      {field: win, name: "wins", type: terms}
    ]) {
    total
    matches: items {
      match {
        id
        winnerID
        loserID
        score
        playedOn
        ladder {
          name
        }
      }
    }
    stats: aggregateItems {
      result {
        ... on SearchableAggregateScalarResult {
          __typename
          value
        }
        ... on SearchableAggregateBucketResult {
          __typename
          buckets {
            doc_count
            key
          }
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
export const qFindMatchByDetails = /* GraphQL */ `
  query qFindMatchByDetails(
    $winnerID: ID!
    $loserIDTypeLadderIDPlayedOnScore: ModelMatchByMatchDetailsCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getMatchByDetails(
      winnerID: $winnerID
      loserIDTypeLadderIDPlayedOnScore: $loserIDTypeLadderIDPlayedOnScore
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
      }
    }
  }
`;
export const qGetPlayerMatchByPlayer = /* GraphQL */ `
  query qGetPlayerMatchByPlayer(
    $playerID: ID!
    $playedOn: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByPlayer(
      playerID: $playerID
      playedOn: $playedOn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        match {
          id
          type
          playedOn
          year
          winnerID
          winner {
            id
            name
          }
          loserID
          loser {
            id
            name
          }
          score
          ladderID
          ladder {
            id
            name
          }
          createdAt
          updatedAt
          playerMatchesId
        }
        matchID
        matchType
        win
        retired
        playedOn
        
      }
      nextToken
    }
  }
`;
export const mUpdatePlayer = /* GraphQL */ `
  mutation mUpdatePlayer(
    $input: UpdatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    updatePlayer(input: $input, condition: $condition) {
      id
      name
      email
      phone
      about
      image
      NTRP
      UTR
      verified
      ladders {
        items {
          id
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
      createdAt
      updatedAt
    }
  }
`;