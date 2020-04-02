// Node.js server
const {endpoints} = require('@wildcard-api/server');

endpoints.myFirstEndpoint = async function () {
    // The `this` object is the `context` object we defined in `getContext`.
   // console.log('The logged-in user is: ', this.user.username);
    return {msg: 'Hello, from my first Wildcard endpoint'};
};



