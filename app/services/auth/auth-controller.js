'use strict';

class AuthController {

  constructor(options) {
    this.authService = options.authService;
  }

  * register(ctx) {
    const email = ctx.request.body.username;
    const password = ctx.request.body.password;
    const confirm = ctx.request.body.confirm;

    if (confirm !== password) ctx.throw('Invalid Credentials', 403);

    try {
      ctx.body = yield this.authService.register(email, password);
    } catch (err) {
      if (err) {
        console.error(err);
      }
      ctx.throw(err, 403);
    }
  }

  * authenticate(ctx) {
    const email = ctx.request.body.username;
    const password = ctx.request.body.password;

    try {
      ctx.body = yield this.authService.authenticate(email, password);
    } catch (err) {
      if (err) {
        console.error(err.message);
      }
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
