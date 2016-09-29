'use strict';

const router = require('koa-router')({ prefix: '/user' });
const secret = require('../../config/secret');
const jwt = require('koa-jwt');

// SERVICES
const userService = require('./user-service').instance({});

// CONTROLLERS
const controller = require('./user-controller').instance({
  userService
});

// ROUTES
const routes = [{
  path: '/users',
  method: 'GET',
  action: 'getUsers'
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

  app.use(jwt({ secret }));
  app.use(router.routes());
  app.use(router.allowedMethods());
};
