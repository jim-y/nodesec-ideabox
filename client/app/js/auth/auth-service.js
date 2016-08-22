'use strict';

export default class AuthService {

  static get $inject() {
    return ['$http', '$state', 'UserService'];
  }

  constructor($http, $state, userService) {
    this.$http = $http;
    this.$state = $state;
    this.userService = userService;
  }

  login(email, password) {
    return this.$http
      .post('http://localhost:3000/auth/authenticate', { username: email, password })
      .then(r => r.data)
      .then(payload => {
        if (payload != null) {
          this.userService.user = {
            username: email
          };
        }
        this.$state.go('home');
      });
  }
}
