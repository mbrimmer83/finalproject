var app = angular.module('valet-me', ['ngRoute', 'btford.socket-io', 'ngCookies']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainController',
      templateUrl: '/html/home.html'
    })
    .when('/lotsocket', {
      controller: 'SocketController',
      templateUrl: '/html/lotsocket.html'
    })
    .when('/login', {
      controller: 'MainController',
      templateUrl: '/html/login.html'
    })
    .when('/signup', {
      controller: 'MainController',
      templateUrl: '/html/signup.html'
    });
});

app.run(function($rootScope, $location, $cookies) {
    $rootScope.$on('$locationChangeStart', function(event, nextUrl, currentUrl) {
      var token = $cookies.get('token');
      nextUrl = nextUrl.split("/");
      nextUrl = nextUrl[nextUrl.length - 1];
      if (!token && (nextUrl === "lotsocket" || nextUrl === "transactions")) {
        $cookies.put('urlRedirect', nextUrl);
        $location.path('/login');
      }
      if (!token) {
        $rootScope.userButton = true;
      } else {
        $rootScope.userButton = false;
      }
    });
    $rootScope.logout = function() {
      $cookies.remove('token');
      $rootScope.userButton = true;
      $location.path('/');
    };
});

app.factory('theSocket', function(socketFactory) {
  var myIoSocket = io.connect('/custom-lot');
  return socketFactory({ioSocket: myIoSocket});

});

var API = 'http://localhost:8000';

app.factory('backEnd', function($http) {
  return {
    getLogin: function(data) {
      return $http({
        method: 'POST',
        url: API + '/login',
        data: data
      });
    },
    getSignUp: function(data) {
      return $http({
        method: 'POST',
        url: API + '/signup',
        data: data
      });
    }
  };
});


app.controller('MainController', function($scope, $http, $cookies, $location, backEnd) {

  $scope.signUp = function() {
    var signUpInfo = {
      name: $scope.name,
      username: $scope.username,
      password: $scope.password,
      usertype: $scope.usertype,
      company: $scope.company
    };
    backEnd.getSignUp(signUpInfo).then(function(res){
      $location.path('/login');
    }).catch(function(err){
      console.log(err);
    });
  };

  $scope.login = function() {
    var loginInfo = {
      username: $scope.username,
      password: $scope.password
    };
    backEnd.getLogin(loginInfo).then(function(res){
      $cookies.put('token', res.data.token);
      $cookies.put('userId', res.data.user.id);
      $cookies.put('email', res.data.user.email);
      $cookies.put('name', res.data.user.name);
      $location.path('/home');
    }).catch(function(err){
      console.log(err);
    });
  };

});

app.controller('SocketController', function($scope, theSocket) {
  var lotId = 5;
  var carArray = [];
  console.log("Controller active");
  console.log(theSocket);
  theSocket.on('connect', function(data){
    theSocket.emit('joinRoom', {data: lotId});
  });
  theSocket.on(lotId, function(data){
    console.log(data);
    carArray.push(data.data);
    $scope.cars = carArray;
  });
});
