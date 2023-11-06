import { enums, userFunctions } from "helpers"

const playerFunctions = {

  playerDummyData: [{
    id: '1262162a-9732-4222-8a93-c9925703c911',
    username: 'jonas@zooark.com',
    email: 'jonas@zooark.com',
    phone: '267-252-2289',
    about: 'Hello dummy data!',
    image: 'Jonas profile_1678827465141.jpg',
    ladders: [
      {
        id: '12be8efa-ea59-4ffd-ac67-96a1342b8dba',
        name: 'Test ladder',
        level: { min: '3.5', max: '4.0' },
        description: 'Tennis ladder for 3.5 to 4.0 players in Davis. All gender'
      },
      {
        id: '5',
        name: 'Woodland doubles 3.5',
        level: { min: '3.5', max: '4.0' },
        description: 'Come play doubles with us'
      }
    ],
    name: 'Jonas',
    UTR: '5.25',
    NTRP: '4.0',
    // matches: [
    //   {
    //     winner: {id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson' },
    //     loser: {id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vakatini'},
    //     score: '6-3, 6-7(4), 6-4',
    //     playedOn: '2022-05-02'
    //   }
    // ]
  },
  {
    id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1',
    username: 'jonas@zooark.com+dwayne',
    email: 'jonas@zooark.com+dwayne',
    phone: '555-555-5555',
    about: 'Something about Dwayne!',
    ladders: [
      {
        id: '12be8efa-ea59-4ffd-ac67-96a1342b8dba',
        name: 'Test ladder',
        level: { min: '3.5', max: '4.0' },
        description: 'Tennis ladder for 3.5 to 4.0 players in Davis. All gender'
      }
    ],
    name: 'Dwayne Vatakini',
    UTR: '6.25',
    NTRP: '4.0',
    verified: true
  }
  ],

  playerStatsDummyData: [
    {
      player: { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', image: 'Jonas profile_1678827465141.jpg' },
      years: [
        {
          year: 2020,
          stats: {
            matches: {
              wins: 6,
              losses: 6,
              percentage: 50,
              total: 12
            },
            sets: {
              wins: 20,
              losses: 15,
              percentage: 57,
              total: 35
            },
            games: {
              wins: 150,
              losses: 100,
              percentage: 60,
              total: 250
            },
            tiebreaks: {
              wins: 4,
              losses: 6,
              percentage: 40,
              total: 10
            }
          }
        },
        {
          year: 2021,
          stats: {
            matches: {
              wins: 6,
              losses: 4,
              percentage: 60,
              total: 10
            },
            sets: {
              wins: 15,
              losses: 10,
              percentage: 60,
              total: 25
            },
            games: {
              wins: 100,
              losses: 100,
              percentage: 50,
              total: 200
            },
            tiebreaks: {
              wins: 4,
              losses: 1,
              percentage: 80,
              total: 5
            }
          }
        }
      ],
      totals: {
        stats: {
          matches: {
            wins: 12,
            losses: 10,
            percentage: 60,
            total: 22
          },
          sets: {
            wins: 35,
            losses: 25,
            percentage: 58,
            total: 60
          },
          games: {
            wins: 250,
            losses: 200,
            percentage: 56,
            total: 450
          },
          tiebreaks: {
            wins: 8,
            losses: 7,
            percentage: 53,
            total: 15
          }
        }
      }
    },
    {
      player: { id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vatakini' },
      years: [
        {
          year: 2020,
          stats: {
            matches: {
              wins: 6,
              losses: 6,
              percentage: 50,
              total: 12
            },
            sets: {
              wins: 20,
              losses: 15,
              percentage: 57,
              total: 35
            },
            games: {
              wins: 150,
              losses: 100,
              percentage: 60,
              total: 250
            },
            tiebreaks: {
              wins: 4,
              losses: 6,
              percentage: 40,
              total: 10
            }
          }
        },
        {
          year: 2021,
          stats: {
            matches: {
              wins: 6,
              losses: 4,
              percentage: 60,
              total: 10
            },
            sets: {
              wins: 15,
              losses: 10,
              percentage: 60,
              total: 25
            },
            games: {
              wins: 100,
              losses: 100,
              percentage: 50,
              total: 200
            },
            tiebreaks: {
              wins: 4,
              losses: 1,
              percentage: 80,
              total: 5
            }
          }
        }
      ],
      totals: {
        stats: {
          matches: {
            wins: 12,
            losses: 10,
            percentage: 60,
            total: 22
          },
          sets: {
            wins: 35,
            losses: 25,
            percentage: 58,
            total: 60
          },
          games: {
            wins: 250,
            losses: 200,
            percentage: 56,
            total: 450
          },
          tiebreaks: {
            wins: 8,
            losses: 7,
            percentage: 53,
            total: 15
          }
        }
      }
    }
  ],
  playerRivalsDummyData: [
    {
      // could be multiple if doubles
      player: [
        { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', image: 'Jonas profile_1678827465141.jpg' }
      ],
      rivals: [
        {
          player: [{ id: '123', name: 'Travis Carter' }],
          wins: 24,
          losses: 16,
          totalMatches: 40
        },
        {
          player: [{ id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vatakini' }],
          wins: 1,
          losses: 1,
          totalMatches: 2
        }
      ]
    },
    {
      // could be multiple if doubles
      player: [
        { id: '4731b4c0-1938-439e-aa9b-28df1a2c78d1', name: 'Dwayne Vatakini', image: 'Jonas profile_1678827465141.jpg' },
        { id: 'abc', name: 'Scott Voelker' }
      ],
      rivals: [
        {
          player: [
            { id: '123', name: 'Travis Carter' }, 
            {id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', image: 'Jonas profile_1678827465141.jpg' }
          ],
          wins: 24,
          losses: 16,
          totalMatches: 40
        },
        {
          player: [
            { id: 'abc', name: 'Scott Voelker' }, 
            {id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', image: 'Jonas profile_1678827465141.jpg' }
          ],
          wins: 1,
          losses: 1,
          totalMatches: 2
        }
      ],
    }
  ],

  getPlayer: async function (id) {
    let player = this.playerDummyData.find((x) => x.id === id)
    await userFunctions.SetPlayerImage(player)
    return player
  },

  getPlayerByUserName: async function (username) {
    let player =  this.playerDummyData.find((x) => x.username === username)
    await userFunctions.SetPlayerImage(player)
    return player
  },

  getPlayerStatsByYear: async function (id, type) {
    return this.playerStatsDummyData.find((x) => x.player.id === id)
  },

  // ids as an array, since you can search for doubles pairs
  getGreatestRivals: async function (ids, type) {
    let data
    // if it's doubles, search for pairs
    if (type === enums.MATCH_TYPE.DOUBLES && ids.length === 2) {
      data = this.playerRivalsDummyData.find((x) => {
        // try to find both players
        const player = x.player.find((p) => p.id === ids[0])
        const partner = x.player.find((p) => p.id === ids[1])
        // if we find both players, success
        if (player && partner) return true
        else return false
      })
    }
    else {
       data = this.playerRivalsDummyData.find((x) => {
        let p1 = x.player.find((p) => p.id === ids[0] && x.player.length === 1)
        if (p1) return true
        else return false
      })
    }
    // return the rivals (after mapping the potential player images)
    if(data?.rivals)
      return await Promise.all(data.rivals.map(async(x) => {
        await Promise.all(x.player.map(async(p) => await userFunctions.SetPlayerImage(p)))
        return x
      }))
    else
      return []
  },

  // I don't really care what comes back, just something to verify success or failure
  createPlayer: async function(player) {
    return {statusCode: 200, statusMessage: 'OK'}
  },

  // partial player as input. Only provided fields get updated
  updatePlayer: async function(player) {
    return {statusCode: 200, statusMessage: 'OK'}
  }
}

export default playerFunctions