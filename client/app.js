
angular.module('test', ['ngRoute', 'ngCookies'])
.config(function($routeProvider) {

  $routeProvider
  .when('/', {
    controller: 'PaymentsCtrl',
    templateUrl: './partials/payments.html'
  })
  .when('/customers', {
    controller: 'CustomersCtrl',
    templateUrl: './partials/customers.html'
  })
  .when('/login', {
    controller: 'LoginCtrl',
    templateUrl: './partials/login.html'
  })
  .when('/logout', {
    controller: 'LogoutCtrl',
    templateUrl: './partials/login.html'
  })
  .otherwise({
    redirectTo: '/'
  });
})

.factory('AuthServ', function ($cookieStore) {
  var user;
  return {
    getToken: function () {
      return user.token;
    },
    getUser: function () {
      return user;
    },
    getAuthHeader: function () {
      return (user && user.token) ? { 'Authorization': 'Bearer ' + user.token } : {};
    },
    setUserToken: function (newUser, save) {
      user = newUser;
      if(!save) {
        return this.clearCookie();
      }
      this.saveToCookie();
    },
    saveToCookie: function () {
      console.log('+ Saving');
      $cookieStore.put('user', user);
    },
    clearCookie: function () {
      console.log('+ Clearing');
      $cookieStore.remove('user');
    },
    loadFromCookie: function () {
      user = $cookieStore.get('user');
      console.log('+ Reading');
    }
  };
})

.run(function ($rootScope, AuthServ) {
  AuthServ.loadFromCookie();
  $rootScope.isLoggedIn = function () {
    return !!AuthServ.getUser();
  };
})

.controller('LoginCtrl', function ($scope, $http, $location, AuthServ) {
  $scope.loginForm ={
    remember: true
  };
  $scope.login = function () {
    $http.post('/login', {
      user: $scope.loginForm.user,
      pass: $scope.loginForm.pass
    })
    .success(function (data, status) {
      console.log(data, status);
      AuthServ.setUserToken(data, $scope.loginForm.remember);
      $location.path('/');
    })
    .error(function (data, status) {
      console.log(data, status);
      $scope.message = data.message + ' (' + data.statusCode + ')';
    });
  };
})

.controller('LogoutCtrl', function ($location, AuthServ) {
  AuthServ.setUserToken();
  $location.path('/login');
})

.controller('PaymentsCtrl', function ($scope, $http, AuthServ) {

  $scope.user = AuthServ.getUser();
  if(!$scope.user) {
    $scope.message = 'Please Login first';
    return;
  }

  $http.get('/payments', {
    headers: AuthServ.getAuthHeader()
  })
  .success(function (data, status) {
    console.log('OK', data, status);
    $scope.payments = data.docs;
  })
  .error(function (data, status) {
    console.log('Error', data, status);
    if(status === 401 || status === 403) {
      $scope.message = data.message;
    }
    $scope.payments = [];
  });
})

.controller('CustomersCtrl', function ($scope, $http, AuthServ) {

  $scope.user = AuthServ.getUser();
  if(!$scope.user) {
    $scope.message = 'Please Login first';
    return;
  }

  $http.get('/customers', {
    headers: AuthServ.getAuthHeader()
  })
  .success(function (data, status) {
    console.log('OK', data, status);
    $scope.customers = data.docs;
  })
  .error(function (data, status) {
    console.log('Error', data, status);
    if(status === 401 || status === 403) {
      $scope.message = data.message;
    }
    $scope.customers = [];
  });
})

;
