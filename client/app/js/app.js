'use strict';

import register from './lib/register';
import routes from './config/routes';
import { REDIRECT_IF_NOT_AUTHENTICATED, SKIP_IF_AUTHENTICATED } from './config/security';

// ##############################
//          controllers
// ##############################

import AppController from './common/application-controller';
import AuthController from './auth/auth-controller';

// ##############################
//           services
// ##############################

import AuthService from './auth/auth-service';
import UserService from './user/user-service';

// ##############################
//           directives
// ##############################

// import PlayerDirective from './directives/player';
//
// register('phOverwatch')
//   .directive('player', PlayerDirective);

// ##############################
//         configuration
// ##############################

const module = angular.module('nodesec-ideabox', [
  'ui.router',
  'ngMaterial',
  'ngMessages'
]);

module
  .controller('AppController', AppController)
  .controller('AuthController', AuthController);

module
  .service('AuthService', AuthService)
  .service('UserService', UserService);

module.config(['$stateProvider', '$urlRouterProvider', routes]);

module.run([
  '$rootScope', '$state', 'UserService',
  ($rootScope, $state, userService) => {
    // AUTHENTICATION CHECK
    $rootScope.$on('$stateChangeStart', (e, toState/* , toParams, fromState, fromParams */) => {
      if (toState.security == null) return;

      if (toState.security === REDIRECT_IF_NOT_AUTHENTICATED && userService.user == null) {
        e.preventDefault();
        console.error('The page requires authentication. Redirecting to login');
        $state.go('login');
      } else if (toState.security === SKIP_IF_AUTHENTICATED && userService.user != null) {
        e.preventDefault();
        console.error(`You can\'t access ${toState.name} while logged in`);
      }
    });

    $rootScope.$on('$stateChangeError', (e, toState, toParams, fromState, fromParams, error) => {
      if (error) {
        console.error(error);
      }
    });
  }
]);
