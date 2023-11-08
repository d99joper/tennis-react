import { enums } from "helpers"

const ladderFunctions = {
  /* DATA */
  ladderDummyData: [
    {
      city: 'Davis, CA',
      createdAt: '2023-03-06T01:41:48.705Z',
      id: '12be8efa-ea59-4ffd-ac67-96a1342b8dba',
      name: 'Test ladder',
      description: 'Tennis ladder for 3.5 to 4.0 players in Davis. All gender',
      level: { min: 3.5, max: 4 },
      location: { lat: 38.54669, lon: -121.74457 },
      matchType: enums.MATCH_TYPE.SINGLES,
      players: [
        {}
      ],
      standings: {
        id: "cur#12be8efa-ea59-4ffd-ac67-96a1342b8dba",
        details: [
          {
            wins: 21,
            position: 0,
            losses: 2,
            player: {
              image: "Jonas profile_1678827465141.jpg",
              name: "Jonas Persson",
              id: "1262162a-9732-4222-8a93-c9925703c911",
            },
            points: 433
          },
          {
            wins: 1,
            position: 0,
            losses: 4,
            player: {
              name: "Scott Voelker",
              id: "56c318a7-c742-4822-ab65-312a27d02b9d"
            },
            points: 427
          },
          {
            wins: 1,
            position: 0,
            losses: 4,
            player: {
              name: "Matthew Mentch",
              id: "92f5d7f2-95a0-4ee1-8ecd-96b513eb00d9"
            },
            points: 400
          },
          {
            wins: 1,
            position: 0,
            losses: 9,
            player: {
              name: "Andy Peters",
              id: "624e73d8-bcde-4c55-91fe-cb39939cedef"
            },
            points: 77
          },
          {
            wins: 1,
            position: 0,
            losses: 3,
            player: {
              name: "Dwayne Vakatini",
              id: "4731b4c0-1938-439e-aa9b-28df1a2c78d1"
            },
            points: 40
          },
          {
            wins: 0,
            position: 0,
            losses: 3,
            player: {
              name: "Kevin Judson",
              id: "b6dc9d38-24c2-48bb-9b57-942b638a51b6"
            },
            points: 27
          }
        ],
        postedOn: '2023-05-05T00:00:00.000Z',
        ladderID: '12be8efa-ea59-4ffd-ac67-96a1342b8dba',
        createdAt: '2023-04-27T00:59:41.147Z',
        updatedAt: '2023-05-03T16:17:14.283Z'

      },
      updatedAt: '2023-03-06T01:41:48.705Z',
      zip: '95616'
    }
  ],
  dummyStandings: [
    {
      id: "cur#12be8efa-ea59-4ffd-ac67-96a1342b8dba",
      details: [
        {
          wins: 21,
          position: 0,
          losses: 2,
          player: {
            image: "Jonas profile_1678827465141.jpg",
            name: "Jonas Persson",
            id: "1262162a-9732-4222-8a93-c9925703c911",
          },
          points: 433
        },
        {
          wins: 1,
          position: 0,
          losses: 4,
          player: {
            name: "Scott Voelker",
            id: "56c318a7-c742-4822-ab65-312a27d02b9d"
          },
          points: 427
        },
        {
          wins: 1,
          position: 0,
          losses: 4,
          player: {
            name: "Matthew Mentch",
            id: "92f5d7f2-95a0-4ee1-8ecd-96b513eb00d9"
          },
          points: 400
        },
        {
          wins: 1,
          position: 0,
          losses: 9,
          player: {
            name: "Andy Peters",
            id: "624e73d8-bcde-4c55-91fe-cb39939cedef"
          },
          points: 77
        },
        {
          wins: 1,
          position: 0,
          losses: 3,
          player: {
            name: "Dwayne Vakatini",
            id: "4731b4c0-1938-439e-aa9b-28df1a2c78d1"
          },
          points: 40
        },
        {
          wins: 0,
          position: 0,
          losses: 3,
          player: {
            name: "Kevin Judson",
            id: "b6dc9d38-24c2-48bb-9b57-942b638a51b6"
          },
          points: 27
        }
      ],
      postedOn: '2023-05-05T00:00:00.000Z',
      ladderID: '12be8efa-ea59-4ffd-ac67-96a1342b8dba',
      createdAt: '2023-04-27T00:59:41.147Z',
      updatedAt: '2023-05-03T16:17:14.283Z'

    },
    {
      id: "someotherid",
      details: [
        {
          wins: 12,
          position: 0,
          losses: 2,
          player: {
            image: "Jonas profile_1678827465141.jpg",
            name: "Jonas Persson",
            id: "1262162a-9732-4222-8a93-c9925703c911",
          },
          points: 120
        },
        {
          wins: 1,
          position: 0,
          losses: 4,
          player: {
            name: "Scott Voelker",
            id: "56c318a7-c742-4822-ab65-312a27d02b9d"
          },
          points: 80
        },
        {
          wins: 1,
          position: 0,
          losses: 4,
          player: {
            name: "Matthew Mentch",
            id: "92f5d7f2-95a0-4ee1-8ecd-96b513eb00d9"
          },
          points: 70
        },
        {
          wins: 1,
          position: 0,
          losses: 2,
          player: {
            name: "Andy Peters",
            id: "624e73d8-bcde-4c55-91fe-cb39939cedef"
          },
          points: 47
        },
        {
          wins: 1,
          position: 0,
          losses: 1,
          player: {
            name: "Dwayne Vakatini",
            id: "4731b4c0-1938-439e-aa9b-28df1a2c78d1"
          },
          points: 30
        },
        {
          wins: 0,
          position: 0,
          losses: 1,
          player: {
            name: "Kevin Judson",
            id: "b6dc9d38-24c2-48bb-9b57-942b638a51b6"
          },
          points: 7
        }
      ],
      postedOn: '2023-02-01T00:00:00.000Z',
      ladderID: '12be8efa-ea59-4ffd-ac67-96a1342b8dba',
      createdAt: '2023-04-27T00:59:41.147Z',
      updatedAt: '2023-05-03T16:17:14.283Z'

    }
  ],

  /* API calls */
  createLadder: async function (ladder) {
    return { statusCode: 200, status: 'OK' }
  },

  // partial ladder as input. Only provided fields get updated
  updateLadder: async function (ladder) {
    return { statusCode: 200, status: 'OK' }
  },

  getLadder: async function (id) {
    return this.ladderDummyData.find((x) => x.id === id)
  },

  getStandingsForDate: async function (ladderId, postedOn) {
    // get the standings at the specific playedOn date, or the closest earlier date
    let standings = this.dummyStandings
      // sort on date
      .sort((a, b) => new Date(b.postedOn) - new Date(a.postedOn))
      // find 
      .find((x) => x.ladderID === ladderId && new Date(x.postedOn) <= new Date(postedOn))

    // if there are no earlier standings, get the closest later standings
    if (!standings) {
      standings = this.dummyStandings
        // sort on date
        .sort((a, b) => new Date(b.postedOn) - new Date(a.postedOn))
        // find 
        .find((x) => x.ladderID === ladderId && new Date(x.postedOn) > new Date(postedOn))
    }

    return standings
  },

  // Add with 0 points, last place
  addPlayerToLadder(playerId, ladderId) {

  }
}

export default ladderFunctions