'use strict';

const co = require('co');
const jwt = require('koa-jwt');
const User = require('../../models/user');
const secret = require('../../config/secret');

class AuthService {

  register(username, password) {
    return User.create({ username, password });
  }

  authenticate(username, password) {
    console.log(users);
    console.log(username, password);
    const pwd = users[username];

    if (pwd == null || pwd !== password) {
      throw new Error('invalid credentials');
    }

    return {
      token: jwt.sign({ user: username, password }, secret, { expiresIn: 18000 })
    };
    // return co(function* () {
    //   // const user = yield User.findOne({
    //   //   email: username,
    //   //   password
    //   // });
    //
    //   const pwd = users[username];
    //
    //   if (pwd == null || pwd !== password) {
    //     throw new Error('invalid credentials');
    //   }
    //
    //   return {
    //     token: jwt.sign({ user: username, password }, 'jwt-secret', { expiresIn: 18000 })
    //   };
    // });
  }

  static instance(options) {
    if (!this.singleton) {
      this.singleton = new AuthService(options);
    }
    return this.singleton;
  }
}

module.exports = AuthService;
