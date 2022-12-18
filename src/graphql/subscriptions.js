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
      ladderPlayersId
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
      ladderPlayersId
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
      ladderPlayersId
    }
  }
`;
export const onCreateLadder = /* GraphQL */ `
  subscription OnCreateLadder($filter: ModelSubscriptionLadderFilterInput) {
    onCreateLadder(filter: $filter) {
      id
      name
      location
      matches {
        nextToken
      }
      players {
        nextToken
      }
      createdOn
      updatedOn
      playerLaddersId
    }
  }
`;
export const onUpdateLadder = /* GraphQL */ `
  subscription OnUpdateLadder($filter: ModelSubscriptionLadderFilterInput) {
    onUpdateLadder(filter: $filter) {
      id
      name
      location
      matches {
        nextToken
      }
      players {
        nextToken
      }
      createdOn
      updatedOn
      playerLaddersId
    }
  }
`;
export const onDeleteLadder = /* GraphQL */ `
  subscription OnDeleteLadder($filter: ModelSubscriptionLadderFilterInput) {
    onDeleteLadder(filter: $filter) {
      id
      name
      location
      matches {
        nextToken
      }
      players {
        nextToken
      }
      createdOn
      updatedOn
      playerLaddersId
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
        ladderPlayersId
      }
      ladder {
        id
        name
        location
        createdOn
        updatedOn
        playerLaddersId
      }
      points
      position
      createdOn
      updatedOn
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
        ladderPlayersId
      }
      ladder {
        id
        name
        location
        createdOn
        updatedOn
        playerLaddersId
      }
      points
      position
      createdOn
      updatedOn
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
        ladderPlayersId
      }
      ladder {
        id
        name
        location
        createdOn
        updatedOn
        playerLaddersId
      }
      points
      position
      createdOn
      updatedOn
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
        ladderPlayersId
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
        ladderPlayersId
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
        createdOn
        updatedOn
        playerLaddersId
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
        ladderPlayersId
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
        ladderPlayersId
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
        createdOn
        updatedOn
        playerLaddersId
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
        ladderPlayersId
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
        ladderPlayersId
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
        createdOn
        updatedOn
        playerLaddersId
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
