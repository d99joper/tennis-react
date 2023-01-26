import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Amplify} from 'aws-amplify';
import awsconfig from './aws-exports';
//Amplify.configure(config);

const isLocalhost = Boolean(
   window.location.hostname === "localhost" ||
     // [::1] is the IPv6 localhost address.
     window.location.hostname === "[::1]" ||
     // 127.0.0.1/8 is considered localhost for IPv4.
     window.location.hostname.match(
       /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
     )
 );
 
 // Assuming you have two redirect URIs, and the first is for production and second is for localhost
 const [
   productionRedirectSignIn,
   localRedirectSignIn
 ] = awsconfig.oauth.redirectSignIn.split(",");
 
 const [
   productionRedirectSignOut,
   localRedirectSignOut
 ] = awsconfig.oauth.redirectSignOut.split(",");
 
 console.log(isLocalhost ? localRedirectSignIn : productionRedirectSignIn);
 
 const updatedAwsConfig = {
   ...awsconfig,
   oauth: {
     ...awsconfig.oauth,
     redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
     redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
   }
 }
 console.log(updatedAwsConfig);
 
 Amplify.configure(updatedAwsConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 // <React.StrictMode>
    <App />
 // </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
