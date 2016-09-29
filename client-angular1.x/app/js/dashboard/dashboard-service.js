/**
 * Created by kling on 9/28/16.
 */
'use strict';

export default class DashboardService {

  static get $inject() {
    return ['$http'];
  }

  constructor($http) {
    this.$http = $http;
  }

  getUsers() {
    return this.$http
      .get('http://localhost:3000/user/users')
      .then(r => r.data);
  }

}

