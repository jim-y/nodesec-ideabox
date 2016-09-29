(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _register = require('./lib/register');

var _register2 = _interopRequireDefault(_register);

var _appController = require('./common/app-controller');

var _appController2 = _interopRequireDefault(_appController);

var _dashboardController = require('./dashboard/dashboard-controller');

var _dashboardController2 = _interopRequireDefault(_dashboardController);

var _loginController = require('./authentication/login/login-controller');

var _loginController2 = _interopRequireDefault(_loginController);

var _registerController = require('./authentication/register/register-controller');

var _registerController2 = _interopRequireDefault(_registerController);

var _dashboardService = require('./dashboard/dashboard-service');

var _dashboardService2 = _interopRequireDefault(_dashboardService);

var _authService = require('./authentication/auth/auth-service');

var _authService2 = _interopRequireDefault(_authService);

var _authInterceptor = require('./interceptors/auth-interceptor');

var _authInterceptor2 = _interopRequireDefault(_authInterceptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// ##############################
//          controllers
// ##############################

// ##############################
//           services
// ##############################

// ##############################
//           directives
// ##############################

// ##############################
//           interceptors
// ##############################

// ##############################
//         configuration
// ##############################

var _module = angular.module('nodesec-ideabox', ['ui.router', 'ngMaterial']);

_module.controller('AppController', _appController2.default);
_module.controller('DashboardController', _dashboardController2.default);
_module.controller('LoginController', _loginController2.default);
_module.controller('RegisterController', _registerController2.default);

_module.service('DashboardService', _dashboardService2.default);
_module.service('AuthService', _authService2.default);

// register('nodesec-ideabox')
//   .directive('player', PlayerDirective);

_module.factory('authInterceptor', [].concat(_toConsumableArray(_authInterceptor2.default.$inject), [function () {
  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_authInterceptor2.default, [null].concat(params)))();
}]));
_module.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);

_module.config(['$stateProvider', '$urlRouterProvider', function config($stateProvider, $urlRouterProvider) {
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
}]);

_module.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, authService) {
  // AUTHENTICATION CHECK
  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
    if (toState.skipIfAuthenticated == null && !authService.isLoggedIn()) {
      e.preventDefault();
      console.error('You need to authenticate yourself');
      $state.go('login');
    } else if (toState.skipIfAuthenticated === true && authService.isLoggedIn()) {
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

},{"./authentication/auth/auth-service":2,"./authentication/login/login-controller":3,"./authentication/register/register-controller":4,"./common/app-controller":5,"./dashboard/dashboard-controller":6,"./dashboard/dashboard-service":7,"./interceptors/auth-interceptor":8,"./lib/register":9}],2:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
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
      return ['$http', '$window', '$state'];
    }
  }]);

  function AuthService($http, $window, $state) {
    _classCallCheck(this, AuthService);

    this.$http = $http;
    this.$window = $window;
    this.$state = $state;
  }

  _createClass(AuthService, [{
    key: 'isLoggedIn',
    value: function isLoggedIn() {
      return this.$window.sessionStorage.token != null;
    }
  }, {
    key: 'login',
    value: function login(username, password) {
      var _this = this;

      return this.$http.post('http://localhost:3000/auth/authenticate', { username: username, password: password }).then(function (r) {
        return r.data;
      }).then(function (response) {
        if (response.token) {
          _this.$window.sessionStorage.token = response.token;
        }
      }).catch(function (err) {
        if (err) {
          console.error(err);
        }

        delete _this.$window.sessionStorage.token;
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      delete this.$window.sessionStorage.token;
      this.$state.go('login');
    }
  }, {
    key: 'register',
    value: function register(username, password) {
      return this.$http.post('http://localhost:3000/auth/register', {
        username: username,
        password: password
      }).then(function (r) {
        return r.data;
      });
    }
  }]);

  return AuthService;
}();

exports.default = AuthService;

},{}],3:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
  _createClass(LoginController, null, [{
    key: '$inject',
    get: function get() {
      return ['$state', 'AuthService'];
    }
  }]);

  function LoginController($state, authService) {
    _classCallCheck(this, LoginController);

    this.$state = $state;
    this.authService = authService;

    this.username = '';
    this.password = '';
  }

  _createClass(LoginController, [{
    key: 'login',
    value: function login(username, password) {
      var _this = this;

      this.authService.login(username, password).then(function () {
        return _this.$state.go('app.dashboard');
      });
    }
  }]);

  return LoginController;
}();

