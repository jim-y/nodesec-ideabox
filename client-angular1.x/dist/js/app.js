(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _register = require('./lib/register');

var _register2 = _interopRequireDefault(_register);

var _appController = require('./common/app-controller');

var _appController2 = _interopRequireDefault(_appController);

var _dashboardController = require('./dashboard/dashboard-controller');

var _dashboardController2 = _interopRequireDefault(_dashboardController);

var _dashboardService = require('./dashboard/dashboard-service');

var _dashboardService2 = _interopRequireDefault(_dashboardService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ##############################
//           directives
// ##############################

// ##############################
//         configuration
// ##############################

var _module = angular.module('nodesec-ideabox', ['ui.router', 'ngMaterial']);

// ##############################
//           services
// ##############################

// ##############################
//          controllers
// ##############################

_module.controller('AppController', _appController2.default);
_module.controller('DashboardController', _dashboardController2.default);

_module.service('DashboardService', _dashboardService2.default);

// register('nodesec-ideabox')
//   .directive('player', PlayerDirective);

_module.config(['$stateProvider', '$urlRouterProvider', function config($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/', '/dashboard');

  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'js/dashboard/dashboard.html',
    controller: 'DashboardController as ctrl'
  });
}]);

_module.run(function ($rootScope) {
  $rootScope.$on('$stateChangeError', console.log.bind(console));
});

},{"./common/app-controller":2,"./dashboard/dashboard-controller":3,"./dashboard/dashboard-service":4,"./lib/register":5}],2:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppController = function AppController() {
  _classCallCheck(this, AppController);
};

exports.default = AppController;

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

var DashboardController = function () {
  _createClass(DashboardController, null, [{
    key: '$inject',
    get: function get() {
      return ['$mdSidenav'];
    }
  }]);

  function DashboardController($mdSidenav) {
    _classCallCheck(this, DashboardController);

    this.$mdSidenav = $mdSidenav;
  }

  _createClass(DashboardController, [{
    key: 'open',
    value: function open() {
      this.$mdSidenav('left').open();
    }
  }]);

  return DashboardController;
}();

