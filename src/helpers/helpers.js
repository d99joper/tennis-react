import { API, Auth, Storage } from 'aws-amplify';
import { listPlayers, getPlayer } from "../graphql/queries";
import {
  createPlayer as createPlayerMutation,
  updatePlayer as updatePlayerMutation,
  deletePlayer as deletePlayerMutation,
} from "../graphql/mutations";


const userFunctions = {
    
    createPlayerIfNotExist: async function() {
        const user = await Auth.currentAuthenticatedUser();

        console.log(user);
        if(typeof user != 'undefined') {
            const player = await this.getPlayerByEmail(user.attributes.email);
            console.log("createPlayerIfNotExist", player);
            if(player === 'undefined' || player.length == 0) {
                // user doesn't create, so create it
                this.createPlayer(user.attributes.name, user.attributes.email, user.attributes.sub, user.attributes.sub);
            }
        }       
    },

    UpdatePlayer: async function(player, userId, image) {
        
        try {
            let imageName =(!!player.image ? player.image.name : undefined)            
            if(image) {
                const nameArr = image.name.split('.')
                imageName = nameArr[0] + '_' + Date.now() + '.' + nameArr.pop()
            }
    
            let inputData = {
                id: userId, 
                name: player.name,
                image: imageName,
                phone: player.phone,
                about: player.about,
                NTRP: player.NTRP,
                UTR: player.UTR
            };
            
            if (!!(inputData.image && image)) {
                // add the new image
                await Storage.put(imageName, image);
                // remove the old image
                if(!!player.image)
                    Storage.remove(player.image)
            }

            const result = await API.graphql({
              query: updatePlayerMutation,
              variables: {
                input: inputData,
                 conditions: {id: userId} // required
              }
            })

            console.log('Player updated', result.data.updatePlayer)
            // set the image url and return the player
            let updatedPlayer = result.data.updatePlayer
            updatedPlayer.imageUrl = await Storage.get(imageName);
            return updatedPlayer
          }
          catch(e) {
            console.log("failed to update players", e);
            return null
          }
        //   finally {
        //     return inputData;
        //   }
    },

    createPlayer: async function(name, email, id, userGUID) {
        console.log('createPlayer');
        
        const loadData = {
            name: name,
            email: email,
            id: id,
            userGUID: userGUID
        };
        
        console.log(loadData);

        try{
            API.graphql({
                query: createPlayerMutation,
                variables: { input: loadData },
            }).then((result) => {
                console.log('New player created', result);
                return result;
            }).catch((e) => {console.log(e)});
        }
        catch(e){
            console.error("failed to create a player", e);
        }
    },

    getCurrentlyLoggedInPlayer: async function() {
        try {
            let user = await Auth.currentAuthenticatedUser();
            console.log("getCurrentlyLoggedInPlayer", user);
            //console.log(typeof user !== 'undefined');
            
            if(typeof user !== 'undefined') {
                const player_array = await this.getPlayerByEmail(user.attributes.email);
                let player = player_array[0];
                if(player.image)
                    player.imageUrl = await Storage.get(player.image)
                
                return player;
            } 
            else return;
            
        }
        catch(e) {console.log(e);}
    },

    getPlayer: async function(id) {
        try {
            const apiData = await API.graphql({
                query: getPlayer,
                variables: { id: id },
            });
    
            const playerFromAPI = apiData.data.getPlayer;
    
            if(playerFromAPI.image)
                playerFromAPI.imageUrl = await Storage.get(playerFromAPI.image)
    
            return playerFromAPI;
        }
        catch(e) {
            console.log("failed to get player", e);
            return;
        }
    },

    getPlayerByEmail: async function(email, includeImage= false) {
        
        try {
            if(!email) return [];

            const emailFilter = {
                email: {
                    eq: email 
                }
            };
            
            console.log('getPlayerByEmail');
            const apiData = await API.graphql({ query: listPlayers, variables: { filter: emailFilter}  });
    
            const playersFromAPI = apiData.data.listPlayers.items;
            
            if(includeImage)
                await Promise.all(
                    playersFromAPI.map(async (player) => {
                        console.log(player);
                    if (player.image) {
                        const url = await Storage.get(player.image);
                        player.imageUrl = url;
                    }
                    return player;
                    })
                );
            
            return playersFromAPI;
        }
        catch(e) {
            console.log("failed to getPlayerByEmail", e);
            return;
        }
    },
    
    CheckIfSignedIn: async function (){        
        try {     
            let user = await Auth.currentAuthenticatedUser();    
            if(!user){
                return false;
            }
            if(user == 'The user is not authenticated') {
                return false;
            }
            else return true;
        }   
        catch(e) {
            console.log("CheckIfSignedIn", e)
            return false;
        }
    },

    getUserAttributes: async function(){
        return Auth.currentUserInfo();
    },
    
    signOut: function(){
        Auth.signOut()
            .then(data =>  console.log(data))
            .catch(err => console.log('err'+err))
    },

    deletePlayer: async function(id) {        
        try {
            await API.graphql({
                query: deletePlayerMutation,
                variables: { input: { id } },
            });
            return true
        }
        catch(e){
            console.log("failed to delete player", e);
            return false;
        }        
    },

    fetchPlayers: async function(email, filter) {
        // let filter = {
        //     email: {
        //         eq: email // filter priority = 1
        //     }
        // };
        const apiData = await API.graphql({ query: listPlayers, variables: { filter: filter}  });

        const playersFromAPI = apiData.data.listPlayers.items;

        await Promise.all(
            playersFromAPI.map(async (player) => {
                console.log(player);
              if (player.image) {
                const url = await Storage.get(player.name);
                player.image.url = url;
              }
              return player;
            })
          );

        return playersFromAPI;
    }
}

const helpers = {
    
    getGUID: () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    },
    formatDate: (date) => {
        date = new Date(date);
        if(Object.prototype.toString.call(date) === '[object Date]')
            return date.toLocaleDateString('en-us',{ year:"numeric", month:"short", day:"numeric"})

        return 'not a date'
    }
    
};


export {helpers, userFunctions};