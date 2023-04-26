/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const findNearbyLadders = /* GraphQL */ `
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
      nextToken
      total
    }
  }
`;
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
export const searchPlayerMatches = /* GraphQL */ `
  query SearchPlayerMatches(
    $filter: SearchablePlayerMatchFilterInput
    $sort: [SearchablePlayerMatchSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchablePlayerMatchAggregationInput]
  ) {
    searchPlayerMatches(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
      total
    }
  }
`;
export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
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
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $id: ID
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPlayers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
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
      nextToken
    }
  }
`;
export const getPlayerMatch = /* GraphQL */ `
  query GetPlayerMatch($playerID: ID!, $matchID: ID!) {
    getPlayerMatch(playerID: $playerID, matchID: $matchID) {
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
export const listPlayerMatches = /* GraphQL */ `
  query ListPlayerMatches(
    $playerID: ID
    $matchID: ModelIDKeyConditionInput
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPlayerMatches(
      playerID: $playerID
      matchID: $matchID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
export const listMatches = /* GraphQL */ `
  query ListMatches(
    $id: ID
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMatches(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
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
      nextToken
    }
  }
`;
export const getLadder = /* GraphQL */ `
  query GetLadder($id: ID!) {
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
export const listLadders = /* GraphQL */ `
  query ListLadders(
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
      nextToken
    }
  }
`;
export const getStandings = /* GraphQL */ `
  query GetStandings($id: ID!) {
    getStandings(id: $id) {
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
export const listStandings = /* GraphQL */ `
  query ListStandings(
    $id: ID
    $filter: ModelStandingsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listStandings(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $id: ID
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listComments(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        matchID
        match {
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
          isAdmin
          createdAt
          updatedAt
        }
        postedOn
        private
        createdAt
        updatedAt
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
          isAdmin
          createdAt
          updatedAt
        }
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
      nextToken
    }
  }
`;
export const playerByEmail = /* GraphQL */ `
  query PlayerByEmail(
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
      nextToken
    }
  }
`;
export const getPlayerMatchByPlayer = /* GraphQL */ `
  query GetPlayerMatchByPlayer(
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
    }
  }
`;
export const getPlayerMatchByPlayerVs = /* GraphQL */ `
  query GetPlayerMatchByPlayerVs(
    $playerID: ID!
    $opponentIDMatchType: ModelPlayerMatchByPlayerVsCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByPlayerVs(
      playerID: $playerID
      opponentIDMatchType: $opponentIDMatchType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
    }
  }
`;
export const getPlayerMatchByPlayerWithPartner = /* GraphQL */ `
  query GetPlayerMatchByPlayerWithPartner(
    $playerID: ID!
    $partnerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByPlayerWithPartner(
      playerID: $playerID
      partnerID: $partnerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
    }
  }
`;
export const getPlayerMatchByPlayerDoublesOpponentPartner = /* GraphQL */ `
  query GetPlayerMatchByPlayerDoublesOpponentPartner(
    $playerID: ID!
    $opponentPartnerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByPlayerDoublesOpponentPartner(
      playerID: $playerID
      opponentPartnerID: $opponentPartnerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
    }
  }
`;
export const getPlayerMatchByMatchID = /* GraphQL */ `
  query GetPlayerMatchByMatchID(
    $matchID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByMatchID(
      matchID: $matchID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
    }
  }
`;
export const getPlayerMatchByMatchType = /* GraphQL */ `
  query GetPlayerMatchByMatchType(
    $matchType: matchType!
    $playerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByMatchType(
      matchType: $matchType
      playerID: $playerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
    }
  }
`;
export const getPlayerMatchByLadder = /* GraphQL */ `
  query GetPlayerMatchByLadder(
    $ladderID: ID!
    $playerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByLadder(
      ladderID: $ladderID
      playerID: $playerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          loserID
          score
          ladderID
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
          city
          zip
          standingsID
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
      nextToken
    }
  }
`;
export const getMatchByDetails = /* GraphQL */ `
  query GetMatchByDetails(
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
      nextToken
    }
  }
`;
export const getMatchByLadderID = /* GraphQL */ `
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
      nextToken
    }
  }
`;
export const standingsByLadder = /* GraphQL */ `
  query StandingsByLadder(
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
      nextToken
    }
  }
`;
export const getCommentsByMatch = /* GraphQL */ `
  query GetCommentsByMatch(
    $matchID: ID!
    $postedOn: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCommentsByMatch(
      matchID: $matchID
      postedOn: $postedOn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        matchID
        match {
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
          isAdmin
          createdAt
          updatedAt
        }
        postedOn
        private
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCommentsByPlayer = /* GraphQL */ `
  query GetCommentsByPlayer(
    $postedByID: ID!
    $postedOn: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCommentsByPlayer(
      postedByID: $postedByID
      postedOn: $postedOn
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        matchID
        match {
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
          isAdmin
          createdAt
          updatedAt
        }
        postedOn
        private
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
