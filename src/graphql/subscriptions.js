/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
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
        items {
          id
          playedOn
          reportedOn
          score
          createdOn
          updatedOn
          playerMatchesId
          ladderMatchesId
        }
        nextToken
      }
      ladders {
        items {
          id
          name
          location
          createdOn
          updatedOn
          playerLaddersId
        }
        nextToken
      }
      createdOn
      updatedOn
      ladderPlayersId
    }
  }
`;
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer {
    onUpdatePlayer {
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
        items {
          id
          playedOn
          reportedOn
          score
          createdOn
          updatedOn
          playerMatchesId
          ladderMatchesId
        }
        nextToken
      }
      ladders {
        items {
          id
          name
          location
          createdOn
          updatedOn
          playerLaddersId
        }
        nextToken
      }
      createdOn
      updatedOn
      ladderPlayersId
    }
  }
`;
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer {
    onDeletePlayer {
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
        items {
          id
          playedOn
          reportedOn
          score
          createdOn
          updatedOn
          playerMatchesId
          ladderMatchesId
        }
        nextToken
      }
      ladders {
        items {
          id
          name
          location
          createdOn
          updatedOn
          playerLaddersId
        }
        nextToken
      }
      createdOn
      updatedOn
      ladderPlayersId
    }
  }
`;
export const onCreateLadder = /* GraphQL */ `
  subscription OnCreateLadder {
    onCreateLadder {
      id
      name
      location
      matches {
        items {
          id
          playedOn
          reportedOn
          score
          createdOn
          updatedOn
          playerMatchesId
          ladderMatchesId
        }
        nextToken
      }
      players {
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
          ladderPlayersId
        }
        nextToken
      }
      createdOn
      updatedOn
      playerLaddersId
    }
  }
`;
export const onUpdateLadder = /* GraphQL */ `
  subscription OnUpdateLadder {
    onUpdateLadder {
      id
      name
      location
      matches {
        items {
          id
          playedOn
          reportedOn
          score
          createdOn
          updatedOn
          playerMatchesId
          ladderMatchesId
        }
        nextToken
      }
      players {
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
          ladderPlayersId
        }
        nextToken
      }
      createdOn
      updatedOn
      playerLaddersId
    }
  }
`;
export const onDeleteLadder = /* GraphQL */ `
  subscription OnDeleteLadder {
    onDeleteLadder {
      id
      name
      location
      matches {
        items {
          id
          playedOn
          reportedOn
          score
          createdOn
          updatedOn
          playerMatchesId
          ladderMatchesId
        }
        nextToken
      }
      players {
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
          ladderPlayersId
        }
        nextToken
      }
      createdOn
      updatedOn
      playerLaddersId
    }
  }
`;
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch {
    onCreateMatch {
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
      score
      ladder {
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
      comments {
        items {
          id
          createdOn
          content
          updatedOn
          matchCommentsId
        }
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
  subscription OnUpdateMatch {
    onUpdateMatch {
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
      score
      ladder {
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
      comments {
        items {
          id
          createdOn
          content
          updatedOn
          matchCommentsId
        }
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
  subscription OnDeleteMatch {
    onDeleteMatch {
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
      score
      ladder {
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
      comments {
        items {
          id
          createdOn
          content
          updatedOn
          matchCommentsId
        }
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
  subscription OnCreateComment {
    onCreateComment {
      id
      createdOn
      match {
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
      content
      updatedOn
      matchCommentsId
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      createdOn
      match {
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
      content
      updatedOn
      matchCommentsId
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      createdOn
      match {
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
      content
      updatedOn
      matchCommentsId
    }
  }
`;
