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
<<<<<<< HEAD
        playerMatches {
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
=======
        createdOn
        updatedOn
>>>>>>> origin/staging
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
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/staging
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
<<<<<<< HEAD
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
        createdAt
        updatedAt
        playerPlayerMatchesId
=======
        id
        name
        location
        city
        zip
        createdOn
        updatedOn
>>>>>>> origin/staging
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
<<<<<<< HEAD
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
        createdAt
        updatedAt
=======
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
>>>>>>> origin/staging
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
<<<<<<< HEAD
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
=======
>>>>>>> origin/staging
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
<<<<<<< HEAD
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
          createdAt
          updatedAt
          playerPlayerMatchesId
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
=======
      matches {
        nextToken
      }
      ladders {
        nextToken
      }
      comments {
        nextToken
      }
      createdOn
      updatedOn
>>>>>>> origin/staging
    }
  }
`;
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
<<<<<<< HEAD
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
=======
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
>>>>>>> origin/staging
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
<<<<<<< HEAD
        playerMatches {
          nextToken
        }
        ladders {
          nextToken
        }
        comments {
          nextToken
        }
=======
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
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
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
        createdOn
        updatedOn
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
        year
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
        year
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
        createdOn
        updatedOn
      }
      postedOn
      private
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
        postedByID
        postedOn
        private
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
        name
        email
        phone
        about
        image
        NTRP
        UTR
        verified
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
>>>>>>> origin/staging
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
<<<<<<< HEAD
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
        createdAt
        updatedAt
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
      createdAt
      updatedAt
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
        createdAt
        updatedAt
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
        createdAt
        updatedAt
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
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerByEmail(
      email: $email
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
export const playerMatchByPlayer = /* GraphQL */ `
  query PlayerMatchByPlayer(
    $playerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByPlayer(
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const playerMatchByPlayerVs = /* GraphQL */ `
  query PlayerMatchByPlayerVs(
    $playerID: ID!
    $opponentIDMatchType: ModelPlayerMatchByPlayerVsCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByPlayerVs(
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const playerMatchByPlayerWithPartner = /* GraphQL */ `
  query PlayerMatchByPlayerWithPartner(
    $playerID: ID!
    $partnerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByPlayerWithPartner(
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const playerMatchByPlayerDoublesOpponentPartner = /* GraphQL */ `
  query PlayerMatchByPlayerDoublesOpponentPartner(
    $playerID: ID!
    $opponentPartnerID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByPlayerDoublesOpponentPartner(
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const playerMatchByPartner = /* GraphQL */ `
  query PlayerMatchByPartner(
    $partnerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByPartner(
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const playerMatchByMatchID = /* GraphQL */ `
  query PlayerMatchByMatchID(
    $matchID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByMatchID(
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const playerMatchByMatchType = /* GraphQL */ `
  query PlayerMatchByMatchType(
    $matchType: matchType!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByMatchType(
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const playerMatchByLadder = /* GraphQL */ `
  query PlayerMatchByLadder(
    $ladderID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerMatchByLadder(
      ladderID: $ladderID
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
        createdAt
        updatedAt
        playerPlayerMatchesId
      }
      nextToken
    }
  }
`;
export const matchByLadderID = /* GraphQL */ `
  query MatchByLadderID(
    $ladderID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    matchByLadderID(
      ladderID: $ladderID
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
        createdAt
        updatedAt
        ladderMatchesId
      }
      nextToken
    }
  }
`;
export const ladderByName = /* GraphQL */ `
  query LadderByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelLadderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ladderByName(
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const ladderByCity = /* GraphQL */ `
  query LadderByCity(
    $city: String!
    $zip: ModelStringKeyConditionInput
=======
export const ladderByCity = /* GraphQL */ `
  query LadderByCity(
    $city: String!
>>>>>>> origin/staging
    $sortDirection: ModelSortDirection
    $filter: ModelLadderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ladderByCity(
      city: $city
<<<<<<< HEAD
      zip: $zip
=======
>>>>>>> origin/staging
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
<<<<<<< HEAD
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const standingsByPlayerID = /* GraphQL */ `
  query StandingsByPlayerID(
    $playerID: ID!
    $ladderIDIsCurrent: ModelStandingsByPlayerIDCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    standingsByPlayerID(
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
export const standingsByLadderID = /* GraphQL */ `
  query StandingsByLadderID(
    $ladderID: ID!
    $isCurrent: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStandingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    standingsByLadderID(
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
=======
        name
        location
        city
        zip
        createdOn
        updatedOn
>>>>>>> origin/staging
      }
      nextToken
    }
  }
`;
