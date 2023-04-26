/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPlayer = /* GraphQL */ `
  mutation CreatePlayer(
    $input: CreatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    createPlayer(input: $input, condition: $condition) {
      id
      name
      email
      phone
      about
      image
      NTRP
      UTR
      verified
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      matches {
        items {
          id
          type
          playedOn
          year
          winnerID
          loserID
          score
          ladderID
          createdAt
          updatedAt
          playerMatchesId
        }
        nextToken
      }
      ladders {
        items {
          id
          playerID
          ladderID
          createdAt
          updatedAt
        }
        nextToken
      }
      comments {
        items {
          id
          matchID
          content
          postedByID
          postedOn
          private
          createdAt
          updatedAt
        }
        nextToken
      }
      isAdmin
      createdAt
      updatedAt
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
      name
      email
      phone
      about
      image
      NTRP
      UTR
      verified
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      matches {
        items {
          id
          type
          playedOn
          year
          winnerID
          loserID
          score
          ladderID
          createdAt
          updatedAt
          playerMatchesId
        }
        nextToken
      }
      ladders {
        items {
          id
          playerID
          ladderID
          createdAt
          updatedAt
        }
        nextToken
      }
      comments {
        items {
          id
          matchID
          content
          postedByID
          postedOn
          private
          createdAt
          updatedAt
        }
        nextToken
      }
      isAdmin
      createdAt
      updatedAt
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
      name
      email
      phone
      about
      image
      NTRP
      UTR
      verified
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      matches {
        items {
          id
          type
          playedOn
          year
          winnerID
          loserID
          score
          ladderID
          createdAt
          updatedAt
          playerMatchesId
        }
        nextToken
      }
      ladders {
        items {
          id
          playerID
          ladderID
          createdAt
          updatedAt
        }
        nextToken
      }
      comments {
        items {
          id
          matchID
          content
          postedByID
          postedOn
          private
          createdAt
          updatedAt
        }
        nextToken
      }
      isAdmin
      createdAt
      updatedAt
    }
  }
`;
export const createPlayerMatch = /* GraphQL */ `
  mutation CreatePlayerMatch(
    $input: CreatePlayerMatchInput!
    $condition: ModelPlayerMatchConditionInput
  ) {
    createPlayerMatch(input: $input, condition: $condition) {
      player {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      playerID
      partner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      partnerID
      opponent {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      opponentID
      opponentPartner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      opponentPartnerID
      match {
        id
        type
        playedOn
        year
        winnerID
        winner {
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
          createdAt
          updatedAt
        }
        loserID
        loser {
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        playerMatches {
          nextToken
        }
        createdAt
        updatedAt
        playerMatchesId
      }
      matchID
      matchType
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      ladderID
      win
      setsWon
      setsLost
      gamesWon
      gamesLost
      tiebreaksWon
      tiebreaksLost
      retired
      playedOn
      createdAt
      updatedAt
      playerPlayerMatchesId
    }
  }
`;
export const updatePlayerMatch = /* GraphQL */ `
  mutation UpdatePlayerMatch(
    $input: UpdatePlayerMatchInput!
    $condition: ModelPlayerMatchConditionInput
  ) {
    updatePlayerMatch(input: $input, condition: $condition) {
      player {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      playerID
      partner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      partnerID
      opponent {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      opponentID
      opponentPartner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      opponentPartnerID
      match {
        id
        type
        playedOn
        year
        winnerID
        winner {
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
          createdAt
          updatedAt
        }
        loserID
        loser {
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        playerMatches {
          nextToken
        }
        createdAt
        updatedAt
        playerMatchesId
      }
      matchID
      matchType
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      ladderID
      win
      setsWon
      setsLost
      gamesWon
      gamesLost
      tiebreaksWon
      tiebreaksLost
      retired
      playedOn
      createdAt
      updatedAt
      playerPlayerMatchesId
    }
  }
`;
export const deletePlayerMatch = /* GraphQL */ `
  mutation DeletePlayerMatch(
    $input: DeletePlayerMatchInput!
    $condition: ModelPlayerMatchConditionInput
  ) {
    deletePlayerMatch(input: $input, condition: $condition) {
      player {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      playerID
      partner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      partnerID
      opponent {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      opponentID
      opponentPartner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      opponentPartnerID
      match {
        id
        type
        playedOn
        year
        winnerID
        winner {
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
          createdAt
          updatedAt
        }
        loserID
        loser {
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        playerMatches {
          nextToken
        }
        createdAt
        updatedAt
        playerMatchesId
      }
      matchID
      matchType
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      ladderID
      win
      setsWon
      setsLost
      gamesWon
      gamesLost
      tiebreaksWon
      tiebreaksLost
      retired
      playedOn
      createdAt
      updatedAt
      playerPlayerMatchesId
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
      type
      playedOn
      year
      winnerID
      winner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      loserID
      loser {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      score
      ladderID
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      comments {
        items {
          id
          matchID
          content
          postedByID
          postedOn
          private
          createdAt
          updatedAt
        }
        nextToken
      }
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      createdAt
      updatedAt
      playerMatchesId
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
      type
      playedOn
      year
      winnerID
      winner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      loserID
      loser {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      score
      ladderID
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      comments {
        items {
          id
          matchID
          content
          postedByID
          postedOn
          private
          createdAt
          updatedAt
        }
        nextToken
      }
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      createdAt
      updatedAt
      playerMatchesId
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
      type
      playedOn
      year
      winnerID
      winner {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      loserID
      loser {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      score
      ladderID
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      comments {
        items {
          id
          matchID
          content
          postedByID
          postedOn
          private
          createdAt
          updatedAt
        }
        nextToken
      }
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      createdAt
      updatedAt
      playerMatchesId
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
        items {
          id
          type
          playedOn
          year
          winnerID
          loserID
          score
          ladderID
          createdAt
          updatedAt
          playerMatchesId
        }
        nextToken
      }
      players {
        items {
          id
          playerID
          ladderID
          createdAt
          updatedAt
        }
        nextToken
      }
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      standingsID
      standings {
        id
        details
        postedOn
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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
        items {
          id
          type
          playedOn
          year
          winnerID
          loserID
          score
          ladderID
          createdAt
          updatedAt
          playerMatchesId
        }
        nextToken
      }
      players {
        items {
          id
          playerID
          ladderID
          createdAt
          updatedAt
        }
        nextToken
      }
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      standingsID
      standings {
        id
        details
        postedOn
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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
        items {
          id
          type
          playedOn
          year
          winnerID
          loserID
          score
          ladderID
          createdAt
          updatedAt
          playerMatchesId
        }
        nextToken
      }
      players {
        items {
          id
          playerID
          ladderID
          createdAt
          updatedAt
        }
        nextToken
      }
      playerMatches {
        items {
          playerID
          partnerID
          opponentID
          opponentPartnerID
          matchID
          matchType
          ladderID
          win
          setsWon
          setsLost
          gamesWon
          gamesLost
          tiebreaksWon
          tiebreaksLost
          retired
          playedOn
          createdAt
          updatedAt
          playerPlayerMatchesId
        }
        nextToken
      }
      standingsID
      standings {
        id
        details
        postedOn
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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
      details
      postedOn
      ladderID
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      createdAt
      updatedAt
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
      details
      postedOn
      ladderID
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      createdAt
      updatedAt
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
      details
      postedOn
      ladderID
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      createdAt
      updatedAt
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
      matchID
      match {
        id
        type
        playedOn
        year
        winnerID
        winner {
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
          createdAt
          updatedAt
        }
        loserID
        loser {
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        playerMatches {
          nextToken
        }
        createdAt
        updatedAt
        playerMatchesId
      }
      content
      postedByID
      postedBy {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      postedOn
      private
      createdAt
      updatedAt
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
      matchID
      match {
        id
        type
        playedOn
        year
        winnerID
        winner {
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
          createdAt
          updatedAt
        }
        loserID
        loser {
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        playerMatches {
          nextToken
        }
        createdAt
        updatedAt
        playerMatchesId
      }
      content
      postedByID
      postedBy {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      postedOn
      private
      createdAt
      updatedAt
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
      matchID
      match {
        id
        type
        playedOn
        year
        winnerID
        winner {
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
          createdAt
          updatedAt
        }
        loserID
        loser {
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          description
          city
          zip
          standingsID
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        playerMatches {
          nextToken
        }
        createdAt
        updatedAt
        playerMatchesId
      }
      content
      postedByID
      postedBy {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      postedOn
      private
      createdAt
      updatedAt
    }
  }
`;
export const createLadderPlayer = /* GraphQL */ `
  mutation CreateLadderPlayer(
    $input: CreateLadderPlayerInput!
    $condition: ModelLadderPlayerConditionInput
  ) {
    createLadderPlayer(input: $input, condition: $condition) {
      id
      playerID
      ladderID
      player {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      createdAt
      updatedAt
    }
  }
`;
export const updateLadderPlayer = /* GraphQL */ `
  mutation UpdateLadderPlayer(
    $input: UpdateLadderPlayerInput!
    $condition: ModelLadderPlayerConditionInput
  ) {
    updateLadderPlayer(input: $input, condition: $condition) {
      id
      playerID
      ladderID
      player {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteLadderPlayer = /* GraphQL */ `
  mutation DeleteLadderPlayer(
    $input: DeleteLadderPlayerInput!
    $condition: ModelLadderPlayerConditionInput
  ) {
    deleteLadderPlayer(input: $input, condition: $condition) {
      id
      playerID
      ladderID
      player {
        id
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
        playerMatches {
          nextToken
        }
        matches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
        isAdmin
        createdAt
        updatedAt
      }
      ladder {
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
          nextToken
        }
        players {
          nextToken
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
      createdAt
      updatedAt
    }
  }
`;
