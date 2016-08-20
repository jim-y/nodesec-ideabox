'use strict';

const router = require('koa-router')({ prefix: '/auth' });

// SERVICES
const authService = require('./auth-service').instance({});

// CONTROLLERS
const controller = require('./auth-controller').instance({
  authService
});

// ROUTES
const routes = [{
  path: '/register',
  method: 'POST',
  action: 'register'
}, {
  path: '/authenticate',
  method: 'POST',
  action: 'authenticate'
}];

module.exports = (app) => {
  routes.forEach(route => {
    const middlewares = [];
    // additional middlewares
    // --- security, etc

    middlewares.push(function* middleware(next) {
      yield* controller[route.action](this, next);
    });

    router[route.method.toLowerCase()](route.path, ...middlewares);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
};
