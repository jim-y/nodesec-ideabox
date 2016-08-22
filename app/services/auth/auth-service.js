'use strict';

const jwt = require('koa-jwt');

class AuthService {

  authenticate(username, password) {
    if (username !== 'john@doe.com' || password !== 'Password11') {
      throw new Error('invalid-credetials');
    }

    const user = {
      _id: 1,
      username: 'john',
      password: 'doe',
      age: 20
    };

    return {
      token: jwt.sign(user, 'jwt-secret', { expiresIn: 18000 })
    };
  }

  static instance(options) {
    if (!this.singleton) {
      this.singleton = new AuthService(options);
    }
    return this.singleton;
  }
}

module.exports = AuthService;
