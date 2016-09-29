/**
 * Created by kling on 9/28/16.
 */
'use strict';

export default class AuthInterceptor {

  static get $inject() {
    return ['$rootScope', '$q', '$window'];
  }

  constructor($rootScope, $q, $window) {
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$window = $window;

    this.request = this.request.bind(this);
    this.response = this.response.bind(this);
  }

  request(config) {
    config.headers = config.headers || {};

    if (this.$window.sessionStorage.token) {
      config.headers.Authorization = `Bearer ${this.$window.sessionStorage.token}`;
    }

    return config;
  }

  response(response) {
    if (response.status === 403) {
      // handle the case where the user is not authenticated
    }

    return response || this.$q.when(response);
  }

}
