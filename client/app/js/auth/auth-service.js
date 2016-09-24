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

  login(login) {
    return this.$http
      .post('http://localhost:3000/auth/authenticate', login)
      .then(r => r.data)
      .then(payload => {
        if (payload != null) {
          this.userService.user = payload.user;
        }
        
        this.$state.go('home');
      });
  }

  register(registration) {
    console.log('register');
    return this.$http
      .post('http://localhost:3000/auth/register', registration)
      .then(r => r.data)
      .then(response => {
        if (response != null) {
          this.$state.go('login');
        }
      })
  }
}
