'use strict';

class UserService {

  constructor(options) {
    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
  }

  getUsers() {
    return Promise.resolve([1,2,3,4,5]);
  }

  static instance(options) {
    if (!this.singleton) {
      this.singleton = new UserService(options);
    }

    return this.singleton;
  }
}

module.exports = UserService;
