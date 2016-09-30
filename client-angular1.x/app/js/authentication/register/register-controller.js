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
    this.confirm = '';
  }

  register() {
    this.authService
      .register(this.username, this.password, this.confirm)
      .then(() => this.$state.go('login'))
      .catch(err => console.error(err));
  }

}
