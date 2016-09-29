'use strict';

const firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: 'app/config/firebase/credentials.json',
  databaseURL: 'https://nodesec.firebaseio.com'
});

module.exports = firebase.database();
