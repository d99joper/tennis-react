import { API, Auth } from 'aws-amplify';
import { listPlayers, getPlayer } from "../graphql/queries";
import {
  createPlayer as createPlayerMutation,
  updatePlayer as updatePlayerMutation,
  deletePlayer as deletePlayerMutation,
} from "../graphql/mutations";
import React, {useState} from 'react';


var isSignedIn = false;

const UserSignIn = () => {
    
    const [isSignedIn, setSignedIn] = useState(checkUser());

    const signOutUser = () => {
        setSignedIn(false);
    };

    const signInUser = () => {
        setSignedIn(true);
    };
};

const checkUser = () => {
    // user check (perhaps this should be in a helper?)
    let userLoggedIn = false, currentUser = null;
    helpers.isLoggedIn().then((isLoggedIn) => {
    userLoggedIn = isLoggedIn;
    var userStatus = (userLoggedIn === true ? 'SignedIn' : 'NotSignedIn')
    console.log(userStatus);
    return userLoggedIn;
    // if(userStatus === 'SignedIn') {
    //     helpers.getUserAttributes().then((data) => {
    //         currentUser = data;
    //         console.log(currentUser);
    //     });
    // }
    });
};

const userFunctions = {

    getPlayerByEmail: async function(email) {
        let filter = {
            email: {
                eq: email 
            }
        };
        const apiData = await API.graphql({ query: listPlayers, variables: { filter: filter}  });

        const playersFromAPI = apiData.data.listPlayers.items;

        // if(playersFromAPI[0])
        //     return playersFromAPI[0]
        // else
        //     return null;

        await Promise.any(playersFromAPI
            // playersFromAPI.map(async (player) => {
            //     console.log(player);
            //   if (player.image) {
            //     const url = await Storage.get(player.name);
            //     player.image = url;
            //   }
            //   return player;
            // })
          ).then((player) => {console.log(player); return player});
        // setPlayers(playersFromAPI);
    }
}

const helpers = {
    
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
    }
    
};


export {helpers, userFunctions, UserSignIn, checkUser};