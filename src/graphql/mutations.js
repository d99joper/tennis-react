/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPlayer = /* GraphQL */ `
  mutation CreatePlayer(
    $input: CreatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    createPlayer(input: $input, condition: $condition) {
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
export const updatePlayer = /* GraphQL */ `
  mutation UpdatePlayer(
    $input: UpdatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    updatePlayer(input: $input, condition: $condition) {
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
export const deletePlayer = /* GraphQL */ `
  mutation DeletePlayer(
    $input: DeletePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    deletePlayer(input: $input, condition: $condition) {
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
export const createLadder = /* GraphQL */ `
  mutation CreateLadder(
    $input: CreateLadderInput!
    $condition: ModelLadderConditionInput
  ) {
    createLadder(input: $input, condition: $condition) {
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
export const updateLadder = /* GraphQL */ `
  mutation UpdateLadder(
    $input: UpdateLadderInput!
    $condition: ModelLadderConditionInput
  ) {
    updateLadder(input: $input, condition: $condition) {
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
export const deleteLadder = /* GraphQL */ `
  mutation DeleteLadder(
    $input: DeleteLadderInput!
    $condition: ModelLadderConditionInput
  ) {
    deleteLadder(input: $input, condition: $condition) {
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
export const createStandings = /* GraphQL */ `
  mutation CreateStandings(
    $input: CreateStandingsInput!
    $condition: ModelStandingsConditionInput
  ) {
    createStandings(input: $input, condition: $condition) {
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
export const updateStandings = /* GraphQL */ `
  mutation UpdateStandings(
    $input: UpdateStandingsInput!
    $condition: ModelStandingsConditionInput
  ) {
    updateStandings(input: $input, condition: $condition) {
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
export const deleteStandings = /* GraphQL */ `
  mutation DeleteStandings(
    $input: DeleteStandingsInput!
    $condition: ModelStandingsConditionInput
  ) {
    deleteStandings(input: $input, condition: $condition) {
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
export const createMatch = /* GraphQL */ `
  mutation CreateMatch(
    $input: CreateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    createMatch(input: $input, condition: $condition) {
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
export const updateMatch = /* GraphQL */ `
  mutation UpdateMatch(
    $input: UpdateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    updateMatch(input: $input, condition: $condition) {
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
export const deleteMatch = /* GraphQL */ `
  mutation DeleteMatch(
    $input: DeleteMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    deleteMatch(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
