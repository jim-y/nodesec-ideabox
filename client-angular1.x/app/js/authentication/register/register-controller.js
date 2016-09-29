/**
 * Created by kling on 9/28/16.
 */
'use strict';

export default class RegisterController {

  static get $inject() {
    return ['$state', 'AuthService'];
  }

  constructor($state, authService) {
    this.$state = $state;
    this.authService = authService;

    this.username = '';
    this.password = '';
  }

  register() {
    this.authService
      .register(this.username, this.password)
      .then(() => this.$state.go('login'));
  }

}
