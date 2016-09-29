/**
 * Created by kling on 9/28/16.
 */
'use strict';

export default class AppController {

  static get $inject() {
    return ['$mdSidenav', 'AuthService'];
  }

  constructor($mdSidenav, authService) {
    this.$mdSidenav = $mdSidenav;
    this.authService = authService;
  }

  toggleNav() {
    this.$mdSidenav('left').toggle();
  }

  logout() {
    this.authService.logout();
  }

}