exports.default = DashboardController;

},{}],4:[function(require,module,exports){
/**
 * Created by kling on 9/28/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DashboardService = function DashboardService() {
  _classCallCheck(this, DashboardService);
};

exports.default = DashboardService;

},{}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvYXBwLmpzIiwiYXBwL2pzL2NvbW1vbi9hcHAtY29udHJvbGxlci5qcyIsImFwcC9qcy9kYXNoYm9hcmQvZGFzaGJvYXJkLWNvbnRyb2xsZXIuanMiLCJhcHAvanMvZGFzaGJvYXJkL2Rhc2hib2FyZC1zZXJ2aWNlLmpzIiwiYXBwL2pzL2xpYi9yZWdpc3Rlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOzs7O0FBTUE7Ozs7QUFDQTs7OztBQU1BOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQU0sVUFBUyxRQUFRLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxDQUMvQyxXQUQrQyxFQUUvQyxZQUYrQyxDQUFsQyxDQUFmOztBQWRBO0FBQ0E7QUFDQTs7QUFUQTtBQUNBO0FBQ0E7O0FBd0JBLFFBQU8sVUFBUCxDQUFrQixlQUFsQjtBQUNBLFFBQU8sVUFBUCxDQUFrQixxQkFBbEI7O0FBRUEsUUFBTyxPQUFQLENBQWUsa0JBQWY7O0FBRUE7QUFDQTs7QUFFQSxRQUFPLE1BQVAsQ0FBYyxDQUFDLGdCQUFELEVBQW1CLG9CQUFuQixFQUNaLFNBQVMsTUFBVCxDQUFnQixjQUFoQixFQUFnQyxrQkFBaEMsRUFBb0Q7QUFDbEQscUJBQW1CLElBQW5CLENBQXdCLEdBQXhCLEVBQTZCLFlBQTdCOztBQUVBLGlCQUFlLEtBQWYsQ0FBcUIsV0FBckIsRUFBa0M7QUFDaEMsU0FBSyxZQUQyQjtBQUVoQyxpQkFBYSw2QkFGbUI7QUFHaEMsZ0JBQVk7QUFIb0IsR0FBbEM7QUFLRCxDQVRXLENBQWQ7O0FBWUEsUUFBTyxHQUFQLENBQVcsc0JBQWM7QUFDdkIsYUFBVyxHQUFYLENBQWUsbUJBQWYsRUFBb0MsUUFBUSxHQUFSLENBQVksSUFBWixDQUFpQixPQUFqQixDQUFwQztBQUNELENBRkQ7OztBQ2xEQTs7O0FBR0E7Ozs7Ozs7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QXhCO0FBQ0QsS0FMRCxNQUtPO0FBQ0wsc0JBQWdCLEtBQWhCO0FBQ0Q7O0FBRUQsV0FBTyxhQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O0FBV0EsV0FBUyxtQkFBVCxDQUE2QixhQUE3QixFQUE0QztBQUMxQztBQUNBLFFBQUksT0FBTyxjQUFjLE9BQWQsSUFBeUIsRUFBcEM7QUFDQSxRQUFJLGVBQWUsS0FBSyxLQUFMLEVBQW5CLENBSDBDLENBR1Q7QUFDakM7QUFDQTtBQUNBLGlCQUFhLElBQWIsQ0FBa0IsWUFBYTtBQUFBLHdDQUFULElBQVM7QUFBVCxZQUFTO0FBQUE7O0FBQzdCO0FBQ0EsVUFBSSw4Q0FBZSxhQUFmLGdCQUFnQyxJQUFoQyxLQUFKO0FBQ0EsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsUUFBaEIsRUFBMEI7QUFDeEIsaUJBQVMsR0FBVCxJQUFnQixTQUFTLEdBQVQsQ0FBaEI7QUFDRDtBQUNELGFBQU8sUUFBUDtBQUNELEtBUEQ7O0FBU0EsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsV0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDO0FBQ2hDLFdBQU8sWUFBWTtBQUNqQixhQUFPLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsU0FBckIsQ0FBUDtBQUNELEtBRkQ7QUFHRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxTQUFULENBQW1CLE1BQW5CLEVBQTJCLFVBQTNCLEVBQXVDLFFBQXZDLEVBQWlEO0FBQy9DLFdBQU8sVUFBUCxJQUFxQixTQUFTLE9BQU8sVUFBUCxDQUFULENBQXJCO0FBQ0Q7QUFFRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCByZWdpc3RlciBmcm9tICcuL2xpYi9yZWdpc3Rlcic7XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gICAgICAgICAgY29udHJvbGxlcnNcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5pbXBvcnQgQXBwQ29udHJvbGxlciBmcm9tICcuL2NvbW1vbi9hcHAtY29udHJvbGxlcic7XG5pbXBvcnQgRGFzaGJvYXJkQ29udHJvbGxlciBmcm9tICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQtY29udHJvbGxlcic7XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8gICAgICAgICAgIHNlcnZpY2VzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuaW1wb3J0IERhc2hib2FyZFNlcnZpY2UgZnJvbSAnLi9kYXNoYm9hcmQvZGFzaGJvYXJkLXNlcnZpY2UnO1xuXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbi8vICAgICAgICAgICBkaXJlY3RpdmVzXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vLyAgICAgICAgIGNvbmZpZ3VyYXRpb25cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5jb25zdCBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbm9kZXNlYy1pZGVhYm94JywgW1xuICAndWkucm91dGVyJyxcbiAgJ25nTWF0ZXJpYWwnXG5dKTtcblxubW9kdWxlLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKTtcbm1vZHVsZS5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG5cbm1vZHVsZS5zZXJ2aWNlKCdEYXNoYm9hcmRTZXJ2aWNlJywgRGFzaGJvYXJkU2VydmljZSk7XG5cbi8vIHJlZ2lzdGVyKCdub2Rlc2VjLWlkZWFib3gnKVxuLy8gICAuZGlyZWN0aXZlKCdwbGF5ZXInLCBQbGF5ZXJEaXJlY3RpdmUpO1xuXG5tb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgZnVuY3Rpb24gY29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignLycsICcvZGFzaGJvYXJkJyk7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnZGFzaGJvYXJkJywge1xuICAgICAgdXJsOiAnL2Rhc2hib2FyZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnRGFzaGJvYXJkQ29udHJvbGxlciBhcyBjdHJsJ1xuICAgIH0pO1xuICB9XG5dKTtcblxubW9kdWxlLnJ1bigkcm9vdFNjb3BlID0+IHtcbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgY29uc29sZS5sb2cuYmluZChjb25zb2xlKSk7XG59KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENvbnRyb2xsZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIERhc2hib2FyZENvbnRyb2xsZXIge1xuXG4gIHN0YXRpYyBnZXQgJGluamVjdCgpIHtcbiAgICByZXR1cm4gWyckbWRTaWRlbmF2J107XG4gIH1cblxuICBjb25zdHJ1Y3RvcigkbWRTaWRlbmF2KSB7XG4gICAgdGhpcy4kbWRTaWRlbmF2ID0gJG1kU2lkZW5hdjtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgdGhpcy4kbWRTaWRlbmF2KCdsZWZ0Jykub3BlbigpO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkQ29udHJvbGxlcjtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBrbGluZyBvbiA5LzI4LzE2LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmNsYXNzIERhc2hib2FyZFNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkU2VydmljZTtcbiIsIi8qKlxuICogQSBoZWxwZXIgY2xhc3MgdG8gc2ltcGxpZnkgcmVnaXN0ZXJpbmcgQW5ndWxhciBjb21wb25lbnRzIGFuZCBwcm92aWRlIGEgY29uc2lzdGVudCBzeW50YXggZm9yIGRvaW5nIHNvLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWdpc3RlcihhcHBOYW1lKSB7XG5cbiAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKGFwcE5hbWUpO1xuXG4gIHJldHVybiB7XG4gICAgZGlyZWN0aXZlOiBkaXJlY3RpdmUsXG4gICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICBzZXJ2aWNlOiBzZXJ2aWNlLFxuICAgIHByb3ZpZGVyOiBwcm92aWRlcixcbiAgICBmYWN0b3J5OiBmYWN0b3J5XG4gIH07XG5cbiAgZnVuY3Rpb24gZGlyZWN0aXZlKG5hbWUsIGNvbnN0cnVjdG9yRm4pIHtcblxuICAgIGNvbnN0cnVjdG9yRm4gPSBfbm9ybWFsaXplQ29uc3RydWN0b3IoY29uc3RydWN0b3JGbik7XG5cbiAgICBpZiAoIWNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmNvbXBpbGUpIHtcbiAgICAgIC8vIGNyZWF0ZSBhbiBlbXB0eSBjb21waWxlIGZ1bmN0aW9uIGlmIG5vbmUgd2FzIGRlZmluZWQuXG4gICAgICBjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5jb21waWxlID0gKCkgPT4ge307XG4gICAgfVxuXG4gICAgdmFyIG9yaWdpbmFsQ29tcGlsZUZuID0gX2Nsb25lRnVuY3Rpb24oY29uc3RydWN0b3JGbi5wcm90b3R5cGUuY29tcGlsZSk7XG5cbiAgICAvLyBEZWNvcmF0ZSB0aGUgY29tcGlsZSBtZXRob2QgdG8gYXV0b21hdGljYWxseSByZXR1cm4gdGhlIGxpbmsgbWV0aG9kIChpZiBpdCBleGlzdHMpXG4gICAgLy8gYW5kIGJpbmQgaXQgdG8gdGhlIGNvbnRleHQgb2YgdGhlIGNvbnN0cnVjdG9yIChzbyBgdGhpc2Agd29ya3MgY29ycmVjdGx5KS5cbiAgICAvLyBUaGlzIGdldHMgYXJvdW5kIHRoZSBwcm9ibGVtIG9mIGEgbm9uLWxleGljYWwgXCJ0aGlzXCIgd2hpY2ggb2NjdXJzIHdoZW4gdGhlIGRpcmVjdGl2ZSBjbGFzcyBpdHNlbGZcbiAgICAvLyByZXR1cm5zIGB0aGlzLmxpbmtgIGZyb20gd2l0aGluIHRoZSBjb21waWxlIGZ1bmN0aW9uLlxuICAgIF9vdmVycmlkZShjb25zdHJ1Y3RvckZuLnByb3RvdHlwZSwgJ2NvbXBpbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBvcmlnaW5hbENvbXBpbGVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGlmIChjb25zdHJ1Y3RvckZuLnByb3RvdHlwZS5saW5rKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yRm4ucHJvdG90eXBlLmxpbmsuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHZhciBmYWN0b3J5QXJyYXkgPSBfY3JlYXRlRmFjdG9yeUFycmF5KGNvbnN0cnVjdG9yRm4pO1xuXG4gICAgYXBwLmRpcmVjdGl2ZShuYW1lLCBmYWN0b3J5QXJyYXkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gY29udHJvbGxlcihuYW1lLCBjb250cnVjdG9yRm4pIHtcbiAgICBhcHAuY29udHJvbGxlcihuYW1lLCBjb250cnVjdG9yRm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VydmljZShuYW1lLCBjb250cnVjdG9yRm4pIHtcbiAgICBhcHAuc2VydmljZShuYW1lLCBjb250cnVjdG9yRm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvdmlkZXIobmFtZSwgY29uc3RydWN0b3JGbikge1xuICAgIGFwcC5wcm92aWRlcihuYW1lLCBjb25zdHJ1Y3RvckZuKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZhY3RvcnkobmFtZSwgY29uc3RydWN0b3JGbikge1xuICAgIGNvbnN0cnVjdG9yRm4gPSBfbm9ybWFsaXplQ29uc3RydWN0b3IoY29uc3RydWN0b3JGbik7XG4gICAgdmFyIGZhY3RvcnlBcnJheSA9IF9jcmVhdGVGYWN0b3J5QXJyYXkoY29uc3RydWN0b3JGbik7XG4gICAgYXBwLmZhY3RvcnkobmFtZSwgZmFjdG9yeUFycmF5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgY29uc3RydWN0b3JGbiBpcyBhbiBhcnJheSBvZiB0eXBlIFsnZGVwMScsICdkZXAyJywgLi4uLCBjb25zdHJ1Y3RvcigpIHt9XVxuICAgKiB3ZSBuZWVkIHRvIHB1bGwgb3V0IHRoZSBhcnJheSBvZiBkZXBlbmRlbmNpZXMgYW5kIGFkZCBpdCBhcyBhbiAkaW5qZWN0IHByb3BlcnR5IG9mIHRoZVxuICAgKiBhY3R1YWwgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBpbnB1dFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9ub3JtYWxpemVDb25zdHJ1Y3RvcihpbnB1dCkge1xuICAgIHZhciBjb25zdHJ1Y3RvckZuO1xuXG4gICAgaWYgKGlucHV0LmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgLy9cbiAgICAgIHZhciBpbmplY3RlZCA9IGlucHV0LnNsaWNlKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuICAgICAgY29uc3RydWN0b3JGbiA9IGlucHV0W2lucHV0Lmxlbmd0aCAtIDFdO1xuICAgICAgY29uc3RydWN0b3JGbi4kaW5qZWN0ID0gaW5qZWN0ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0cnVjdG9yRm4gPSBpbnB1dDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29uc3RydWN0b3JGbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgY29uc3RydWN0b3IgZnVuY3Rpb24gaW50byBhIGZhY3RvcnkgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIG5ldyBpbnN0YW5jZSBvZiB0aGF0XG4gICAqIGNvbnN0cnVjdG9yLCB3aXRoIHRoZSBjb3JyZWN0IGRlcGVuZGVuY2llcyBhdXRvbWF0aWNhbGx5IGluamVjdGVkIGFzIGFyZ3VtZW50cy5cbiAgICpcbiAgICogSW4gb3JkZXIgdG8gaW5qZWN0IHRoZSBkZXBlbmRlbmNpZXMsIHRoZXkgbXVzdCBiZSBhdHRhY2hlZCB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24gd2l0aCB0aGVcbiAgICogYCRpbmplY3RgIHByb3BlcnR5IGFubm90YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RvckZuXG4gICAqIEByZXR1cm5zIHtBcnJheS48VD59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfY3JlYXRlRmFjdG9yeUFycmF5KGNvbnN0cnVjdG9yRm4pIHtcbiAgICAvLyBnZXQgdGhlIGFycmF5IG9mIGRlcGVuZGVuY2llcyB0aGF0IGFyZSBuZWVkZWQgYnkgdGhpcyBjb21wb25lbnQgKGFzIGNvbnRhaW5lZCBpbiB0aGUgYCRpbmplY3RgIGFycmF5KVxuICAgIHZhciBhcmdzID0gY29uc3RydWN0b3JGbi4kaW5qZWN0IHx8IFtdO1xuICAgIHZhciBmYWN0b3J5QXJyYXkgPSBhcmdzLnNsaWNlKCk7IC8vIGNyZWF0ZSBhIGNvcHkgb2YgdGhlIGFycmF5XG4gICAgLy8gVGhlIGZhY3RvcnlBcnJheSB1c2VzIEFuZ3VsYXIncyBhcnJheSBub3RhdGlvbiB3aGVyZWJ5IGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXkgaXMgdGhlIG5hbWUgb2YgYVxuICAgIC8vIGRlcGVuZGVuY3ksIGFuZCB0aGUgZmluYWwgaXRlbSBpcyB0aGUgZmFjdG9yeSBmdW5jdGlvbiBpdHNlbGYuXG4gICAgZmFjdG9yeUFycmF5LnB1c2goKC4uLmFyZ3MpID0+IHtcbiAgICAgIC8vcmV0dXJuIG5ldyBjb25zdHJ1Y3RvckZuKC4uLmFyZ3MpO1xuICAgICAgdmFyIGluc3RhbmNlID0gbmV3IGNvbnN0cnVjdG9yRm4oLi4uYXJncyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gaW5zdGFuY2UpIHtcbiAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGluc3RhbmNlW2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmFjdG9yeUFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIENsb25lIGEgZnVuY3Rpb25cbiAgICogQHBhcmFtIG9yaWdpbmFsXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIF9jbG9uZUZ1bmN0aW9uKG9yaWdpbmFsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgYW4gb2JqZWN0J3MgbWV0aG9kIHdpdGggYSBuZXcgb25lIHNwZWNpZmllZCBieSBgY2FsbGJhY2tgLlxuICAgKiBAcGFyYW0gb2JqZWN0XG4gICAqIEBwYXJhbSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKi9cbiAgZnVuY3Rpb24gX292ZXJyaWRlKG9iamVjdCwgbWV0aG9kTmFtZSwgY2FsbGJhY2spIHtcbiAgICBvYmplY3RbbWV0aG9kTmFtZV0gPSBjYWxsYmFjayhvYmplY3RbbWV0aG9kTmFtZV0pXG4gIH1cblxufVxuIl19
