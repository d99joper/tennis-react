/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onCreatePlayer(filter: $filter) {
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
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onUpdatePlayer(filter: $filter) {
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
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onDeletePlayer(filter: $filter) {
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
export const onCreateLadder = /* GraphQL */ `
  subscription OnCreateLadder($filter: ModelSubscriptionLadderFilterInput) {
    onCreateLadder(filter: $filter) {
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
export const onUpdateLadder = /* GraphQL */ `
  subscription OnUpdateLadder($filter: ModelSubscriptionLadderFilterInput) {
    onUpdateLadder(filter: $filter) {
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
export const onDeleteLadder = /* GraphQL */ `
  subscription OnDeleteLadder($filter: ModelSubscriptionLadderFilterInput) {
    onDeleteLadder(filter: $filter) {
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
export const onCreateStandings = /* GraphQL */ `
  subscription OnCreateStandings(
    $filter: ModelSubscriptionStandingsFilterInput
  ) {
    onCreateStandings(filter: $filter) {
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
export const onUpdateStandings = /* GraphQL */ `
  subscription OnUpdateStandings(
    $filter: ModelSubscriptionStandingsFilterInput
  ) {
    onUpdateStandings(filter: $filter) {
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
export const onDeleteStandings = /* GraphQL */ `
  subscription OnDeleteStandings(
    $filter: ModelSubscriptionStandingsFilterInput
  ) {
    onDeleteStandings(filter: $filter) {
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
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch($filter: ModelSubscriptionMatchFilterInput) {
    onCreateMatch(filter: $filter) {
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
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch($filter: ModelSubscriptionMatchFilterInput) {
    onUpdateMatch(filter: $filter) {
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
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch($filter: ModelSubscriptionMatchFilterInput) {
    onDeleteMatch(filter: $filter) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
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
export const onCreateLadderPlayer = /* GraphQL */ `
  subscription OnCreateLadderPlayer(
    $filter: ModelSubscriptionLadderPlayerFilterInput
  ) {
    onCreateLadderPlayer(filter: $filter) {
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
export const onUpdateLadderPlayer = /* GraphQL */ `
  subscription OnUpdateLadderPlayer(
    $filter: ModelSubscriptionLadderPlayerFilterInput
  ) {
    onUpdateLadderPlayer(filter: $filter) {
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
export const onDeleteLadderPlayer = /* GraphQL */ `
  subscription OnDeleteLadderPlayer(
    $filter: ModelSubscriptionLadderPlayerFilterInput
  ) {
    onDeleteLadderPlayer(filter: $filter) {
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
