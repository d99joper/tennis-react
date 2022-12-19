/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      playedOn
      reportedOn
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
        playedOn
        reportedOn
        score
        setsWon
        setsLost
        gamesWon
        gamesLost
        tiebreaksWon
        tiebreaksLost
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
      createdOn
      match {
        id
        playedOn
        reportedOn
        score
        setsWon
        setsLost
        gamesWon
        gamesLost
        tiebreaksWon
        tiebreaksLost
        createdOn
        updatedOn
        playerMatchesId
        ladderMatchesId
      }
      content
      updatedOn
      matchCommentsId
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
        createdOn
        content
        updatedOn
        matchCommentsId
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
        player {
          name
          id
        }
        playerID
        ladderID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