exports.default = LoginController;

},{}],4:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RegisterController = function () {
  _createClass(RegisterController, null, [{
    key: '$inject',
    get: function get() {
      return ['$state', 'AuthService'];
    }
  }]);

  function RegisterController($state, authService) {
    _classCallCheck(this, RegisterController);

    this.$state = $state;
    this.authService = authService;

    this.username = '';
    this.password = '';
  }

  _createClass(RegisterController, [{
    key: 'register',
    value: function register() {
      var _this = this;

      this.authService.register(this.username, this.password).then(function () {
        return _this.$state.go('login');
      });
    }
  }]);

  return RegisterController;
}();

exports.default = RegisterController;

},{}],5:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppController = function () {
  _createClass(AppController, null, [{
    key: '$inject',
    get: function get() {
      return ['$mdSidenav', 'AuthService'];
    }
  }]);

  function AppController($mdSidenav, authService) {
    _classCallCheck(this, AppController);

    this.$mdSidenav = $mdSidenav;
    this.authService = authService;
  }

  _createClass(AppController, [{
    key: 'toggleNav',
    value: function toggleNav() {
      this.$mdSidenav('left').toggle();
    }
  }, {
    key: 'logout',
    value: function logout() {
      this.authService.logout();
    }
  }]);

  return AppController;
}();

exports.default = AppController;

},{}],6:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DashboardController = function () {
  _createClass(DashboardController, null, [{
    key: '$inject',
    get: function get() {
      return ['DashboardService'];
    }
  }]);

  function DashboardController(dashboardService) {
    _classCallCheck(this, DashboardController);

    this.dashboardService = dashboardService;
    this.users = [];
  }

  _createClass(DashboardController, [{
    key: 'getUsers',
    value: function getUsers() {
      var _this = this;

      this.dashboardService.getUsers().then(function (users) {
        _this.users = users;
      });
    }
  }]);

  return DashboardController;
}();

exports.default = DashboardController;

},{}],7:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DashboardService = function () {
  _createClass(DashboardService, null, [{
    key: '$inject',
    get: function get() {
      return ['$http'];
    }
  }]);

  function DashboardService($http) {
    _classCallCheck(this, DashboardService);

    this.$http = $http;
  }

  _createClass(DashboardService, [{
    key: 'getUsers',
    value: function getUsers() {
      return this.$http.get('http://localhost:3000/user/users').then(function (r) {
        return r.data;
      });
    }
  }]);

  return DashboardService;
}();

exports.default = DashboardService;

},{}],8:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthInterceptor = function () {
  _createClass(AuthInterceptor, null, [{
    key: '$inject',
    get: function get() {
      return ['$rootScope', '$q', '$window'];
    }
  }]);

  function AuthInterceptor($rootScope, $q, $window) {
    _classCallCheck(this, AuthInterceptor);

    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$window = $window;

    this.request = this.request.bind(this);
    this.response = this.response.bind(this);
  }

  _createClass(AuthInterceptor, [{
    key: 'request',
    value: function request(config) {
      config.headers = config.headers || {};

      if (this.$window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + this.$window.sessionStorage.token;
      }

      return config;
    }
  }, {
    key: 'response',
    value: function response(_response) {
      if (_response.status === 403) {
        // handle the case where the user is not authenticated
      }

      return _response || this.$q.when(_response);
    }
  }]);

  return AuthInterceptor;
}();

