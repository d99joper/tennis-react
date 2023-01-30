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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
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
        geoData {
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
export const searchComments = /* GraphQL */ `
  query SearchComments(
    $filter: SearchableCommentFilterInput
    $sort: [SearchableCommentSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableCommentAggregationInput]
  ) {
    searchComments(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
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
          ladderMatchesId
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
          createdAt
          updatedAt
        }
        postedOn
        private
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
export const searchStandings = /* GraphQL */ `
  query SearchStandings(
    $filter: SearchableStandingsFilterInput
    $sort: [SearchableStandingsSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableStandingsAggregationInput]
  ) {
    searchStandings(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        playerID
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
          createdAt
          updatedAt
        }
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
          createdAt
          updatedAt
        }
        wins
        losses
        points
        position
        isCurrent
        createdAt
        updatedAt
        standingsPlayerId
        standingsLadderId
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
          matchPlayerMatchesId
          ladderPlayerMatchesId
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
          ladderMatchesId
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
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
        ladderMatchesId
      }
      matchID
      matchType
      ladder {
        id
        matchType
        name
        geoData {
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
      matchPlayerMatchesId
      ladderPlayerMatchesId
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
        createdAt
        updatedAt
      }
      score
      ladderID
      ladder {
        id
        matchType
        name
        geoData {
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
          matchPlayerMatchesId
          ladderPlayerMatchesId
        }
        nextToken
      }
      createdAt
      updatedAt
      playerMatchesId
      ladderMatchesId
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
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
        ladderMatchesId
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
      geoData {
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
          ladderMatchesId
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
          matchPlayerMatchesId
          ladderPlayerMatchesId
        }
        nextToken
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
        geoData {
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
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
        ladderMatchesId
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
          ladderMatchesId
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
export const getStandings = /* GraphQL */ `
  query GetStandings($id: ID!) {
    getStandings(id: $id) {
      id
      playerID
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
        createdAt
        updatedAt
      }
      ladderID
      ladder {
        id
        matchType
        name
        geoData {
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
        createdAt
        updatedAt
      }
      wins
      losses
      points
      position
      isCurrent
      createdAt
      updatedAt
      standingsPlayerId
      standingsLadderId
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
        playerID
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
          createdAt
          updatedAt
        }
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
          createdAt
          updatedAt
        }
        wins
        losses
        points
        position
        isCurrent
        createdAt
        updatedAt
        standingsPlayerId
        standingsLadderId
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
        createdAt
        updatedAt
      }
      ladder {
        id
        matchType
        name
        geoData {
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
          createdAt
          updatedAt
        }
        ladder {
          id
          matchType
          name
          city
          zip
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const getPlayerMatchByPartner = /* GraphQL */ `
  query GetPlayerMatchByPartner(
    $partnerID: ID!
    $playerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByPartner(
      partnerID: $partnerID
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const getPlayerMatchByOpponent = /* GraphQL */ `
  query GetPlayerMatchByOpponent(
    $opponentID: ID!
    $playerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByOpponent(
      opponentID: $opponentID
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const getPlayerMatchByMatchType = /* GraphQL */ `
  query GetPlayerMatchByMatchType(
    $matchType: matchType!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPlayerMatchByMatchType(
      matchType: $matchType
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
          ladderMatchesId
        }
        matchID
        matchType
        ladder {
          id
          matchType
          name
          city
          zip
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
        matchPlayerMatchesId
        ladderPlayerMatchesId
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
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
        ladderMatchesId
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
          createdAt
          updatedAt
        }
        score
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
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
        ladderMatchesId
      }
      nextToken
    }
  }
`;
export const getLadderByName = /* GraphQL */ `
  query GetLadderByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelLadderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getLadderByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        matchType
        name
        geoData {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLadderByCity = /* GraphQL */ `
  query GetLadderByCity(
    $city: String!
    $zip: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelLadderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getLadderByCity(
      city: $city
      zip: $zip
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        matchType
        name
        geoData {
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
          ladderMatchesId
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
          ladderMatchesId
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
export const getStandingsByPlayerID = /* GraphQL */ `
  query GetStandingsByPlayerID(
    $playerID: ID!
    $ladderIDIsCurrent: ModelStandingsByPlayerIDCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStandingsByPlayerID(
      playerID: $playerID
      ladderIDIsCurrent: $ladderIDIsCurrent
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        playerID
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
          createdAt
          updatedAt
        }
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
          createdAt
          updatedAt
        }
        wins
        losses
        points
        position
        isCurrent
        createdAt
        updatedAt
        standingsPlayerId
        standingsLadderId
      }
      nextToken
    }
  }
`;
export const getStandingsByLadderID = /* GraphQL */ `
  query GetStandingsByLadderID(
    $ladderID: ID!
    $isCurrent: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getStandingsByLadderID(
      ladderID: $ladderID
      isCurrent: $isCurrent
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        playerID
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
          createdAt
          updatedAt
        }
        ladderID
        ladder {
          id
          matchType
          name
          city
          zip
          createdAt
          updatedAt
        }
        wins
        losses
        points
        position
        isCurrent
        createdAt
        updatedAt
        standingsPlayerId
        standingsLadderId
      }
      nextToken
    }
  }
`;
