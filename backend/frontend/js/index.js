var app = angular.module('valet-me', ['ui.router', 'btford.socket-io', 'ngCookies']);

// app.config(function($routeProvider) {
//   $routeProvider
//     .when('/', {
//       controller: 'MainController',
//       templateUrl: '/html/home.html'
//     })
//     .when('/lotsocket', {
//       controller: 'SocketController',
//       templateUrl: '/html/lotsocket.html'
//     })
//     .when('/story', {
//       controller: 'MainController',
//       templateUrl: '/html/story.html'
//     })
//     .when('/login', {
//       controller: 'MainController',
//       templateUrl: '/html/login.html'
//     })
//     .when('/services', {
//       controller: 'MainController',
//       templateUrl: '/html/services.html'
//     })
//     .when('/panel', {
//       controller: 'PanelController',
//       templateUrl: '/html/panel.html'
//     })
//     .when('/signup', {
//       controller: 'MainController',
//       templateUrl: '/html/signup.html'
//     });
// });

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: '/',
    templateUrl: 'html/main.html',
    controller: 'MainController'
  })
  .state('app.home', {
    url: '/home',
    templateUrl: 'html/home.html',
    controller: 'MainController'
  })
  .state('app.login', {
    url: '/login',
    templateUrl: 'html/login.html',
    controller: 'MainController'
  })
  .state('app.signup', {
    url: '/signup',
    templateUrl: 'html/signup.html',
    controller: 'MainController'
  })
  .state('app.services', {
    url: '/services',
    templateUrl: 'html/services.html',
    controller: 'MainController'
  })
  .state('app.story', {
    url: '/story',
    templateUrl: 'html/story.html',
    controller: 'MainController'
  })
  .state('panel', {
    url: '/panel',
    templateUrl: 'html/panel.html',
    controller: 'PanelController'
  })
  .state('panel.active', {
    url: '/panel/active',
    templateUrl: 'html/active.html',
    controller: 'SocketController'
  })
  .state('panel.reviews', {
    url: '/panel/reviews',
    templateUrl: 'html/reviews',
    controller: 'PanelController'
  })
  .state('panel.transactions', {
    url: '/panel/transactions',
    templateUrl: 'html/transactions',
    controller: 'PanelController'
  });
});

app.run(function($rootScope, $cookies, $state) {
    $rootScope.$on('$locationChangeStart', function(event, nextUrl, currentUrl) {
      nextUrl = nextUrl.split("/");
      nextUrl = nextUrl[nextUrl.length - 1];
      if (!token && (nextUrl === "lotsocket" || nextUrl === "transactions")) {
        $cookies.put('urlRedirect', nextUrl);
        // $location.path('/login');
        $state.go('app.login');
      }
    });
    var token = $cookies.get('token');
    if (!token) {
      $rootScope.userButton = true;
    } else {
      $rootScope.userButton = false;
    }
    $rootScope.logout = function() {
      $cookies.remove('token');
      $cookies.remove('userid');
      $cookies.remove('email');
      $cookies.remove('manager');
      $cookies.remove('name');
      $rootScope.userButton = true;
      $state.go('app');
    };
});

app.factory('theSocket', function(socketFactory) {
  var myIoSocket = io.connect('/custom-lot');
  return socketFactory({ioSocket: myIoSocket});

});

var API = 'http://7c61fa7f.ngrok.io';

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
    },
    getReviews: function(data) {
      return $http({
        method: 'POST',
        url: API + '/getreviews',
        data: data
      });
    },
    getUserLots: function(data) {
      return $http({
        method: 'POST',
        url: API + '/userlots',
        data: data
      });
    }
  };
});


app.controller('MainController', function($scope, $http, $cookies, backEnd, $rootScope, $state) {

  $scope.signUp = function() {
    var signUpInfo = {
      name: $scope.name,
      username: $scope.username,
      password: $scope.password,
      usertype: $scope.usertype,
      company: $scope.company
    };
    backEnd.getSignUp(signUpInfo).then(function(res){
      // $location.path('/login');
      $state.go('app.login');
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
      $cookies.put('manager', res.data.user.lot_manager);
      // $location.path('/home');
      $state.go('app.home');
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

app.controller('PanelController', function($scope, theSocket, backEnd, $cookies, $timeout) {
  $scope.lotData = {
    lotId: undefined
  };
  var userId = $cookies.get('userId');
  var data = {userId: userId};
  backEnd.getUserLots(data)
  .then(function(res){
    $scope.lots = res.data.data;
    console.log($scope.lots);
  });

  $scope.getReviews = function() {
    backEnd.getReviews($scope.lotData.lotId)
    .then(function(res){
      console.log(res);
    });
  };
});
