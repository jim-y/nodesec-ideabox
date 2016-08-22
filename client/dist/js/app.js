(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _register = require('./lib/register');

var _register2 = _interopRequireDefault(_register);

var _routes = require('./config/routes');

var _routes2 = _interopRequireDefault(_routes);

var _security = require('./config/security');

var _applicationController = require('./common/application-controller');

var _applicationController2 = _interopRequireDefault(_applicationController);

var _authController = require('./auth/auth-controller');

var _authController2 = _interopRequireDefault(_authController);

var _authService = require('./auth/auth-service');

var _authService2 = _interopRequireDefault(_authService);

var _userService = require('./user/user-service');

var _userService2 = _interopRequireDefault(_userService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// ##############################
//           services
// ##############################

// ##############################
//          controllers
// ##############################

var _module = angular.module('nodesec-ideabox', ['ui.router', 'ngMaterial', 'ngMessages']);

_module.controller('AppController', _applicationController2.default).controller('AuthController', _authController2.default);

_module.service('AuthService', _authService2.default).service('UserService', _userService2.default);

_module.config(['$stateProvider', '$urlRouterProvider', _routes2.default]);

_module.run(['$rootScope', '$state', 'UserService', function ($rootScope, $state, userService) {
  // AUTHENTICATION CHECK
  $rootScope.$on('$stateChangeStart', function (e, toState /* , toParams, fromState, fromParams */) {
    if (toState.security == null) return;

    if (toState.security === _security.REDIRECT_IF_NOT_AUTHENTICATED && userService.user == null) {
      e.preventDefault();
      console.error('The page requires authentication. Redirecting to login');
      $state.go('login');
    } else if (toState.security === _security.SKIP_IF_AUTHENTICATED && userService.user != null) {
      e.preventDefault();
      console.error('You can\'t access ' + toState.name + ' while logged in');
    }
  });

  $rootScope.$on('$stateChangeError', function (e, toState, toParams, fromState, fromParams, error) {
    if (error) {
      console.error(error);
    }
  });
}]);

},{"./auth/auth-controller":2,"./auth/auth-service":3,"./common/application-controller":4,"./config/routes":5,"./config/security":6,"./lib/register":7,"./user/user-service":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthController = function () {
  _createClass(AuthController, null, [{
    key: '$inject',
    get: function get() {
      return ['AuthService'];
    }
  }]);

  function AuthController(authService) {
    _classCallCheck(this, AuthController);

    this.authService = authService;

    this.email = '';
    this.password = '';
  }

  _createClass(AuthController, [{
    key: 'login',
    value: function login($event) {
      $event.preventDefault();
      this.authService.login(this.email, this.password);
    }
  }]);

  return AuthController;
}();

exports.default = AuthController;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthService = function () {
  _createClass(AuthService, null, [{
    key: '$inject',
    get: function get() {
      return ['$http', '$state', 'UserService'];
    }
  }]);

  function AuthService($http, $state, userService) {
    _classCallCheck(this, AuthService);

    this.$http = $http;
    this.$state = $state;
    this.userService = userService;
  }

  _createClass(AuthService, [{
    key: 'login',
    value: function login(email, password) {
      var _this = this;

      return this.$http.post('http://localhost:3000/auth/authenticate', { username: email, password: password }).then(function (r) {
        return r.data;
      }).then(function (payload) {
        if (payload != null) {
          _this.userService.user = {
            username: email
          };
        }
        _this.$state.go('home');
      });
    }
  }]);

  return AuthService;
}();

exports.default = AuthService;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApplicationController = function ApplicationController() {
  _classCallCheck(this, ApplicationController);
};

exports.default = ApplicationController;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routes;

var _security = require('./security');

function routes($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/', '/home');
  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'static/main.html',
    controller: 'AppController as appCtrl',
    security: _security.REDIRECT_IF_NOT_AUTHENTICATED
  });

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'static/login.html',
    controller: 'AuthController as user'
  });
}

},{"./security":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var REDIRECT_IF_NOT_AUTHENTICATED = exports.REDIRECT_IF_NOT_AUTHENTICATED = 'redirectifnotauthenticated';
var SKIP_IF_AUTHENTICATED = exports.SKIP_IF_AUTHENTICATED = 'skipifauthenticated';

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = register;
/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for doing so.
 */

/* eslint-disable */
function register(appName) {

  var app = angular.module(appName);

  return {
    directive: directive,
    controller: controller,
    service: service,
    provider: provider,
    factory: factory
  };

  function directive(name, constructorFn) {

    constructorFn = _normalizeConstructor(constructorFn);

    if (!constructorFn.prototype.compile) {
      // create an empty compile function if none was defined.
      constructorFn.prototype.compile = function () {};
    }

    var originalCompileFn = _cloneFunction(constructorFn.prototype.compile);

    // Decorate the compile method to automatically return the link method (if it exists)
    // and bind it to the context of the constructor (so `this` works correctly).
    // This gets around the problem of a non-lexical "this" which occurs when the directive class itself
    // returns `this.link` from within the compile function.
    _override(constructorFn.prototype, 'compile', function () {
      return function () {
        originalCompileFn.apply(this, arguments);

        if (constructorFn.prototype.link) {
          return constructorFn.prototype.link.bind(this);
        }
      };
    });

    var factoryArray = _createFactoryArray(constructorFn);

    app.directive(name, factoryArray);
    return this;
  }

  function controller(name, contructorFn) {
    app.controller(name, contructorFn);
    return this;
  }

  function service(name, contructorFn) {
    app.service(name, contructorFn);
    return this;
  }

  function provider(name, constructorFn) {
    app.provider(name, constructorFn);
    return this;
  }

  function factory(name, constructorFn) {
    constructorFn = _normalizeConstructor(constructorFn);
    var factoryArray = _createFactoryArray(constructorFn);
    app.factory(name, factoryArray);
    return this;
  }

  /**
   * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
   * we need to pull out the array of dependencies and add it as an $inject property of the
   * actual constructor function.
   * @param input
   * @returns {*}
   * @private
   */
  function _normalizeConstructor(input) {
    var constructorFn;

    if (input.constructor === Array) {
      //
      var injected = input.slice(0, input.length - 1);
      constructorFn = input[input.length - 1];
      constructorFn.$inject = injected;
    } else {
      constructorFn = input;
    }

    return constructorFn;
  }

  /**
   * Convert a constructor function into a factory function which returns a new instance of that
   * constructor, with the correct dependencies automatically injected as arguments.
   *
   * In order to inject the dependencies, they must be attached to the constructor function with the
   * `$inject` property annotation.
   *
   * @param constructorFn
   * @returns {Array.<T>}
   * @private
   */
  function _createFactoryArray(constructorFn) {
    // get the array of dependencies that are needed by this component (as contained in the `$inject` array)
    var args = constructorFn.$inject || [];
    var factoryArray = args.slice(); // create a copy of the array
    // The factoryArray uses Angular's array notation whereby each element of the array is the name of a
    // dependency, and the final item is the factory function itself.
    factoryArray.push(function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //return new constructorFn(...args);
      var instance = new (Function.prototype.bind.apply(constructorFn, [null].concat(args)))();
      for (var key in instance) {
        instance[key] = instance[key];
      }
      return instance;
    });

    return factoryArray;
  }

  /**
   * Clone a function
   * @param original
   * @returns {Function}
   */
  function _cloneFunction(original) {
    return function () {
      return original.apply(this, arguments);
    };
  }

  /**
   * Override an object's method with a new one specified by `callback`.
   * @param object
   * @param methodName
   * @param callback
   */
  function _override(object, methodName, callback) {
    object[methodName] = callback(object[methodName]);
  }
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserService = function () {
  function UserService() {
    _classCallCheck(this, UserService);
  }

  _createClass(UserService, null, [{
    key: '$inject',
    get: function get() {
      return [];
    }
  }]);

  return UserService;
}();

exports.default = UserService;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2F1dGgvYXV0aC1jb250cm9sbGVyLmpzIiwiYXBwL2pzL2F1dGgvYXV0aC1zZXJ2aWNlLmpzIiwiYXBwL2pzL2NvbW1vbi9hcHBsaWNhdGlvbi1jb250cm9sbGVyLmpzIiwiYXBwL2pzL2NvbmZpZy9yb3V0ZXMuanMiLCJhcHAvanMvY29uZmlnL3NlY3VyaXR5LmpzIiwiYXBwL2pzL2xpYi9yZWdpc3Rlci5qcyIsImFwcC9qcy91c2VyL3VzZXItc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFNQTs7OztBQUNBOzs7O0FBTUE7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFsQkE7QUFDQTtBQUNBOztBQVRBO0FBQ0E7QUFDQTs7QUF5QkEsSUFBTSxVQUFTLFFBQVEsTUFBUixDQUFlLGlCQUFmLEVBQWtDLENBQy9DLFdBRCtDLEVBRS9DLFlBRitDLEVBRy9DLFlBSCtDLENBQWxDLENBQWY7O0FBTUEsUUFDRyxVQURILENBQ2MsZUFEZCxtQ0FFRyxVQUZILENBRWMsZ0JBRmQ7O0FBSUEsUUFDRyxPQURILENBQ1csYUFEWCx5QkFFRyxPQUZILENBRVcsYUFGWDs7QUFJQSxRQUFPLE1BQVAsQ0FBYyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixtQkFBZDs7QUFFQSxRQUFPLEdBQVAsQ0FBVyxDQUNULFlBRFMsRUFDSyxRQURMLEVBQ2UsYUFEZixFQUVULFVBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsV0FBckIsRUFBcUM7QUFDbkM7QUFDQSxhQUFXLEdBQVgsQ0FBZSxtQkFBZixFQUFvQyxVQUFDLENBQUQsRUFBSSxPQUFKLENBQVcsdUNBQVgsRUFBdUQ7QUFDekYsUUFBSSxRQUFRLFFBQVIsSUFB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QUFULElBQWdCLFFBQWhCLEVBQTBCO0FBQ3hCLGlCQUFTLEdBQVQsSUFBZ0IsU0FBUyxHQUFULENBQWhCO0FBQ0Q7QUFDRCxhQUFPLFFBQVA7QUFDRCxLQVBEOztBQVNBLFdBQU8sWUFBUDtBQUNEOztBQUVEOzs7OztBQUtBLFdBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQztBQUNoQyxXQUFPLFlBQVk7QUFDakIsYUFBTyxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLENBQVA7QUFDRCxLQUZEO0FBR0Q7O0FBRUQ7Ozs7OztBQU1BLFdBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixVQUEzQixFQUF1QyxRQUF2QyxFQUFpRDtBQUMvQyxXQUFPLFVBQVAsSUFBcUIsU0FBUyxPQUFPLFVBQVAsQ0FBVCxDQUFyQjtBQUNEO0FBRUY7OztBQy9JRDs7Ozs7Ozs7OztJQUVxQixXOzs7Ozs7O3dCQUVFO0FBQ25CLGFBQU8sRUFBUDtBQUNEOzs7Ozs7a0JBSmtCLFciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9saWIvcmVnaXN0ZXInO1xuaW1wb3J0IHJvdXRlcyBmcm9tICcuL2NvbmZpZy9yb3V0ZXMnO1xuaW1wb3J0IHsgUkVESVJFQ1RfSUZfTk9UX0FVVEhFTlRJQ0FURUQsIFNLSVBfSUZfQVVUSEVOVElDQVRFRCB9IGZyb20gJy4vY29uZmlnL3NlY3VyaXR5JztcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyAgICAgICAgICBjb250cm9sbGVyc1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmltcG9ydCBBcHBDb250cm9sbGVyIGZyb20gJy4vY29tbW9uL2FwcGxpY2F0aW9uLWNvbnRyb2xsZXInO1xuaW1wb3J0IEF1dGhDb250cm9sbGVyIGZyb20gJy4vYXV0aC9hdXRoLWNvbnRyb2xsZXInO1xuXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vICAgICAgICAgICBzZXJ2aWNlc1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbmltcG9ydCBBdXRoU2VydmljZSBmcm9tICcuL2F1dGgvYXV0aC1zZXJ2aWNlJztcbmltcG9ydCBVc2VyU2VydmljZSBmcm9tICcuL3VzZXIvdXNlci1zZXJ2aWNlJztcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyAgICAgICAgICAgZGlyZWN0aXZlc1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbi8vIGltcG9ydCBQbGF5ZXJEaXJlY3RpdmUgZnJvbSAnLi9kaXJlY3RpdmVzL3BsYXllcic7XG4vL1xuLy8gcmVnaXN0ZXIoJ3BoT3ZlcndhdGNoJylcbi8vICAgLmRpcmVjdGl2ZSgncGxheWVyJywgUGxheWVyRGlyZWN0aXZlKTtcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyAgICAgICAgIGNvbmZpZ3VyYXRpb25cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5jb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbm9kZXNlYy1pZGVhYm94JywgW1xuICAndWkucm91dGVyJyxcbiAgJ25nTWF0ZXJpYWwnLFxuICAnbmdNZXNzYWdlcydcbl0pO1xuXG5tb2R1bGVcbiAgLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKVxuICAuY29udHJvbGxlcignQXV0aENvbnRyb2xsZXInLCBBdXRoQ29udHJvbGxlcik7XG5cbm1vZHVsZVxuICAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBBdXRoU2VydmljZSlcbiAgLnNlcnZpY2UoJ1VzZXJTZXJ2aWNlJywgVXNlclNlcnZpY2UpO1xuXG5tb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgcm91dGVzXSk7XG5cbm1vZHVsZS5ydW4oW1xuICAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnVXNlclNlcnZpY2UnLFxuICAoJHJvb3RTY29wZSwgJHN0YXRlLCB1c2VyU2VydmljZSkgPT4ge1xuICAgIC8vIEFVVEhFTlRJQ0FUSU9OIENIRUNLXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgKGUsIHRvU3RhdGUvKiAsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMgKi8pID0+IHtcbiAgICAgIGlmICh0b1N0YXRlLnNlY3VyaXR5ID09IG51bGwpIHJldHVybjtcblxuICAgICAgaWYgKHRvU3RhdGUuc2VjdXJpdHkgPT09IFJFRElSRUNUX0lGX05PVF9BVVRIRU5USUNBVEVEICYmIHVzZXJTZXJ2aWNlLnVzZXIgPT0gbnVsbCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBwYWdlIHJlcXVpcmVzIGF1dGhlbnRpY2F0aW9uLiBSZWRpcmVjdGluZyB0byBsb2dpbicpO1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICB9IGVsc2UgaWYgKHRvU3RhdGUuc2VjdXJpdHkgPT09IFNLSVBfSUZfQVVUSEVOVElDQVRFRCAmJiB1c2VyU2VydmljZS51c2VyICE9IG51bGwpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGBZb3UgY2FuXFwndCBhY2Nlc3MgJHt0b1N0YXRlLm5hbWV9IHdoaWxlIGxvZ2dlZCBpbmApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgKGUsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbl0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRoQ29udHJvbGxlciB7XG5cbiAgc3RhdGljIGdldCAkaW5qZWN0KCkge1xuICAgIHJldHVybiBbJ0F1dGhTZXJ2aWNlJ107XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhdXRoU2VydmljZSkge1xuICAgIHRoaXMuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcblxuICAgIHRoaXMuZW1haWwgPSAnJztcbiAgICB0aGlzLnBhc3N3b3JkID0gJyc7XG4gIH1cblxuICBsb2dpbigkZXZlbnQpIHtcbiAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ2luKHRoaXMuZW1haWwsIHRoaXMucGFzc3dvcmQpO1xuICB9XG5cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0aFNlcnZpY2Uge1xuXG4gIHN0YXRpYyBnZXQgJGluamVjdCgpIHtcbiAgICByZXR1cm4gWyckaHR0cCcsICckc3RhdGUnLCAnVXNlclNlcnZpY2UnXTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCRodHRwLCAkc3RhdGUsIHVzZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy4kaHR0cCA9ICRodHRwO1xuICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgIHRoaXMudXNlclNlcnZpY2UgPSB1c2VyU2VydmljZTtcbiAgfVxuXG4gIGxvZ2luKGVtYWlsLCBwYXNzd29yZCkge1xuICAgIHJldHVybiB0aGlzLiRodHRwXG4gICAgICAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2F1dGgvYXV0aGVudGljYXRlJywgeyB1c2VybmFtZTogZW1haWwsIHBhc3N3b3JkIH0pXG4gICAgICAudGhlbihyID0+IHIuZGF0YSlcbiAgICAgIC50aGVuKHBheWxvYWQgPT4ge1xuICAgICAgICBpZiAocGF5bG9hZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy51c2VyU2VydmljZS51c2VyID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IGVtYWlsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgfSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwbGljYXRpb25Db250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7fVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBSRURJUkVDVF9JRl9OT1RfQVVUSEVOVElDQVRFRCwgU0tJUF9JRl9BVVRIRU5USUNBVEVEIH0gZnJvbSAnLi9zZWN1cml0eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJvdXRlcygkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcvJywgJy9ob21lJyk7XG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9ob21lJyk7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgdXJsOiAnL2hvbWUnLFxuICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL21haW4uaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FwcENvbnRyb2xsZXIgYXMgYXBwQ3RybCcsXG4gICAgc2VjdXJpdHk6IFJFRElSRUNUX0lGX05PVF9BVVRIRU5USUNBVEVEXG4gIH0pO1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICB1cmw6ICcvbG9naW4nLFxuICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL2xvZ2luLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlciBhcyB1c2VyJyxcbiAgICAvL3NlY3VyaXR5OiBTS0lQX0lGX0FVVEhFTlRJQ0FURURcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjb25zdCBSRURJUkVDVF9JRl9OT1RfQVVUSEVOVElDQVRFRCA9ICdyZWRpcmVjdGlmbm90YXV0aGVudGljYXRlZCc7XG5leHBvcnQgY29uc3QgU0tJUF9JRl9BVVRIRU5USUNBVEVEID0gJ3NraXBpZmF1dGhlbnRpY2F0ZWQnO1xuIiwiLyoqXG4gKiBBIGhlbHBlciBjbGFzcyB0byBzaW1wbGlmeSByZWdpc3RlcmluZyBBbmd1bGFyIGNvbXBvbmVudHMgYW5kIHByb3ZpZGUgYSBjb25zaXN0ZW50IHN5bnRheCBmb3IgZG9pbmcgc28uXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlZ2lzdGVyKGFwcE5hbWUpIHtcblxuICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoYXBwTmFtZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBkaXJlY3RpdmU6IGRpcmVjdGl2ZSxcbiAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgIHNlcnZpY2U6IHNlcnZpY2UsXG4gICAgcHJvdmlkZXI6IHByb3ZpZGVyLFxuICAgIGZhY3Rvcnk6IGZhY3RvcnlcbiAgfTtcblxuICBmdW5jdGlvbiBkaXJlY3RpdmUobmFtZSwgY29uc3RydWN0b3JGbikge1xuXG4gICAgY29uc3RydWN0b3JGbiA9IF9ub3JtYWxpemVDb25zdHJ1Y3Rvcihjb25zdHJ1Y3RvckZuKTtcblxuICAgIGlmICghY29uc3RydWN0b3JGbi5wcm90b3R5cGUuY29tcGlsZSkge1xuICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IGNvbXBpbGUgZnVuY3Rpb24gaWYgbm9uZSB3YXMgZGVmaW5lZC5cbiAgICAgIGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmNvbXBpbGUgPSAoKSA9PiB7fTtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ2luYWxDb21waWxlRm4gPSBfY2xvbmVGdW5jdGlvbihjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5jb21waWxlKTtcblxuICAgIC8vIERlY29yYXRlIHRoZSBjb21waWxlIG1ldGhvZCB0byBhdXRvbWF0aWNhbGx5IHJldHVybiB0aGUgbGluayBtZXRob2QgKGlmIGl0IGV4aXN0cylcbiAgICAvLyBhbmQgYmluZCBpdCB0byB0aGUgY29udGV4dCBvZiB0aGUgY29uc3RydWN0b3IgKHNvIGB0aGlzYCB3b3JrcyBjb3JyZWN0bHkpLlxuICAgIC8vIFRoaXMgZ2V0cyBhcm91bmQgdGhlIHByb2JsZW0gb2YgYSBub24tbGV4aWNhbCBcInRoaXNcIiB3aGljaCBvY2N1cnMgd2hlbiB0aGUgZGlyZWN0aXZlIGNsYXNzIGl0c2VsZlxuICAgIC8vIHJldHVybnMgYHRoaXMubGlua2AgZnJvbSB3aXRoaW4gdGhlIGNvbXBpbGUgZnVuY3Rpb24uXG4gICAgX292ZXJyaWRlKGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLCAnY29tcGlsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9yaWdpbmFsQ29tcGlsZUZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmxpbmspIHtcbiAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3JGbi5wcm90b3R5cGUubGluay5iaW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdmFyIGZhY3RvcnlBcnJheSA9IF9jcmVhdGVGYWN0b3J5QXJyYXkoY29uc3RydWN0b3JGbik7XG5cbiAgICBhcHAuZGlyZWN0aXZlKG5hbWUsIGZhY3RvcnlBcnJheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBjb250cm9sbGVyKG5hbWUsIGNvbnRydWN0b3JGbikge1xuICAgIGFwcC5jb250cm9sbGVyKG5hbWUsIGNvbnRydWN0b3JGbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBzZXJ2aWNlKG5hbWUsIGNvbnRydWN0b3JGbikge1xuICAgIGFwcC5zZXJ2aWNlKG5hbWUsIGNvbnRydWN0b3JGbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBwcm92aWRlcihuYW1lLCBjb25zdHJ1Y3RvckZuKSB7XG4gICAgYXBwLnByb3ZpZGVyKG5hbWUsIGNvbnN0cnVjdG9yRm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gZmFjdG9yeShuYW1lLCBjb25zdHJ1Y3RvckZuKSB7XG4gICAgY29uc3RydWN0b3JGbiA9IF9ub3JtYWxpemVDb25zdHJ1Y3Rvcihjb25zdHJ1Y3RvckZuKTtcbiAgICB2YXIgZmFjdG9yeUFycmF5ID0gX2NyZWF0ZUZhY3RvcnlBcnJheShjb25zdHJ1Y3RvckZuKTtcbiAgICBhcHAuZmFjdG9yeShuYW1lLCBmYWN0b3J5QXJyYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBjb25zdHJ1Y3RvckZuIGlzIGFuIGFycmF5IG9mIHR5cGUgWydkZXAxJywgJ2RlcDInLCAuLi4sIGNvbnN0cnVjdG9yKCkge31dXG4gICAqIHdlIG5lZWQgdG8gcHVsbCBvdXQgdGhlIGFycmF5IG9mIGRlcGVuZGVuY2llcyBhbmQgYWRkIGl0IGFzIGFuICRpbmplY3QgcHJvcGVydHkgb2YgdGhlXG4gICAqIGFjdHVhbCBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICogQHBhcmFtIGlucHV0XG4gICAqIEByZXR1cm5zIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX25vcm1hbGl6ZUNvbnN0cnVjdG9yKGlucHV0KSB7XG4gICAgdmFyIGNvbnN0cnVjdG9yRm47XG5cbiAgICBpZiAoaW5wdXQuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAvL1xuICAgICAgdmFyIGluamVjdGVkID0gaW5wdXQuc2xpY2UoMCwgaW5wdXQubGVuZ3RoIC0gMSk7XG4gICAgICBjb25zdHJ1Y3RvckZuID0gaW5wdXRbaW5wdXQubGVuZ3RoIC0gMV07XG4gICAgICBjb25zdHJ1Y3RvckZuLiRpbmplY3QgPSBpbmplY3RlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3RydWN0b3JGbiA9IGlucHV0O1xuICAgIH1cblxuICAgIHJldHVybiBjb25zdHJ1Y3RvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBpbnRvIGEgZmFjdG9yeSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGEgbmV3IGluc3RhbmNlIG9mIHRoYXRcbiAgICogY29uc3RydWN0b3IsIHdpdGggdGhlIGNvcnJlY3QgZGVwZW5kZW5jaWVzIGF1dG9tYXRpY2FsbHkgaW5qZWN0ZWQgYXMgYXJndW1lbnRzLlxuICAgKlxuICAgKiBJbiBvcmRlciB0byBpbmplY3QgdGhlIGRlcGVuZGVuY2llcywgdGhleSBtdXN0IGJlIGF0dGFjaGVkIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB3aXRoIHRoZVxuICAgKiBgJGluamVjdGAgcHJvcGVydHkgYW5ub3RhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGNvbnN0cnVjdG9yRm5cbiAgICogQHJldHVybnMge0FycmF5LjxUPn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9jcmVhdGVGYWN0b3J5QXJyYXkoY29uc3RydWN0b3JGbikge1xuICAgIC8vIGdldCB0aGUgYXJyYXkgb2YgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIG5lZWRlZCBieSB0aGlzIGNvbXBvbmVudCAoYXMgY29udGFpbmVkIGluIHRoZSBgJGluamVjdGAgYXJyYXkpXG4gICAgdmFyIGFyZ3MgPSBjb25zdHJ1Y3RvckZuLiRpbmplY3QgfHwgW107XG4gICAgdmFyIGZhY3RvcnlBcnJheSA9IGFyZ3Muc2xpY2UoKTsgLy8gY3JlYXRlIGEgY29weSBvZiB0aGUgYXJyYXlcbiAgICAvLyBUaGUgZmFjdG9yeUFycmF5IHVzZXMgQW5ndWxhcidzIGFycmF5IG5vdGF0aW9uIHdoZXJlYnkgZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheSBpcyB0aGUgbmFtZSBvZiBhXG4gICAgLy8gZGVwZW5kZW5jeSwgYW5kIHRoZSBmaW5hbCBpdGVtIGlzIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICBmYWN0b3J5QXJyYXkucHVzaCgoLi4uYXJncykgPT4ge1xuICAgICAgLy9yZXR1cm4gbmV3IGNvbnN0cnVjdG9yRm4oLi4uYXJncyk7XG4gICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgY29uc3RydWN0b3JGbiguLi5hcmdzKTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZVtrZXldID0gaW5zdGFuY2Vba2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmYWN0b3J5QXJyYXk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvbmUgYSBmdW5jdGlvblxuICAgKiBAcGFyYW0gb3JpZ2luYWxcbiAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gX2Nsb25lRnVuY3Rpb24ob3JpZ2luYWwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBhbiBvYmplY3QncyBtZXRob2Qgd2l0aCBhIG5ldyBvbmUgc3BlY2lmaWVkIGJ5IGBjYWxsYmFja2AuXG4gICAqIEBwYXJhbSBvYmplY3RcbiAgICogQHBhcmFtIG1ldGhvZE5hbWVcbiAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAqL1xuICBmdW5jdGlvbiBfb3ZlcnJpZGUob2JqZWN0LCBtZXRob2ROYW1lLCBjYWxsYmFjaykge1xuICAgIG9iamVjdFttZXRob2ROYW1lXSA9IGNhbGxiYWNrKG9iamVjdFttZXRob2ROYW1lXSlcbiAgfVxuXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXJTZXJ2aWNlIHtcblxuICBzdGF0aWMgZ2V0ICRpbmplY3QoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbn1cbiJdfQ==
