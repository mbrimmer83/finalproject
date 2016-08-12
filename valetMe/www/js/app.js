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
        controller: 'LotController'
      }
    }
  })

  .state('app.options', {
    url: '/options',
    views: {
      'menuContent': {
        templateUrl: 'templates/options.html',
        controller: 'OptionsController'
      }
    }
  })

  .state('app.checkout', {
    url: '/checkout',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkout.html',
        controller: 'CheckoutController'
      }
    }
  })

  .state('app.review', {
    url: '/review',
    views: {
      'menuContent': {
        templateUrl: 'templates/review.html',
        controller: 'CheckoutController'
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
    },
    requestCar: function(data) {
      return $http({
        method: 'POST',
        url: API + '/requestcar',
        data: data
      });
    }
  };
});

app.service('storeInfo', function(){
  this.lotInfoStorage = {};
  this.saveData = function(data){
    this.lotInfoStorage = data;
  };
  this.getData = function() {
    return this.lotInfoStorage;
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

app.controller('GeoController', function($scope, $cordovaGeolocation, backEnd, $http, $ionicLoading, $location, $state, storeInfo) {
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
    var theData = storeInfo.getData();
    theData.lotInfo = lot[0];
    console.log(theData);
    storeInfo.saveData(theData);
  };
});

app.controller('LotController', function($scope, storeInfo, $state) {
  var lot = storeInfo.getData();
  $scope.userSelectedLot = lot;
  $scope.ticket = {
    ticketNumber: undefined
  };

  $scope.ticketStorage = function() {
    var theData = storeInfo.getData();
    theData.ticketNumber = $scope.ticket;
    storeInfo.saveData(theData);
    $state.go('app.options');
  };
});

app.controller('OptionsController', function($scope, storeInfo, $state, $ionicModal, $timeout, backEnd){

  $scope.requestCarData = {};
  $ionicModal.fromTemplateUrl('templates/requestcar.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.closeRequestCar = function() {
    $scope.modal.hide();
  };
  $scope.requestCar = function() {
    $scope.modal.show();
  };
  $scope.getCar = function() {
    console.log($scope.requestCarData);
    var theData = storeInfo.getData();
    theData.requestCarInfo = $scope.requestCarData;
    console.log(theData);
    storeInfo.saveData(theData);
    backEnd.requestCar(theData);
    $timeout(function() {
      $scope.closeRequestCar();
    }, 1000);
    $state.go('app.checkout');
  };

  $scope.checkout = function() {
    $state.go('app.checkout');
  };

});

app.controller('CheckoutController', function($scope, $state, storeInfo, $http) {
  $scope.payment = {amount: undefined};
  var transactionData = storeInfo.getData();
  var data = transactionData;
  $scope.pay = function() {
    console.log($scope.payment.amount);
    var amount = $scope.payment.amount * 100;
    var handler = StripeCheckout.configure({
      key: 'pk_test_ISLIYCpMacLsF9M5isdQ5JiF',
      locale: 'auto',
      token: function(token) {
        var tokenId = token.id;
        return $http({
          url: API + '/transaction',
          method: 'POST',
          data: {
            amount: amount,
            token: tokenId,
            transaction: data
          }
        })
        .then(function() {
          $state.go('app.review');
        });
      }
    });
    handler.open({
      name: 'Valet Me',
      description: 'Use Test Card: 4242 4242 4242 4242',
      amount: amount
    });
  };
});
