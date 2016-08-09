var app = angular.module('valetMe', ['ionic', 'ui.router', 'ngCordova']);

app.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart',
  function(event, toState, toParams, fromState, fromParams, options){
    // transitionTo() promise will be rejected with
    // a 'transition prevented' error
    // console.log("The from state ", fromState);
    // console.log("The to state ", toState);
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.findParking', {
    url: '/findParking',
    views: {
      'menuContent': {
        templateUrl: 'templates/findparking.html',
        controller: 'GeoController'
      }
    }
  })

  .state('app.lotInfo', {
    url: '/lotinfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/lotinfo.html',
        controller: 'GeoController'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

var API = 'http://localhost:8000';

app.factory('backEnd', function($http) {
  return {
    getLotData: function(data) {
      return $http({
        method: 'POST',
        url: API + '/mobilelotdata',
        data: data
      });
    }
  };
});

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {
  // console.log($state.current);
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // Form data for the sign up modal
  $scope.signUpData = {};

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeSignUp = function() {
    $scope.modal.hide();
  };

  $scope.signup = function() {
    $scope.modal.show();
  };
  // Perform the login action when the user submits the login form
  $scope.doSignUp = function() {
    console.log('Doing Sign Up', $scope.signUpData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeSignUp();
    }, 1000);
  };
});

app.controller('HomeController', function($scope) {
});

app.controller('GeoController', function($scope, $cordovaGeolocation, backEnd, $http, $ionicLoading, $location, $state) {
  var coords = {};
  var positionOptions = {timeout: 10000, enableHighAccuracy: false};
  $scope.selectedLot = { id: undefined};
  var theLots;
  $ionicLoading.show();
  $cordovaGeolocation.getCurrentPosition(positionOptions).then(function(position) {
    coords = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    };
    backEnd.getLotData(coords).then(function(res) {
      $scope.lots = res.data.data;
      theLots = res.data.data;
      $ionicLoading.hide();
    });
  }).catch(function(err) {
    console.log(err);
  });

  $scope.lotSelect = function() {
    $state.go('app.lotInfo');
    var lot = theLots.filter(function(theLot) {
      return theLot.id === $scope.selectedLot.id;
    });
    $scope.userSelectedLot = lot;
  };
});
