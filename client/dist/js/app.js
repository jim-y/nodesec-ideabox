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
      return ['$state', 'AuthService'];
    }
  }]);

  function AuthController($state, authService) {
    _classCallCheck(this, AuthController);

    this.$state = $state;
    this.authService = authService;

    this.email = '';
    this.password = '';
    this.confirm = '';
  }

  _createClass(AuthController, [{
    key: 'login',
    value: function login($event) {
      $event.preventDefault();
      this.authService.login({
        email: this.email,
        password: this.password
      });
    }
  }, {
    key: 'register',
    value: function register() {
      this.authService.register({
        email: this.email,
        password: this.password,
        confirm: this.confirm
      });
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
    value: function login(_login) {
      var _this = this;

      return this.$http.post('http://localhost:3000/auth/authenticate', _login).then(function (r) {
        return r.data;
      }).then(function (payload) {
        if (payload != null) {
          _this.userService.user = payload.user;
        }

        _this.$state.go('home');
      });
    }
  }, {
    key: 'register',
    value: function register(registration) {
      var _this2 = this;

      console.log('register');
      return this.$http.post('http://localhost:3000/auth/register', registration).then(function (r) {
        return r.data;
      }).then(function (response) {
        if (response != null) {
          _this2.$state.go('login');
        }
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

  $stateProvider.state('register', {
    url: '/register',
    templateUrl: 'static/register.html',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2F1dGgvYXV0aC1jb250cm9sbGVyLmpzIiwiYXBwL2pzL2F1dGgvYXV0aC1zZXJ2aWNlLmpzIiwiYXBwL2pzL2NvbW1vbi9hcHBsaWNhdGlvbi1jb250cm9sbGVyLmpzIiwiYXBwL2pzL2NvbmZpZy9yb3V0ZXMuanMiLCJhcHAvanMvY29uZmlnL3NlY3VyaXR5LmpzIiwiYXBwL2pzL2xpYi9yZWdpc3Rlci5qcyIsImFwcC9qcy91c2VyL3VzZXItc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFNQTs7OztBQUNBOzs7O0FBTUE7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFsQkE7QUFDQTtBQUNBOztBQVRBO0FBQ0E7QUFDQTs7QUF5QkEsSUFBTSxVQUFTLFFBQVEsTUFBUixDQUFlLGlCQUFmLEVBQWtDLENBQy9DLFdBRCtDLEVBRS9DLFlBRitDLEVBRy9DLFlBSCtDLENBQWxDLENBQWY7O0FBTUEsUUFDRyxVQURILENBQ2MsZUFEZCxtQ0FFRyxVQUZILENBRWMsZ0JBRmQ7O0FBSUEsUUFDRyxPQURILENBQ1csYUFEWCx5QkFFRyxPQUZILENBRVcsYUFGWDs7QUFJQSxRQUFPLE1BQVAsQ0FBYyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixtQkFBZDs7QUFFQSxRQUFPLEdBQVAsQ0FBVyxDQUNULFlBRFMsRUFDSyxRQURMLEVBQ2UsYUFEZixFQUVULFVBQUMsVUFBRCxFQUFhLE1BQWIsRUFBcUIsV0FBckIsRUFBcUM7QUFDbkM7QUFDQSxhQUFXLEdBQVgsQ0FBZSxtQkFBZixFQUFvQyxVQUFDLENBQUQsRUFBSSxPQUFKLENBQVcsdUNBQVgsRUFBdUQ7QUFDekYsUUFBSSxRQUFRLFFBQVIsSUFB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Ozs7Ozt3QkFFRTtBQUNuQixhQUFPLEVBQVA7QUFDRDs7Ozs7O2tCQUprQixXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHJlZ2lzdGVyIGZyb20gJy4vbGliL3JlZ2lzdGVyJztcbmltcG9ydCByb3V0ZXMgZnJvbSAnLi9jb25maWcvcm91dGVzJztcbmltcG9ydCB7IFJFRElSRUNUX0lGX05PVF9BVVRIRU5USUNBVEVELCBTS0lQX0lGX0FVVEhFTlRJQ0FURUQgfSBmcm9tICcuL2NvbmZpZy9zZWN1cml0eSc7XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gICAgICAgICAgY29udHJvbGxlcnNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5pbXBvcnQgQXBwQ29udHJvbGxlciBmcm9tICcuL2NvbW1vbi9hcHBsaWNhdGlvbi1jb250cm9sbGVyJztcbmltcG9ydCBBdXRoQ29udHJvbGxlciBmcm9tICcuL2F1dGgvYXV0aC1jb250cm9sbGVyJztcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyAgICAgICAgICAgc2VydmljZXNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5pbXBvcnQgQXV0aFNlcnZpY2UgZnJvbSAnLi9hdXRoL2F1dGgtc2VydmljZSc7XG5pbXBvcnQgVXNlclNlcnZpY2UgZnJvbSAnLi91c2VyL3VzZXItc2VydmljZSc7XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gICAgICAgICAgIGRpcmVjdGl2ZXNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4vLyBpbXBvcnQgUGxheWVyRGlyZWN0aXZlIGZyb20gJy4vZGlyZWN0aXZlcy9wbGF5ZXInO1xuLy9cbi8vIHJlZ2lzdGVyKCdwaE92ZXJ3YXRjaCcpXG4vLyAgIC5kaXJlY3RpdmUoJ3BsYXllcicsIFBsYXllckRpcmVjdGl2ZSk7XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gICAgICAgICBjb25maWd1cmF0aW9uXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuY29uc3QgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ25vZGVzZWMtaWRlYWJveCcsIFtcbiAgJ3VpLnJvdXRlcicsXG4gICduZ01hdGVyaWFsJyxcbiAgJ25nTWVzc2FnZXMnXG5dKTtcblxubW9kdWxlXG4gIC5jb250cm9sbGVyKCdBcHBDb250cm9sbGVyJywgQXBwQ29udHJvbGxlcilcbiAgLmNvbnRyb2xsZXIoJ0F1dGhDb250cm9sbGVyJywgQXV0aENvbnRyb2xsZXIpO1xuXG5tb2R1bGVcbiAgLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgQXV0aFNlcnZpY2UpXG4gIC5zZXJ2aWNlKCdVc2VyU2VydmljZScsIFVzZXJTZXJ2aWNlKTtcblxubW9kdWxlLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIHJvdXRlc10pO1xuXG5tb2R1bGUucnVuKFtcbiAgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJ1VzZXJTZXJ2aWNlJyxcbiAgKCRyb290U2NvcGUsICRzdGF0ZSwgdXNlclNlcnZpY2UpID0+IHtcbiAgICAvLyBBVVRIRU5USUNBVElPTiBDSEVDS1xuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIChlLCB0b1N0YXRlLyogLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zICovKSA9PiB7XG4gICAgICBpZiAodG9TdGF0ZS5zZWN1cml0eSA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgIGlmICh0b1N0YXRlLnNlY3VyaXR5ID09PSBSRURJUkVDVF9JRl9OT1RfQVVUSEVOVElDQVRFRCAmJiB1c2VyU2VydmljZS51c2VyID09IG51bGwpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgcGFnZSByZXF1aXJlcyBhdXRoZW50aWNhdGlvbi4gUmVkaXJlY3RpbmcgdG8gbG9naW4nKTtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgfSBlbHNlIGlmICh0b1N0YXRlLnNlY3VyaXR5ID09PSBTS0lQX0lGX0FVVEhFTlRJQ0FURUQgJiYgdXNlclNlcnZpY2UudXNlciAhPSBudWxsKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihgWW91IGNhblxcJ3QgYWNjZXNzICR7dG9TdGF0ZS5uYW1lfSB3aGlsZSBsb2dnZWQgaW5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsIChlLCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0aENvbnRyb2xsZXIge1xuXG4gIHN0YXRpYyBnZXQgJGluamVjdCgpIHtcbiAgICByZXR1cm4gWyckc3RhdGUnLCAnQXV0aFNlcnZpY2UnXTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCRzdGF0ZSwgYXV0aFNlcnZpY2UpIHtcbiAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICB0aGlzLmF1dGhTZXJ2aWNlID0gYXV0aFNlcnZpY2U7XG5cbiAgICB0aGlzLmVtYWlsID0gJyc7XG4gICAgdGhpcy5wYXNzd29yZCA9ICcnO1xuICAgIHRoaXMuY29uZmlybSA9ICcnO1xuICB9XG5cbiAgbG9naW4oJGV2ZW50KSB7XG4gICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5hdXRoU2VydmljZS5sb2dpbih7XG4gICAgICBlbWFpbDogdGhpcy5lbWFpbCxcbiAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkXG4gICAgfSk7XG4gIH1cblxuICByZWdpc3RlcigpIHtcbiAgICB0aGlzLmF1dGhTZXJ2aWNlLnJlZ2lzdGVyKHtcbiAgICAgIGVtYWlsOiB0aGlzLmVtYWlsLFxuICAgICAgcGFzc3dvcmQ6IHRoaXMucGFzc3dvcmQsXG4gICAgICBjb25maXJtOiB0aGlzLmNvbmZpcm1cbiAgICB9KTtcbiAgfVxuXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcblxuICBzdGF0aWMgZ2V0ICRpbmplY3QoKSB7XG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHN0YXRlJywgJ1VzZXJTZXJ2aWNlJ107XG4gIH1cblxuICBjb25zdHJ1Y3RvcigkaHR0cCwgJHN0YXRlLCB1c2VyU2VydmljZSkge1xuICAgIHRoaXMuJGh0dHAgPSAkaHR0cDtcbiAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gdXNlclNlcnZpY2U7XG4gIH1cblxuICBsb2dpbihsb2dpbikge1xuICAgIHJldHVybiB0aGlzLiRodHRwXG4gICAgICAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2F1dGgvYXV0aGVudGljYXRlJywgbG9naW4pXG4gICAgICAudGhlbihyID0+IHIuZGF0YSlcbiAgICAgIC50aGVuKHBheWxvYWQgPT4ge1xuICAgICAgICBpZiAocGF5bG9hZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy51c2VyU2VydmljZS51c2VyID0gcGF5bG9hZC51c2VyO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgfSk7XG4gIH1cblxuICByZWdpc3RlcihyZWdpc3RyYXRpb24pIHtcbiAgICBjb25zb2xlLmxvZygncmVnaXN0ZXInKTtcbiAgICByZXR1cm4gdGhpcy4kaHR0cFxuICAgICAgLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hdXRoL3JlZ2lzdGVyJywgcmVnaXN0cmF0aW9uKVxuICAgICAgLnRoZW4ociA9PiByLmRhdGEpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZSAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy4kc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwbGljYXRpb25Db250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7fVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBSRURJUkVDVF9JRl9OT1RfQVVUSEVOVElDQVRFRCwgU0tJUF9JRl9BVVRIRU5USUNBVEVEIH0gZnJvbSAnLi9zZWN1cml0eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJvdXRlcygkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCcvJywgJy9ob21lJyk7XG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9ob21lJyk7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgdXJsOiAnL2hvbWUnLFxuICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL21haW4uaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FwcENvbnRyb2xsZXIgYXMgYXBwQ3RybCcsXG4gICAgc2VjdXJpdHk6IFJFRElSRUNUX0lGX05PVF9BVVRIRU5USUNBVEVEXG4gIH0pO1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICB1cmw6ICcvbG9naW4nLFxuICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL2xvZ2luLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdBdXRoQ29udHJvbGxlciBhcyB1c2VyJyxcbiAgICAvL3NlY3VyaXR5OiBTS0lQX0lGX0FVVEhFTlRJQ0FURURcbiAgfSk7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3JlZ2lzdGVyJywge1xuICAgIHVybDogJy9yZWdpc3RlcicsXG4gICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvcmVnaXN0ZXIuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0F1dGhDb250cm9sbGVyIGFzIHVzZXInLFxuICAgIC8vc2VjdXJpdHk6IFNLSVBfSUZfQVVUSEVOVElDQVRFRFxuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNvbnN0IFJFRElSRUNUX0lGX05PVF9BVVRIRU5USUNBVEVEID0gJ3JlZGlyZWN0aWZub3RhdXRoZW50aWNhdGVkJztcbmV4cG9ydCBjb25zdCBTS0lQX0lGX0FVVEhFTlRJQ0FURUQgPSAnc2tpcGlmYXV0aGVudGljYXRlZCc7XG4iLCIvKipcbiAqIEEgaGVscGVyIGNsYXNzIHRvIHNpbXBsaWZ5IHJlZ2lzdGVyaW5nIEFuZ3VsYXIgY29tcG9uZW50cyBhbmQgcHJvdmlkZSBhIGNvbnNpc3RlbnQgc3ludGF4IGZvciBkb2luZyBzby5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVnaXN0ZXIoYXBwTmFtZSkge1xuXG4gIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShhcHBOYW1lKTtcblxuICByZXR1cm4ge1xuICAgIGRpcmVjdGl2ZTogZGlyZWN0aXZlLFxuICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgc2VydmljZTogc2VydmljZSxcbiAgICBwcm92aWRlcjogcHJvdmlkZXIsXG4gICAgZmFjdG9yeTogZmFjdG9yeVxuICB9O1xuXG4gIGZ1bmN0aW9uIGRpcmVjdGl2ZShuYW1lLCBjb25zdHJ1Y3RvckZuKSB7XG5cbiAgICBjb25zdHJ1Y3RvckZuID0gX25vcm1hbGl6ZUNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yRm4pO1xuXG4gICAgaWYgKCFjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5jb21waWxlKSB7XG4gICAgICAvLyBjcmVhdGUgYW4gZW1wdHkgY29tcGlsZSBmdW5jdGlvbiBpZiBub25lIHdhcyBkZWZpbmVkLlxuICAgICAgY29uc3RydWN0b3JGbi5wcm90b3R5cGUuY29tcGlsZSA9ICgpID0+IHt9O1xuICAgIH1cblxuICAgIHZhciBvcmlnaW5hbENvbXBpbGVGbiA9IF9jbG9uZUZ1bmN0aW9uKGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmNvbXBpbGUpO1xuXG4gICAgLy8gRGVjb3JhdGUgdGhlIGNvbXBpbGUgbWV0aG9kIHRvIGF1dG9tYXRpY2FsbHkgcmV0dXJuIHRoZSBsaW5rIG1ldGhvZCAoaWYgaXQgZXhpc3RzKVxuICAgIC8vIGFuZCBiaW5kIGl0IHRvIHRoZSBjb250ZXh0IG9mIHRoZSBjb25zdHJ1Y3RvciAoc28gYHRoaXNgIHdvcmtzIGNvcnJlY3RseSkuXG4gICAgLy8gVGhpcyBnZXRzIGFyb3VuZCB0aGUgcHJvYmxlbSBvZiBhIG5vbi1sZXhpY2FsIFwidGhpc1wiIHdoaWNoIG9jY3VycyB3aGVuIHRoZSBkaXJlY3RpdmUgY2xhc3MgaXRzZWxmXG4gICAgLy8gcmV0dXJucyBgdGhpcy5saW5rYCBmcm9tIHdpdGhpbiB0aGUgY29tcGlsZSBmdW5jdGlvbi5cbiAgICBfb3ZlcnJpZGUoY29uc3RydWN0b3JGbi5wcm90b3R5cGUsICdjb21waWxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3JpZ2luYWxDb21waWxlRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBpZiAoY29uc3RydWN0b3JGbi5wcm90b3R5cGUubGluaykge1xuICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5saW5rLmJpbmQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICB2YXIgZmFjdG9yeUFycmF5ID0gX2NyZWF0ZUZhY3RvcnlBcnJheShjb25zdHJ1Y3RvckZuKTtcblxuICAgIGFwcC5kaXJlY3RpdmUobmFtZSwgZmFjdG9yeUFycmF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnRyb2xsZXIobmFtZSwgY29udHJ1Y3RvckZuKSB7XG4gICAgYXBwLmNvbnRyb2xsZXIobmFtZSwgY29udHJ1Y3RvckZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcnZpY2UobmFtZSwgY29udHJ1Y3RvckZuKSB7XG4gICAgYXBwLnNlcnZpY2UobmFtZSwgY29udHJ1Y3RvckZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3ZpZGVyKG5hbWUsIGNvbnN0cnVjdG9yRm4pIHtcbiAgICBhcHAucHJvdmlkZXIobmFtZSwgY29uc3RydWN0b3JGbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBmYWN0b3J5KG5hbWUsIGNvbnN0cnVjdG9yRm4pIHtcbiAgICBjb25zdHJ1Y3RvckZuID0gX25vcm1hbGl6ZUNvbnN0cnVjdG9yKGNvbnN0cnVjdG9yRm4pO1xuICAgIHZhciBmYWN0b3J5QXJyYXkgPSBfY3JlYXRlRmFjdG9yeUFycmF5KGNvbnN0cnVjdG9yRm4pO1xuICAgIGFwcC5mYWN0b3J5KG5hbWUsIGZhY3RvcnlBcnJheSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGNvbnN0cnVjdG9yRm4gaXMgYW4gYXJyYXkgb2YgdHlwZSBbJ2RlcDEnLCAnZGVwMicsIC4uLiwgY29uc3RydWN0b3IoKSB7fV1cbiAgICogd2UgbmVlZCB0byBwdWxsIG91dCB0aGUgYXJyYXkgb2YgZGVwZW5kZW5jaWVzIGFuZCBhZGQgaXQgYXMgYW4gJGluamVjdCBwcm9wZXJ0eSBvZiB0aGVcbiAgICogYWN0dWFsIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0gaW5wdXRcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfbm9ybWFsaXplQ29uc3RydWN0b3IoaW5wdXQpIHtcbiAgICB2YXIgY29uc3RydWN0b3JGbjtcblxuICAgIGlmIChpbnB1dC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgIC8vXG4gICAgICB2YXIgaW5qZWN0ZWQgPSBpbnB1dC5zbGljZSgwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgIGNvbnN0cnVjdG9yRm4gPSBpbnB1dFtpbnB1dC5sZW5ndGggLSAxXTtcbiAgICAgIGNvbnN0cnVjdG9yRm4uJGluamVjdCA9IGluamVjdGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdHJ1Y3RvckZuID0gaW5wdXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yRm47XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGludG8gYSBmYWN0b3J5IGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhhdFxuICAgKiBjb25zdHJ1Y3Rvciwgd2l0aCB0aGUgY29ycmVjdCBkZXBlbmRlbmNpZXMgYXV0b21hdGljYWxseSBpbmplY3RlZCBhcyBhcmd1bWVudHMuXG4gICAqXG4gICAqIEluIG9yZGVyIHRvIGluamVjdCB0aGUgZGVwZW5kZW5jaWVzLCB0aGV5IG11c3QgYmUgYXR0YWNoZWQgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHdpdGggdGhlXG4gICAqIGAkaW5qZWN0YCBwcm9wZXJ0eSBhbm5vdGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0b3JGblxuICAgKiBAcmV0dXJucyB7QXJyYXkuPFQ+fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2NyZWF0ZUZhY3RvcnlBcnJheShjb25zdHJ1Y3RvckZuKSB7XG4gICAgLy8gZ2V0IHRoZSBhcnJheSBvZiBkZXBlbmRlbmNpZXMgdGhhdCBhcmUgbmVlZGVkIGJ5IHRoaXMgY29tcG9uZW50IChhcyBjb250YWluZWQgaW4gdGhlIGAkaW5qZWN0YCBhcnJheSlcbiAgICB2YXIgYXJncyA9IGNvbnN0cnVjdG9yRm4uJGluamVjdCB8fCBbXTtcbiAgICB2YXIgZmFjdG9yeUFycmF5ID0gYXJncy5zbGljZSgpOyAvLyBjcmVhdGUgYSBjb3B5IG9mIHRoZSBhcnJheVxuICAgIC8vIFRoZSBmYWN0b3J5QXJyYXkgdXNlcyBBbmd1bGFyJ3MgYXJyYXkgbm90YXRpb24gd2hlcmVieSBlYWNoIGVsZW1lbnQgb2YgdGhlIGFycmF5IGlzIHRoZSBuYW1lIG9mIGFcbiAgICAvLyBkZXBlbmRlbmN5LCBhbmQgdGhlIGZpbmFsIGl0ZW0gaXMgdGhlIGZhY3RvcnkgZnVuY3Rpb24gaXRzZWxmLlxuICAgIGZhY3RvcnlBcnJheS5wdXNoKCguLi5hcmdzKSA9PiB7XG4gICAgICAvL3JldHVybiBuZXcgY29uc3RydWN0b3JGbiguLi5hcmdzKTtcbiAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjb25zdHJ1Y3RvckZuKC4uLmFyZ3MpO1xuICAgICAgZm9yICh2YXIga2V5IGluIGluc3RhbmNlKSB7XG4gICAgICAgIGluc3RhbmNlW2tleV0gPSBpbnN0YW5jZVtrZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZhY3RvcnlBcnJheTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9uZSBhIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSBvcmlnaW5hbFxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBfY2xvbmVGdW5jdGlvbihvcmlnaW5hbCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGFuIG9iamVjdCdzIG1ldGhvZCB3aXRoIGEgbmV3IG9uZSBzcGVjaWZpZWQgYnkgYGNhbGxiYWNrYC5cbiAgICogQHBhcmFtIG9iamVjdFxuICAgKiBAcGFyYW0gbWV0aG9kTmFtZVxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICovXG4gIGZ1bmN0aW9uIF9vdmVycmlkZShvYmplY3QsIG1ldGhvZE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgb2JqZWN0W21ldGhvZE5hbWVdID0gY2FsbGJhY2sob2JqZWN0W21ldGhvZE5hbWVdKVxuICB9XG5cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlclNlcnZpY2Uge1xuXG4gIHN0YXRpYyBnZXQgJGluamVjdCgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxufVxuIl19
