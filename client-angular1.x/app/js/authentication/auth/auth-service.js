/**
 * Created by kling on 9/28/16.
 */
'use strict';

export default class AuthService {

  static get $inject() {
    return ['$http', '$window', '$state'];
  }

  constructor($http, $window, $state) {
    this.$http = $http;
    this.$window = $window;
    this.$state = $state;
  }

  isLoggedIn() {
    return this.$window.sessionStorage.token != null;
  }

  login(username, password) {
    return this.$http
      .post('http://localhost:3000/auth/authenticate', { username, password })
      .then(r => r.data)
      .then(response => {
        if (response.token) {
          this.$window.sessionStorage.token = response.token;
        }
      })
      .catch(err => {
        if (err) {
          console.error(err);
        }

        delete this.$window.sessionStorage.token;
      });
  }

  logout() {
    delete this.$window.sessionStorage.token;
    this.$state.go('login');
  }

  register(username, password) {
    return this.$http.post('http://localhost:3000/auth/register', {
      username,
      password
    }).then(r => r.data);
  }

}
