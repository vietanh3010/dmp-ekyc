//const jwtDecode = require('jwt-decode');

/*
  setStorage: writes a key into storage setting a expire param
  need to use 'Date.now().valueOf() / 1000;' to get the plain UTC time (UTC is the same format as the 'exp' from the JWT-Token).
  https://stackoverflow.com/questions/2326943/when-do-items-in-html5-local-storage-expire
*/
//const USER_SESSION_EXPIRES_IN = 'user_session_expiresIn';
//const DEFAULT_EXPIRES_IN_SECONDS = 30*60; //30 minutes
//const TOKEN ='access_token';

//
// function setStorage(key, value, expiresInSecond) {
//    if( expiresInSecond===undefined || expiresInSecond===null) {
//      //set default value
//       expiresInSecond = DEFAULT_EXPIRES_IN_SECONDS; //30 minutes
//    } else {
//       expiresInSecond = Math.abs(expiresInSecond);
//    }
//    const now = Date.now().valueOf(); // milisecond since epoch time
//    const schedule = now + expiresInSecond *1000;  //miliseconds
//    try {
//      window.localStorage.setItem(key, value);
//      window.localStorage.setItem(key + '_expiresIn', schedule);
//    } catch (e) {
//      console.log('setStorage: Error setting key ['+ key + '] in localStorage: ' + JSON.stringify(e) );
//      return false;
//    }
//    return true;
// }

// function getStorage(key) {
//     const now = Date.now().valueOf();
//     let expiresInMilliSecond = localStorage.getItem(key+'_expiresIn');
//     if (expiresInMilliSecond ===undefined || expiresInMilliSecond ===null) {
//       expiresInMilliSecond  = 0; //set to expired value
//     }
//     //Expired
//   if (expiresInMilliSecond < now) { // expired
//
//   }
// }
//
//
//
//
// function isSessionExpired() {
//   const now = Date.now().valueOf(); // milliseconds since epoch time
//   let expiresInMilliSecond = localStorage.getItem(USER_SESSION_EXPIRES_IN);
//   if (expiresInMilliSecond ===undefined || expiresInMilliSecond ===null) {
//     expiresInMilliSecond  = 0; //set to expired value
//   }
//   return expiresInMilliSecond < now;  //Expired
// }
//
// // refresh expired time after user action
// function refreshSessionExpired () {
//   const schedule = Date.now().valueOf() + DEFAULT_EXPIRES_IN_SECONDS *1000;
//   window.localStorage.setItem(USER_SESSION_EXPIRES_IN, schedule);
// }
// /*
// function refreshToken() {
//
// }
// */

const isTokenExpired = () => {
  //const token = localStorage.getItem(TOKEN);
  try {
    const date = new Date(0);
    //const decoded = jwtDecode(token);
    //{id: "5c2edbbfb2c33f65682b03eb", iat: 1547112177, exp: 1547198577} id:user_id, exp:expires in
    // console.log(decoded);

    //date.setUTCSeconds(decoded.exp);
    return date.valueOf() > new Date().valueOf();
  } catch (err) {
    return false;
  }
};

// function removeStorage(name) {
//   try {
//       localStorage.removeItem(name);
//   } catch(e) {
//     console.log('removeStorage: Error removing key ['+ name+ '] from localStorage: ' + JSON.stringify(e) );
//     return false;
//   }
//   return true;
// }

export default isTokenExpired;


