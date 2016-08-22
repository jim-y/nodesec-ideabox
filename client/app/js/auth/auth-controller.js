'use strict';

export default class AuthController {

  static get $inject() {
    return ['AuthService'];
  }

  constructor(authService) {
    this.authService = authService;

    this.email = '';
    this.password = '';
  }

  login($event) {
    $event.preventDefault();
    this.authService.login(this.email, this.password);
  }

}
