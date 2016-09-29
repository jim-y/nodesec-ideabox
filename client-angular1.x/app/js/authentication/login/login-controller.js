/**
 * Created by kling on 9/28/16.
 */
'use strict';

export default class LoginController {

  static get $inject() {
    return ['$state', 'AuthService'];
  }

  constructor($state, authService) {
    this.$state = $state;
    this.authService = authService;

    this.username = '';
    this.password = '';
  }

  login(username, password) {
    this.authService
      .login(username, password)
      .then(() => this.$state.go('app.dashboard'));
  }
}
