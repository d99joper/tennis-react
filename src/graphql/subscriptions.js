/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onCreatePlayer(filter: $filter) {
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
          ignoredBy
          createdAt
          updatedAt
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
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onUpdatePlayer(filter: $filter) {
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
          ignoredBy
          createdAt
          updatedAt
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
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onDeletePlayer(filter: $filter) {
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
          ignoredBy
          createdAt
          updatedAt
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
export const onCreatePlayerMatch = /* GraphQL */ `
  subscription OnCreatePlayerMatch(
    $filter: ModelSubscriptionPlayerMatchFilterInput
  ) {
    onCreatePlayerMatch(filter: $filter) {
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
      ignoredBy
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePlayerMatch = /* GraphQL */ `
  subscription OnUpdatePlayerMatch(
    $filter: ModelSubscriptionPlayerMatchFilterInput
  ) {
    onUpdatePlayerMatch(filter: $filter) {
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
      ignoredBy
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePlayerMatch = /* GraphQL */ `
  subscription OnDeletePlayerMatch(
    $filter: ModelSubscriptionPlayerMatchFilterInput
  ) {
    onDeletePlayerMatch(filter: $filter) {
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
      ignoredBy
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch($filter: ModelSubscriptionMatchFilterInput) {
    onCreateMatch(filter: $filter) {
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
          ignoredBy
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      playerMatchesId
    }
  }
`;
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch($filter: ModelSubscriptionMatchFilterInput) {
    onUpdateMatch(filter: $filter) {
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
          ignoredBy
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      playerMatchesId
    }
  }
`;
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch($filter: ModelSubscriptionMatchFilterInput) {
    onDeleteMatch(filter: $filter) {
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
          ignoredBy
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      playerMatchesId
    }
  }
`;
export const onCreateLadder = /* GraphQL */ `
  subscription OnCreateLadder($filter: ModelSubscriptionLadderFilterInput) {
    onCreateLadder(filter: $filter) {
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
          ignoredBy
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
export const onUpdateLadder = /* GraphQL */ `
  subscription OnUpdateLadder($filter: ModelSubscriptionLadderFilterInput) {
    onUpdateLadder(filter: $filter) {
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
          ignoredBy
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
export const onDeleteLadder = /* GraphQL */ `
  subscription OnDeleteLadder($filter: ModelSubscriptionLadderFilterInput) {
    onDeleteLadder(filter: $filter) {
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
          ignoredBy
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
export const onCreateStandings = /* GraphQL */ `
  subscription OnCreateStandings(
    $filter: ModelSubscriptionStandingsFilterInput
  ) {
    onCreateStandings(filter: $filter) {
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
export const onUpdateStandings = /* GraphQL */ `
  subscription OnUpdateStandings(
    $filter: ModelSubscriptionStandingsFilterInput
  ) {
    onUpdateStandings(filter: $filter) {
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
export const onDeleteStandings = /* GraphQL */ `
  subscription OnDeleteStandings(
    $filter: ModelSubscriptionStandingsFilterInput
  ) {
    onDeleteStandings(filter: $filter) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
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
