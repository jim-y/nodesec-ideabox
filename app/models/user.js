'use strict';

const db = require('../config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

class User {

  constructor() {
    this.db = db;
  }

  create(params) {
    const id = this._createId(params.username);
    return this.db.ref(`users/${id}`).set({
      username: params.username,
      password: bcrypt.hashSync(params.password, 8) // FIXME kling-9/29/16: Change to async
    });
  }

  findOne(username) {
    const id = this._createId(username);
    return this.db.ref(`users/${id}`).once('value').then(snapshot => snapshot.val());
  }

  verify(user, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res === true) {
          resolve(true);
        } else {
          reject();
        }
      });
    });
  }

  _createId(inp) {
    return crypto.createHash('sha1').update(inp).digest('hex');
  }

  static get instance() {
    if (this.singleton) {
      return this.singleton;
    }

    this.singleton = new User();
    return this.singleton;
  }

}

module.exports = User;
