/**
 * Created by kling on 9/28/16.
 */
'use strict';

class DashboardController {

  static get $inject() {
    return ['$mdSidenav'];
  }

  constructor($mdSidenav) {
    this.$mdSidenav = $mdSidenav;
  }

  open() {
    this.$mdSidenav('left').open();
  }

}

export default DashboardController;
