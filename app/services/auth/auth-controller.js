'use strict';

class AuthController {

  constructor(options) {
    this.authService = options.authService;
  }

  * register(ctx) {
    ctx.body = yield this.authService.register();
  }

  * authenticate(ctx) {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;

    try {
      ctx.body = yield this.authService.authenticate(username, password);
    } catch (err) {
      ctx.throw(err, 403);
    }
  }

  static instance(options) {
    if (!this.singleton) {
      this.singleton = new AuthController(options);
    }
    return this.singleton;
  }
}

module.exports = AuthController;
