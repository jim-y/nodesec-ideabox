'use strict';

import register from './lib/register';

// ##############################
//          controllers
// ##############################

import AppController from './common/app-controller';
import DashboardController from './dashboard/dashboard-controller';
import LoginController from './authentication/login/login-controller';
import RegisterController from './authentication/register/register-controller';

// ##############################
//           services
// ##############################

import DashboardService from './dashboard/dashboard-service';
import AuthService from './authentication/auth/auth-service';

// ##############################
//           directives
// ##############################

// ##############################
//           interceptors
// ##############################

import AuthInterceptor from './interceptors/auth-interceptor';

// ##############################
//         configuration
// ##############################

const module = angular.module('nodesec-ideabox', [
  'ui.router',
  'ngMaterial'
]);

module.controller('AppController', AppController);
module.controller('DashboardController', DashboardController);
module.controller('LoginController', LoginController);
module.controller('RegisterController', RegisterController);

module.service('DashboardService', DashboardService);
module.service('AuthService', AuthService);

// register('nodesec-ideabox')
//   .directive('player', PlayerDirective);

module.factory('authInterceptor', [...AuthInterceptor.$inject, (...params) => new AuthInterceptor(...params)]);
module.config(['$httpProvider', ($httpProvider) => {
  $httpProvider.interceptors.push('authInterceptor');
}]);

module.config(['$stateProvider', '$urlRouterProvider',
  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'js/authentication/login/login.html',
      controller: 'LoginController as ctrl',
      skipIfAuthenticated: true
    });

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'js/authentication/register/register.html',
      controller: 'RegisterController as ctrl',
      skipIfAuthenticated: true
    });

    $stateProvider.state('app', {
      abstract: true,
      templateUrl: 'js/common/app.html'
    });

    $stateProvider.state('app.dashboard', {
      url: '^/dashboard',
      templateUrl: 'js/dashboard/dashboard.html',
      controller: 'DashboardController as ctrl'
    });
  }
]);

module.run(['$rootScope', '$state', 'AuthService', ($rootScope, $state, authService) => {
  // AUTHENTICATION CHECK
  $rootScope.$on('$stateChangeStart', (e, toState, toParams, fromState, fromParams) => {
    if (toState.skipIfAuthenticated == null && !authService.isLoggedIn()) {
      e.preventDefault();
      console.error('You need to authenticate yourself');
      $state.go('login');
    } else if (toState.skipIfAuthenticated === true && authService.isLoggedIn()) {
      e.preventDefault();
      console.error(`You can\'t access ${toState.name} while logged in`);
    }
  });

  $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
    if (error) {
      console.error(error);
    }
  });
}]);
