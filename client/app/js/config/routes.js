'use strict';

import { REDIRECT_IF_NOT_AUTHENTICATED, SKIP_IF_AUTHENTICATED } from './security';

export default function routes($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/', '/home');
  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'static/main.html',
    controller: 'AppController as appCtrl',
    security: REDIRECT_IF_NOT_AUTHENTICATED
  });

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'static/login.html',
    controller: 'AuthController as user',
    //security: SKIP_IF_AUTHENTICATED
  });
}
