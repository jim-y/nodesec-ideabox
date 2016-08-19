'use strict';

class UserController {

  constructor(options) {
    this.userService = options.userService;
  }

  * getUsers(ctx) {
    ctx.body = yield this.userService.getUsers();
  }

  // DI happens here just to omit the overhead of writing a DIC
  static instance(options) {
    if (!this.singleton) {
      this.singleton = new UserController(options);
    }

    return this.singleton;
  }
}

module.exports = UserController;
