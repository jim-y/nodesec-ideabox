/**
 * Created by kling on 9/28/16.
 */
'use strict';

export default class DashboardController {

  static get $inject() {
    return ['DashboardService'];
  }

  constructor(dashboardService) {
    this.dashboardService = dashboardService;
    this.users = [];
  }

  getUsers() {
    this.dashboardService
      .getUsers()
      .then(users => {
        this.users = users;
      });
  }

}
