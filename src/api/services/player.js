import { Storage } from "aws-amplify"
import { enums, userHelper } from "helpers"

const playersUrl = 'https://mytennis-space.uw.r.appspot.com/players/'

const playerAPI = {

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
            { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', image: 'Jonas profile_1678827465141.jpg' }
          ],
          wins: 24,
          losses: 16,
          totalMatches: 40
        },
        {
          player: [
            { id: 'abc', name: 'Scott Voelker' },
            { id: '1262162a-9732-4222-8a93-c9925703c911', name: 'Jonas Persson', image: 'Jonas profile_1678827465141.jpg' }
          ],
          wins: 1,
          losses: 1,
          totalMatches: 2
        }
      ],
    }
  ],

  login: async function(username, password) {
    
  },

  getPlayer: async function (id) {
    let response = await fetch(playersUrl+id)

    if (response.ok) {
      const player = await response.json()
      await this.setPlayerImage(player)
      return player
    }
    else
      return { status: response.status, statusCode: response.statusCode, statusText: response.statusText, error: 'No Player Found' }
    //this.playerDummyData.find((x) => x.id === id)//
  },

  getPlayerByFilter: async function (username) {
    let response = await fetch(`${playersUrl}?stats&filter=${username}`)

    if (response.ok) {
      const players = await response.json()
      if (players.length > 0) {
        let player = players[0]
        this.setPlayerImage(player)
        return await player
      }
      return { error: 'No players found' }
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'No players found' }
    // else {
    //   let player = this.playerDummyData.find((x) => x.username === username)
    //   await userHelper.SetPlayerImage(player)
    //   return player
    // }
  },

  getPlayers: async function (filter) {
    const response = await fetch(`${playersUrl}?filter=${filter}`)
    if (response.ok) {
      const data = await response.json()
      await data.players.forEach(p => {
        this.setPlayerImage(p)
      });
      return data
    }
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to get player' }
  },

  // ids as an array, since you can search for doubles pairs
  getGreatestRivals: async function (ids, type) {
    const response = await fetch(`${playersUrl+ids[0]}/rivals`)
    if (response.ok) {
      let data = await response.json()
      await data.rivals.forEach(r => this.setPlayerImage(r.player))
      return data
    }
    else
      throw new Error('Couldn\'t get player rivals. ')
  },

  // I don't really care what comes back, just something to verify success or failure
  createPlayer: async function (player) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer my-token'
      },
      body: JSON.stringify(player)
    }

    const response = await fetch(playersUrl+'create', requestOptions)
    if(response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to create player' }
  },

  // partial player as input. Only provided fields get updated
  updatePlayer: async function (player) {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer my-token'
      },
      body: JSON.stringify(player)
    }
    
    const response = await fetch(playersUrl+player.id+'/update', requestOptions)
    if(response.ok)
      return await response.json()
    else
      return { statusCode: response.statusCode, statusMessage: 'Error: Failed to update player.' }
  },

  setPlayerImage: async function (player) {
		if (player?.image) {
			if (!player.imageUrl) {
				const url = await Storage.get(player.image)
				player.imageUrl = url
			}
		}
    console.log("player",player)
	},

	setPlayerName: function (player, lastnameOnly) {
		let name = player.name
		if (lastnameOnly)
			name = name.split(' ').slice(-1)[0]
		
		return name + (player.verified ? "" : "*")
	}
}

export default playerAPI