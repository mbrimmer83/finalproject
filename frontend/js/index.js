var app = angular.module('valet-me', ['ngRoute']);
var socketApp = angular.module('socket-app', ['btford.socket-io', 'socket-app.SocketController']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainController',
      templateUrl: '/home.html'
    })
    .when('/lotsocket', {
      controller: 'SocketController',
      templateUrl: '/lotsocket.html'
    });
});

socketApp.factory('theSocket', function(socketFactory) {
  return socketFactory();
});

app.factory('backEnd', function($http) {
  return {
    getSocket: function(data) {
      return $http({
        method: 'GET',
        url: 'http://localhost:8000/socket',
        data: data
      });
    }
  };
});



app.controller('MainController', function($scope) {

});

socketApp.controller('SocketController', function($scope, theSocket) {

});
