'use strict';

const co = require('co');
const jwt = require('koa-jwt');
const User = require('../../models/user');

class AuthService {

  register(email, password, confirm) {
    if (password !== confirm) return;
    const user = User({ email, password });

    return user.save();
  }

  authenticate(username, password) {
    return co(function* () {
      const user = yield User.findOne({
        email: username,
        password
      });

      if (!user) {
        throw new Error('invalid credentials');
      }

      return {
        token: jwt.sign(user, 'jwt-secret', { expiresIn: 18000 }),
        user
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