exports.default = AuthInterceptor;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = register;
/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for doing so.
 */
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2F1dGhlbnRpY2F0aW9uL2F1dGgvYXV0aC1zZXJ2aWNlLmpzIiwiYXBwL2pzL2F1dGhlbnRpY2F0aW9uL2xvZ2luL2xvZ2luLWNvbnRyb2xsZXIuanMiLCJhcHAvanMvYXV0aGVudGljYXRpb24vcmVnaXN0ZXIvcmVnaXN0ZXItY29udHJvbGxlci5qcyIsImFwcC9qcy9jb21tb24vYXBwLWNvbnRyb2xsZXIuanMiLCJhcHAvanMvZGFzaGJvYXJkL2Rhc2hib2FyZC1jb250cm9sbGVyLmpzIiwiYXBwL2pzL2Rhc2hib2FyZC9kYXNoYm9hcmQtc2VydmljZS5qcyIsImFwcC9qcy9pbnRlcmNlcHRvcnMvYXV0aC1pbnRlcmNlcHRvci5qcyIsImFwcC9qcy9saWIvcmVnaXN0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQTs7OztBQU1BOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBTUE7Ozs7QUFDQTs7OztBQVVBOzs7Ozs7OztBQXhCQTtBQUNBO0FBQ0E7O0FBT0E7QUFDQTtBQUNBOztBQUtBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBSUE7QUFDQTtBQUNBOztBQUVBLElBQU0sVUFBUyxRQUFRLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxDQUMvQyxXQUQrQyxFQUUvQyxZQUYrQyxDQUFsQyxDQUFmOztBQUtBLFFBQU8sVUFBUCxDQUFrQixlQUFsQjtBQUNBLFFBQU8sVUFBUCxDQUFrQixxQkFBbEI7QUFDQSxRQUFPLFVBQVAsQ0FBa0IsaUJBQWxCO0FBQ0EsUUFBTyxVQUFQLENBQWtCLG9CQUFsQjs7QUFFQSxRQUFPLE9BQVAsQ0FBZSxrQkFBZjtBQUNBLFFBQU8sT0FBUCxDQUFlLGFBQWY7O0FBRUE7QUFDQTs7QUFFQSxRQUFPLE9BQVAsQ0FBZSxpQkFBZiwrQkFBc0MsMEJBQWdCLE9BQXRELElB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QUFMLEVBQW5CLENBSDBDLENBR1Q7QUFDakM7QUFDQTtBQUNBLGlCQUFhLElBQWIsQ0FBa0IsWUFBYTtBQUFBLHdDQUFULElBQVM7QUFBVCxZQUFTO0FBQUE7O0FBQzdCO0FBQ0EsVUFBSSw4Q0FBZSxhQUFmLGdCQUFnQyxJQUFoQyxLQUFKO0FBQ0EsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsUUFBaEIsRUFBMEI7QUFDeEIsaUJBQVMsR0FBVCxJQUFnQixTQUFTLEdBQVQsQ0FBaEI7QUFDRDtBQUNELGFBQU8sUUFBUDtBQUNELEtBUEQ7O0FBU0EsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsV0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDO0FBQ2hDLFdBQU8sWUFBWTtBQUNqQixhQUFPLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsU0FBckIsQ0FBUDtBQUNELEtBRkQ7QUFHRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLFVBQTNCLEVBQXVDLFFBQXZDLEVBQWlEO0FBQy9DLFdBQU8sVUFBUCxJQUFxQixTQUFTLE9BQU8sVUFBUCxDQUFULENBQXJCO0FBQ0Q7QUFFRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCByZWdpc3RlciBmcm9tICcuL2xpYi9yZWdpc3Rlcic7XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gICAgICAgICAgY29udHJvbGxlcnNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5pbXBvcnQgQXBwQ29udHJvbGxlciBmcm9tICcuL2NvbW1vbi9hcHAtY29udHJvbGxlcic7XG5pbXBvcnQgRGFzaGJvYXJkQ29udHJvbGxlciBmcm9tICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQtY29udHJvbGxlcic7XG5pbXBvcnQgTG9naW5Db250cm9sbGVyIGZyb20gJy4vYXV0aGVudGljYXRpb24vbG9naW4vbG9naW4tY29udHJvbGxlcic7XG5pbXBvcnQgUmVnaXN0ZXJDb250cm9sbGVyIGZyb20gJy4vYXV0aGVudGljYXRpb24vcmVnaXN0ZXIvcmVnaXN0ZXItY29udHJvbGxlcic7XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gICAgICAgICAgIHNlcnZpY2VzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuaW1wb3J0IERhc2hib2FyZFNlcnZpY2UgZnJvbSAnLi9kYXNoYm9hcmQvZGFzaGJvYXJkLXNlcnZpY2UnO1xuaW1wb3J0IEF1dGhTZXJ2aWNlIGZyb20gJy4vYXV0aGVudGljYXRpb24vYXV0aC9hdXRoLXNlcnZpY2UnO1xuXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vICAgICAgICAgICBkaXJlY3RpdmVzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyAgICAgICAgICAgaW50ZXJjZXB0b3JzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciBmcm9tICcuL2ludGVyY2VwdG9ycy9hdXRoLWludGVyY2VwdG9yJztcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyAgICAgICAgIGNvbmZpZ3VyYXRpb25cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5jb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbm9kZXNlYy1pZGVhYm94JywgW1xuICAndWkucm91dGVyJyxcbiAgJ25nTWF0ZXJpYWwnXG5dKTtcblxubW9kdWxlLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKTtcbm1vZHVsZS5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5tb2R1bGUuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgTG9naW5Db250cm9sbGVyKTtcbm1vZHVsZS5jb250cm9sbGVyKCdSZWdpc3RlckNvbnRyb2xsZXInLCBSZWdpc3RlckNvbnRyb2xsZXIpO1xuXG5tb2R1bGUuc2VydmljZSgnRGFzaGJvYXJkU2VydmljZScsIERhc2hib2FyZFNlcnZpY2UpO1xubW9kdWxlLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgQXV0aFNlcnZpY2UpO1xuXG4vLyByZWdpc3Rlcignbm9kZXNlYy1pZGVhYm94Jylcbi8vICAgLmRpcmVjdGl2ZSgncGxheWVyJywgUGxheWVyRGlyZWN0aXZlKTtcblxubW9kdWxlLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvcicsIFsuLi5BdXRoSW50ZXJjZXB0b3IuJGluamVjdCwgKC4uLnBhcmFtcykgPT4gbmV3IEF1dGhJbnRlcmNlcHRvciguLi5wYXJhbXMpXSk7XG5tb2R1bGUuY29uZmlnKFsnJGh0dHBQcm92aWRlcicsICgkaHR0cFByb3ZpZGVyKSA9PiB7XG4gICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xufV0pO1xuXG5tb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgZnVuY3Rpb24gY29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvZGFzaGJvYXJkJyk7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hdXRoZW50aWNhdGlvbi9sb2dpbi9sb2dpbi5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICBza2lwSWZBdXRoZW50aWNhdGVkOiB0cnVlXG4gICAgfSk7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncmVnaXN0ZXInLCB7XG4gICAgICB1cmw6ICcvcmVnaXN0ZXInLFxuICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hdXRoZW50aWNhdGlvbi9yZWdpc3Rlci9yZWdpc3Rlci5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckNvbnRyb2xsZXIgYXMgY3RybCcsXG4gICAgICBza2lwSWZBdXRoZW50aWNhdGVkOiB0cnVlXG4gICAgfSk7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYXBwJywge1xuICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9hcHAuaHRtbCdcbiAgICB9KTtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xuICAgICAgdXJsOiAnXi9kYXNoYm9hcmQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdqcy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZENvbnRyb2xsZXIgYXMgY3RybCdcbiAgICB9KTtcbiAgfVxuXSk7XG5cbm1vZHVsZS5ydW4oWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICdBdXRoU2VydmljZScsICgkcm9vdFNjb3BlLCAkc3RhdGUsIGF1dGhTZXJ2aWNlKSA9PiB7XG4gIC8vIEFVVEhFTlRJQ0FUSU9OIENIRUNLXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIChlLCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSA9PiB7XG4gICAgaWYgKHRvU3RhdGUuc2tpcElmQXV0aGVudGljYXRlZCA9PSBudWxsICYmICFhdXRoU2VydmljZS5pc0xvZ2dlZEluKCkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1lvdSBuZWVkIHRvIGF1dGhlbnRpY2F0ZSB5b3Vyc2VsZicpO1xuICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH0gZWxzZSBpZiAodG9TdGF0ZS5za2lwSWZBdXRoZW50aWNhdGVkID09PSB0cnVlICYmIGF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW4oKSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc29sZS5lcnJvcihgWW91IGNhblxcJ3QgYWNjZXNzICR7dG9TdGF0ZS5uYW1lfSB3aGlsZSBsb2dnZWQgaW5gKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsIGZ1bmN0aW9uIChlLCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9KTtcbn1dKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dGhTZXJ2aWNlIHtcblxuICBzdGF0aWMgZ2V0ICRpbmplY3QoKSB7XG4gICAgcmV0dXJuIFsnJGh0dHAnLCAnJHdpbmRvdycsICckc3RhdGUnXTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCRodHRwLCAkd2luZG93LCAkc3RhdGUpIHtcbiAgICB0aGlzLiRodHRwID0gJGh0dHA7XG4gICAgdGhpcy4kd2luZG93ID0gJHdpbmRvdztcbiAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgfVxuXG4gIGlzTG9nZ2VkSW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuJHdpbmRvdy5zZXNzaW9uU3RvcmFnZS50b2tlbiAhPSBudWxsO1xuICB9XG5cbiAgbG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIHRoaXMuJGh0dHBcbiAgICAgIC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXV0aC9hdXRoZW50aWNhdGUnLCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9KVxuICAgICAgLnRoZW4ociA9PiByLmRhdGEpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS50b2tlbikge1xuICAgICAgICAgIHRoaXMuJHdpbmRvdy5zZXNzaW9uU3RvcmFnZS50b2tlbiA9IHJlc3BvbnNlLnRva2VuO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgdGhpcy4kd2luZG93LnNlc3Npb25TdG9yYWdlLnRva2VuO1xuICAgICAgfSk7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgZGVsZXRlIHRoaXMuJHdpbmRvdy5zZXNzaW9uU3RvcmFnZS50b2tlbjtcbiAgICB0aGlzLiRzdGF0ZS5nbygnbG9naW4nKTtcbiAgfVxuXG4gIHJlZ2lzdGVyKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgIHJldHVybiB0aGlzLiRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hdXRoL3JlZ2lzdGVyJywge1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZFxuICAgIH0pLnRoZW4ociA9PiByLmRhdGEpO1xuICB9XG5cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luQ29udHJvbGxlciB7XG5cbiAgc3RhdGljIGdldCAkaW5qZWN0KCkge1xuICAgIHJldHVybiBbJyRzdGF0ZScsICdBdXRoU2VydmljZSddO1xuICB9XG5cbiAgY29uc3RydWN0b3IoJHN0YXRlLCBhdXRoU2VydmljZSkge1xuICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgIHRoaXMuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcblxuICAgIHRoaXMudXNlcm5hbWUgPSAnJztcbiAgICB0aGlzLnBhc3N3b3JkID0gJyc7XG4gIH1cblxuICBsb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcbiAgICB0aGlzLmF1dGhTZXJ2aWNlXG4gICAgICAubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy4kc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKSk7XG4gIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdGVyQ29udHJvbGxlciB7XG5cbiAgc3RhdGljIGdldCAkaW5qZWN0KCkge1xuICAgIHJldHVybiBbJyRzdGF0ZScsICdBdXRoU2VydmljZSddO1xuICB9XG5cbiAgY29uc3RydWN0b3IoJHN0YXRlLCBhdXRoU2VydmljZSkge1xuICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgIHRoaXMuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcblxuICAgIHRoaXMudXNlcm5hbWUgPSAnJztcbiAgICB0aGlzLnBhc3N3b3JkID0gJyc7XG4gIH1cblxuICByZWdpc3RlcigpIHtcbiAgICB0aGlzLmF1dGhTZXJ2aWNlXG4gICAgICAucmVnaXN0ZXIodGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuJHN0YXRlLmdvKCdsb2dpbicpKTtcbiAgfVxuXG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkga2xpbmcgb24gOS8yOC8xNi5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBDb250cm9sbGVyIHtcblxuICBzdGF0aWMgZ2V0ICRpbmplY3QoKSB7XG4gICAgcmV0dXJuIFsnJG1kU2lkZW5hdicsICdBdXRoU2VydmljZSddO1xuICB9XG5cbiAgY29uc3RydWN0b3IoJG1kU2lkZW5hdiwgYXV0aFNlcnZpY2UpIHtcbiAgICB0aGlzLiRtZFNpZGVuYXYgPSAkbWRTaWRlbmF2O1xuICAgIHRoaXMuYXV0aFNlcnZpY2UgPSBhdXRoU2VydmljZTtcbiAgfVxuXG4gIHRvZ2dsZU5hdigpIHtcbiAgICB0aGlzLiRtZFNpZGVuYXYoJ2xlZnQnKS50b2dnbGUoKTtcbiAgfVxuXG4gIGxvZ291dCgpIHtcbiAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICB9XG5cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhc2hib2FyZENvbnRyb2xsZXIge1xuXG4gIHN0YXRpYyBnZXQgJGluamVjdCgpIHtcbiAgICByZXR1cm4gWydEYXNoYm9hcmRTZXJ2aWNlJ107XG4gIH1cblxuICBjb25zdHJ1Y3RvcihkYXNoYm9hcmRTZXJ2aWNlKSB7XG4gICAgdGhpcy5kYXNoYm9hcmRTZXJ2aWNlID0gZGFzaGJvYXJkU2VydmljZTtcbiAgICB0aGlzLnVzZXJzID0gW107XG4gIH1cblxuICBnZXRVc2VycygpIHtcbiAgICB0aGlzLmRhc2hib2FyZFNlcnZpY2VcbiAgICAgIC5nZXRVc2VycygpXG4gICAgICAudGhlbih1c2VycyA9PiB7XG4gICAgICAgIHRoaXMudXNlcnMgPSB1c2VycztcbiAgICAgIH0pO1xuICB9XG5cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhc2hib2FyZFNlcnZpY2Uge1xuXG4gIHN0YXRpYyBnZXQgJGluamVjdCgpIHtcbiAgICByZXR1cm4gWyckaHR0cCddO1xuICB9XG5cbiAgY29uc3RydWN0b3IoJGh0dHApIHtcbiAgICB0aGlzLiRodHRwID0gJGh0dHA7XG4gIH1cblxuICBnZXRVc2VycygpIHtcbiAgICByZXR1cm4gdGhpcy4kaHR0cFxuICAgICAgLmdldCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL3VzZXIvdXNlcnMnKVxuICAgICAgLnRoZW4ociA9PiByLmRhdGEpO1xuICB9XG5cbn1cblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGtsaW5nIG9uIDkvMjgvMTYuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0aEludGVyY2VwdG9yIHtcblxuICBzdGF0aWMgZ2V0ICRpbmplY3QoKSB7XG4gICAgcmV0dXJuIFsnJHJvb3RTY29wZScsICckcScsICckd2luZG93J107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlLCAkcSwgJHdpbmRvdykge1xuICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgdGhpcy4kcSA9ICRxO1xuICAgIHRoaXMuJHdpbmRvdyA9ICR3aW5kb3c7XG5cbiAgICB0aGlzLnJlcXVlc3QgPSB0aGlzLnJlcXVlc3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlc3BvbnNlID0gdGhpcy5yZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVxdWVzdChjb25maWcpIHtcbiAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gICAgaWYgKHRoaXMuJHdpbmRvdy5zZXNzaW9uU3RvcmFnZS50b2tlbikge1xuICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHt0aGlzLiR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UudG9rZW59YDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uZmlnO1xuICB9XG5cbiAgcmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDMpIHtcbiAgICAgIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgdXNlciBpcyBub3QgYXV0aGVudGljYXRlZFxuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZSB8fCB0aGlzLiRxLndoZW4ocmVzcG9uc2UpO1xuICB9XG5cbn1cbiIsIi8qKlxuICogQSBoZWxwZXIgY2xhc3MgdG8gc2ltcGxpZnkgcmVnaXN0ZXJpbmcgQW5ndWxhciBjb21wb25lbnRzIGFuZCBwcm92aWRlIGEgY29uc2lzdGVudCBzeW50YXggZm9yIGRvaW5nIHNvLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWdpc3RlcihhcHBOYW1lKSB7XG5cbiAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKGFwcE5hbWUpO1xuXG4gIHJldHVybiB7XG4gICAgZGlyZWN0aXZlOiBkaXJlY3RpdmUsXG4gICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICBzZXJ2aWNlOiBzZXJ2aWNlLFxuICAgIHByb3ZpZGVyOiBwcm92aWRlcixcbiAgICBmYWN0b3J5OiBmYWN0b3J5XG4gIH07XG5cbiAgZnVuY3Rpb24gZGlyZWN0aXZlKG5hbWUsIGNvbnN0cnVjdG9yRm4pIHtcblxuICAgIGNvbnN0cnVjdG9yRm4gPSBfbm9ybWFsaXplQ29uc3RydWN0b3IoY29uc3RydWN0b3JGbik7XG5cbiAgICBpZiAoIWNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmNvbXBpbGUpIHtcbiAgICAgIC8vIGNyZWF0ZSBhbiBlbXB0eSBjb21waWxlIGZ1bmN0aW9uIGlmIG5vbmUgd2FzIGRlZmluZWQuXG4gICAgICBjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5jb21waWxlID0gKCkgPT4ge307XG4gICAgfVxuXG4gICAgdmFyIG9yaWdpbmFsQ29tcGlsZUZuID0gX2Nsb25lRnVuY3Rpb24oY29uc3RydWN0b3JGbi5wcm90b3R5cGUuY29tcGlsZSk7XG5cbiAgICAvLyBEZWNvcmF0ZSB0aGUgY29tcGlsZSBtZXRob2QgdG8gYXV0b21hdGljYWxseSByZXR1cm4gdGhlIGxpbmsgbWV0aG9kIChpZiBpdCBleGlzdHMpXG4gICAgLy8gYW5kIGJpbmQgaXQgdG8gdGhlIGNvbnRleHQgb2YgdGhlIGNvbnN0cnVjdG9yIChzbyBgdGhpc2Agd29ya3MgY29ycmVjdGx5KS5cbiAgICAvLyBUaGlzIGdldHMgYXJvdW5kIHRoZSBwcm9ibGVtIG9mIGEgbm9uLWxleGljYWwgXCJ0aGlzXCIgd2hpY2ggb2NjdXJzIHdoZW4gdGhlIGRpcmVjdGl2ZSBjbGFzcyBpdHNlbGZcbiAgICAvLyByZXR1cm5zIGB0aGlzLmxpbmtgIGZyb20gd2l0aGluIHRoZSBjb21waWxlIGZ1bmN0aW9uLlxuICAgIF9vdmVycmlkZShjb25zdHJ1Y3RvckZuLnByb3RvdHlwZSwgJ2NvbXBpbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBvcmlnaW5hbENvbXBpbGVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGlmIChjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5saW5rKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmxpbmsuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHZhciBmYWN0b3J5QXJyYXkgPSBfY3JlYXRlRmFjdG9yeUFycmF5KGNvbnN0cnVjdG9yRm4pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZShuYW1lLCBmYWN0b3J5QXJyYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gY29udHJvbGxlcihuYW1lLCBjb250cnVjdG9yRm4pIHtcbiAgICBhcHAuY29udHJvbGxlcihuYW1lLCBjb250cnVjdG9yRm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VydmljZShuYW1lLCBjb250cnVjdG9yRm4pIHtcbiAgICBhcHAuc2VydmljZShuYW1lLCBjb250cnVjdG9yRm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvdmlkZXIobmFtZSwgY29uc3RydWN0b3JGbikge1xuICAgIGFwcC5wcm92aWRlcihuYW1lLCBjb25zdHJ1Y3RvckZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhY3RvcnkobmFtZSwgY29uc3RydWN0b3JGbikge1xuICAgIGNvbnN0cnVjdG9yRm4gPSBfbm9ybWFsaXplQ29uc3RydWN0b3IoY29uc3RydWN0b3JGbik7XG4gICAgdmFyIGZhY3RvcnlBcnJheSA9IF9jcmVhdGVGYWN0b3J5QXJyYXkoY29uc3RydWN0b3JGbik7XG4gICAgYXBwLmZhY3RvcnkobmFtZSwgZmFjdG9yeUFycmF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgY29uc3RydWN0b3JGbiBpcyBhbiBhcnJheSBvZiB0eXBlIFsnZGVwMScsICdkZXAyJywgLi4uLCBjb25zdHJ1Y3RvcigpIHt9XVxuICAgKiB3ZSBuZWVkIHRvIHB1bGwgb3V0IHRoZSBhcnJheSBvZiBkZXBlbmRlbmNpZXMgYW5kIGFkZCBpdCBhcyBhbiAkaW5qZWN0IHByb3BlcnR5IG9mIHRoZVxuICAgKiBhY3R1YWwgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBpbnB1dFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9ub3JtYWxpemVDb25zdHJ1Y3RvcihpbnB1dCkge1xuICAgIHZhciBjb25zdHJ1Y3RvckZuO1xuXG4gICAgaWYgKGlucHV0LmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgLy9cbiAgICAgIHZhciBpbmplY3RlZCA9IGlucHV0LnNsaWNlKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgY29uc3RydWN0b3JGbiA9IGlucHV0W2lucHV0Lmxlbmd0aCAtIDFdO1xuICAgICAgY29uc3RydWN0b3JGbi4kaW5qZWN0ID0gaW5qZWN0ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0cnVjdG9yRm4gPSBpbnB1dDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uc3RydWN0b3JGbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgY29uc3RydWN0b3IgZnVuY3Rpb24gaW50byBhIGZhY3RvcnkgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIG5ldyBpbnN0YW5jZSBvZiB0aGF0XG4gICAqIGNvbnN0cnVjdG9yLCB3aXRoIHRoZSBjb3JyZWN0IGRlcGVuZGVuY2llcyBhdXRvbWF0aWNhbGx5IGluamVjdGVkIGFzIGFyZ3VtZW50cy5cbiAgICpcbiAgICogSW4gb3JkZXIgdG8gaW5qZWN0IHRoZSBkZXBlbmRlbmNpZXMsIHRoZXkgbXVzdCBiZSBhdHRhY2hlZCB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24gd2l0aCB0aGVcbiAgICogYCRpbmplY3RgIHByb3BlcnR5IGFubm90YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RvckZuXG4gICAqIEByZXR1cm5zIHtBcnJheS48VD59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfY3JlYXRlRmFjdG9yeUFycmF5KGNvbnN0cnVjdG9yRm4pIHtcbiAgICAvLyBnZXQgdGhlIGFycmF5IG9mIGRlcGVuZGVuY2llcyB0aGF0IGFyZSBuZWVkZWQgYnkgdGhpcyBjb21wb25lbnQgKGFzIGNvbnRhaW5lZCBpbiB0aGUgYCRpbmplY3RgIGFycmF5KVxuICAgIHZhciBhcmdzID0gY29uc3RydWN0b3JGbi4kaW5qZWN0IHx8IFtdO1xuICAgIHZhciBmYWN0b3J5QXJyYXkgPSBhcmdzLnNsaWNlKCk7IC8vIGNyZWF0ZSBhIGNvcHkgb2YgdGhlIGFycmF5XG4gICAgLy8gVGhlIGZhY3RvcnlBcnJheSB1c2VzIEFuZ3VsYXIncyBhcnJheSBub3RhdGlvbiB3aGVyZWJ5IGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXkgaXMgdGhlIG5hbWUgb2YgYVxuICAgIC8vIGRlcGVuZGVuY3ksIGFuZCB0aGUgZmluYWwgaXRlbSBpcyB0aGUgZmFjdG9yeSBmdW5jdGlvbiBpdHNlbGYuXG4gICAgZmFjdG9yeUFycmF5LnB1c2goKC4uLmFyZ3MpID0+IHtcbiAgICAgIC8vcmV0dXJuIG5ldyBjb25zdHJ1Y3RvckZuKC4uLmFyZ3MpO1xuICAgICAgdmFyIGluc3RhbmNlID0gbmV3IGNvbnN0cnVjdG9yRm4oLi4uYXJncyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gaW5zdGFuY2UpIHtcbiAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGluc3RhbmNlW2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmFjdG9yeUFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIENsb25lIGEgZnVuY3Rpb25cbiAgICogQHBhcmFtIG9yaWdpbmFsXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIF9jbG9uZUZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgYW4gb2JqZWN0J3MgbWV0aG9kIHdpdGggYSBuZXcgb25lIHNwZWNpZmllZCBieSBgY2FsbGJhY2tgLlxuICAgKiBAcGFyYW0gb2JqZWN0XG4gICAqIEBwYXJhbSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKi9cbiAgZnVuY3Rpb24gX292ZXJyaWRlKG9iamVjdCwgbWV0aG9kTmFtZSwgY2FsbGJhY2spIHtcbiAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBjYWxsYmFjayhvYmplY3RbbWV0aG9kTmFtZV0pXG4gIH1cblxufVxuIl19
