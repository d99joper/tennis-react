import { Amplify, Auth } from 'aws-amplify';
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


export {helpers, UserSignIn, checkUser};