'use strict';

class AuthController {

  constructor(options) {
    this.authService = options.authService;
  }

  * register(ctx) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;
    const confirm = ctx.request.body.confirm;

    try {
      ctx.body = yield this.authService.register(email, password, confirm);
    } catch (err) {
      ctx.throw(err, 403);
    }
  }

  * authenticate(ctx) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    try {
      ctx.body = yield this.authService.authenticate(email, password);
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
