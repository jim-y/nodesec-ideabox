'use strict';

const router = require('koa-router')({ prefix: '/user' });

// SERVICES
const userService = require('./user-service').instance({});

// CONTROLLERS
const controller = require('./user-controller').instance({
  userService
});

// ROUTES
const routes = [{
  path: '/',
  method: 'GET',
  action: 'getUsers'
}];

module.exports = function(app) {
  routes.forEach(route => {
    const middlewares = [];
    // additional middlewares
    // --- security, etc

    middlewares.push(function * (next) {
      yield * controller[route.action](this, next);
    });

    router[route.method.toLowerCase()](route.path, ...middlewares);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
