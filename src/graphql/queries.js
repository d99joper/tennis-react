/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchPlayers = /* GraphQL */ `
  query SearchPlayers(
    $filter: SearchablePlayerFilterInput
    $sort: [SearchablePlayerSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchablePlayerAggregationInput]
  ) {
    searchPlayers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        userGUID
        name
        email
        phone
        about
        image
        NTRP
        UTR
        createdOn
        updatedOn
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
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
export const searchLadders = /* GraphQL */ `
  query SearchLadders(
    $filter: SearchableLadderFilterInput
    $sort: [SearchableLadderSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableLadderAggregationInput]
  ) {
    searchLadders(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        name
        location
        city
        zip
        createdOn
        updatedOn
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
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
export const searchMatches = /* GraphQL */ `
  query SearchMatches(
    $filter: SearchableMatchFilterInput
    $sort: [SearchableMatchSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableMatchAggregationInput]
  ) {
    searchMatches(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        type
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
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
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
export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
    getPlayer(id: $id) {
      id
      userGUID
      name
      email
      phone
      about
      image
      NTRP
      UTR
      matches {
        nextToken
      }
      ladders {
        nextToken
      }
      createdOn
      updatedOn
    }
  }
`;
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userGUID
        name
        email
        phone
        about
        image
        NTRP
        UTR
        createdOn
        updatedOn
      }
      nextToken
    }
  }
`;
export const getLadder = /* GraphQL */ `
  query GetLadder($id: ID!) {
    getLadder(id: $id) {
      id
      name
      location
      city
      zip
      matches {
        nextToken
      }
      players {
        nextToken
      }
      createdOn
      updatedOn
    }
  }
`;
export const listLadders = /* GraphQL */ `
  query ListLadders(
    $filter: ModelLadderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLadders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        location
        city
        zip
        createdOn
        updatedOn
      }
      nextToken
    }
  }
`;
export const getStandings = /* GraphQL */ `
  query GetStandings($id: ID!) {
    getStandings(id: $id) {
      id
      player {
        id
        userGUID
        name
        email
        phone
        about
        image
        NTRP
        UTR
        createdOn
        updatedOn
      }
      ladder {
        id
        name
        location
        city
        zip
        createdOn
        updatedOn
      }
      points
      position
      createdOn
      updatedOn
      standingsPlayerId
      standingsLadderId
    }
  }
`;
export const listStandings = /* GraphQL */ `
  query ListStandings(
    $filter: ModelStandingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStandings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        points
        position
        createdOn
        updatedOn
        standingsPlayerId
        standingsLadderId
      }
      nextToken
    }
  }
`;
export const getMatch = /* GraphQL */ `
  query GetMatch($id: ID!) {
    getMatch(id: $id) {
      id
      type
      playedOn
      winnerID
      winner {
        id
        userGUID
        name
        email
        phone
        about
        image
        NTRP
        UTR
        createdOn
        updatedOn
      }
      loserID
      loser {
        id
        userGUID
        name
        email
        phone
        about
        image
        NTRP
        UTR
        createdOn
        updatedOn
      }
      score
      setsWon
      setsLost
      gamesWon
      gamesLost
      tiebreaksWon
      tiebreaksLost
      retired
      ladderID
      ladder {
        id
        name
        location
        city
        zip
        createdOn
        updatedOn
      }
      comments {
        nextToken
      }
      createdOn
      updatedOn
      playerMatchesId
      ladderMatchesId
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
        type
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
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      matchID
      match {
        id
        type
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
      }
      content
      createdOn
      updatedOn
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        matchID
        content
        createdOn
        updatedOn
      }
      nextToken
    }
  }
`;
export const getLadderPlayer = /* GraphQL */ `
  query GetLadderPlayer($id: ID!) {
    getLadderPlayer(id: $id) {
      id
      playerID
      ladderID
      player {
        id
        userGUID
        name
        email
        phone
        about
        image
        NTRP
        UTR
        createdOn
        updatedOn
      }
      ladder {
        id
        name
        location
        city
        zip
        createdOn
        updatedOn
      }
      createdAt
      updatedAt
    }
  }
`;
export const listLadderPlayers = /* GraphQL */ `
  query ListLadderPlayers(
    $filter: ModelLadderPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLadderPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        playerID
        ladderID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
