'use strict';

const co = require('co');
const jwt = require('koa-jwt');
const User = require('../../models/user').instance;
const secret = require('../../config/secret');

class AuthService {

  register(username, password) {
    return User.create({ username, password });
  }

  authenticate(username, password) {
    return co(function* () {
      const user = yield User.findOne(username);

      if (user == null) throw new Error('Invalid credentials');

      try {
        yield User.verify(user, password);
      } catch (err) {
        throw new Error('Invalid credentials');
      }

      return {
        token: jwt.sign(user, secret, { expiresIn: 18000 })
      };
    });
  }

  static instance(options) {
    if (!this.singleton) {
      this.singleton = new AuthService(options);
    }
    return this.singleton;
  }
}

module.exports = AuthService;
