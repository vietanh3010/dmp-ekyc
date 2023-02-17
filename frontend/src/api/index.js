import axios from 'axios';
import isTokenExpired from '../utils/localStorage';

//https://github.com/auth0/jwt-decode/issues/53

const configKeys = require('../config/keys')
const client = axios.create({
  baseURL: configKeys.apiUrl
});

client.interceptors.request.use(function(config){
  // Do something before the request is sent.
  // set expires time
  //Check active first
  if(path_is_require_token(config)) {
    config.headers.authorization = localStorage.getItem('access_token');
    config.headers.id_token = localStorage.getItem('id_token');
    if(isTokenExpired()) {

    }
  }
  return config;
}, function (error) {
  //Do something with request error
  return Promise.reject (error);
});




function path_is_require_token( request){
  return !(request.url.toString().includes("/login")
    || request.url.toString().includes("/register")
    || request.url.toString().includes("/logout")
    || request.url.toString().includes("/default"));
}



// function issueToken(token) {
//   //1. call api to get new token with the expire one
//   client.post('/refreshToken', {token})
//     .then((response) =>{
//       window.localStorage.setItem('access_token', response.data.token)
//     }).catch(()=>{
//       //const msg = "Can't refresh your token please log in to get new one";
//   })
//
//   // 2. Save the refresh token to localStorage
// }

export  default  client;


