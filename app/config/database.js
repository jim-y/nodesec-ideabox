'use strict';

const firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: 'app/config/firebase/credentials.json',
  databaseURL: 'https://nodesec-ideabox.firebaseio.com'
});

module.exports = firebase.database();
