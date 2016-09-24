'use strict';

export default class AuthController {

  static get $inject() {
    return ['$state', 'AuthService'];
  }

  constructor($state, authService) {
    this.$state = $state;
    this.authService = authService;

    this.email = '';
    this.password = '';
    this.confirm = '';
  }

  login($event) {
    $event.preventDefault();
    this.authService.login({
      email: this.email,
      password: this.password
    });
  }

  register() {
    this.authService.register({
      email: this.email,
      password: this.password,
      confirm: this.confirm
    });
  }

}
