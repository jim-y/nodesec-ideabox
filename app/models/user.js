'use strict';

const db = require('../config/database');

class User {

  constructor() {
    this.db = db;
  }

  create(params) {
    return this.db.ref(`users/${params.id}`).set({
      username: params.username,
      password: params.password
    });
  }

}

module.exports = User;
