'use strict';

import register from './lib/register';

// ##############################
//          controllers
// ##############################

import AppController from './common/app-controller';
import DashboardController from './dashboard/dashboard-controller';

// ##############################
//           services
// ##############################

import DashboardService from './dashboard/dashboard-service';

// ##############################
//           directives
// ##############################

// ##############################
//         configuration
// ##############################

const module = angular.module('nodesec-ideabox', [
  'ui.router',
  'ngMaterial'
]);

module.controller('AppController', AppController);
module.controller('DashboardController', DashboardController);

module.service('DashboardService', DashboardService);

// register('nodesec-ideabox')
//   .directive('player', PlayerDirective);

module.config(['$stateProvider', '$urlRouterProvider',
  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/', '/dashboard');

    $stateProvider.state('dashboard', {
      url: '/dashboard',
      templateUrl: 'js/dashboard/dashboard.html',
      controller: 'DashboardController as ctrl'
    });
  }
]);

module.run($rootScope => {
  $rootScope.$on('$stateChangeError', console.log.bind(console));
});
