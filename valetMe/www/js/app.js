var app = angular.module('valetMe', ['ionic', 'ui.router', 'ngCordova', 'ngStorage']);

app.run(function($ionicPlatform, $rootScope, $localStorage) {
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
  if ($localStorage.token === undefined) {
    $rootScope.logged = false;
  } else {
    $rootScope.logged = true;
  }
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
        controller: 'ReviewController'
      }
    }
  })

  .state('app.thanks', {
    url: '/thanks',
    views: {
      'menuContent': {
        templateUrl: 'templates/thanks.html',
        controller: 'ThanksController'
      }
    }
  })

  .state('app.promotions', {
    url: '/promotions',
    views: {
      'menuContent': {
        templateUrl: 'templates/promotions.html',
        controller: 'PromotionsController'
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

var API = 'https://floating-castle-43284.herokuapp.com';

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
    },
    getLogin: function(data) {
      return $http({
        method: 'POST',
        url: API + '/login',
        data: data
      });
    },
    submitReview: function(data) {
      return $http({
        method: 'POST',
        url: API + '/review',
        data: data
      });
    },
    getPromotions: function(data) {
      return $http({
        method: 'POST',
        url: API + '/promotions',
        data: data
      });
    },
    getSignup: function(data) {
      return $http({
        method: 'POST',
        url: API + '/signup',
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
  this.clearData = function(){
    this.lotInfoStorage = {};
  };
});

app.factory('flash', function($rootScope, $timeout) {
  function setMessage(message) {
    $rootScope.flashMessage = message;
    $timeout(function () {
      $rootScope.flashMessage = null;
    }, 5000);
  }
  return {
    setMessage: setMessage
  };
});

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, backEnd, $localStorage, $rootScope) {

  $scope.logout = function() {
    $localStorage.$reset();
    $rootScope.logged = false;
    $state.go('app.home');
  };
  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal1 = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal1.hide();
  };

  $scope.login = function() {
    $scope.modal1.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    var login = {
      username: $scope.loginData.email,
      password: $scope.loginData.password,
      usertype: 'lotuser'
    };
    backEnd.getLogin(login).then(function(res) {
      $localStorage.token = res.data.token;
      $localStorage.user = res.data.user;
      $scope.closeLogin();
      $rootScope.logged = true;
    });
  };

  // Form data for the sign up modal
  $scope.signUpData = {};

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  $scope.closeSignUp = function() {
    $scope.modal2.hide();
  };

  $scope.signup = function() {
    $scope.modal2.show();
  };
  // Perform the login action when the user submits the login form
  $scope.doSignUp = function() {
    console.log('Doing Sign Up', $scope.signUpData);
    var details = {
      'email': $scope.signUpData.email,
      'password': $scope.signUpData.password
    };
      $scope.closeSignUp();
  };
});

app.controller('HomeController', function($scope) {
});

app.controller('GeoController', function($scope, $cordovaGeolocation, backEnd, $http, $ionicLoading, $location, $state, storeInfo, $ionicHistory, $window) {
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

  $scope.reset = function() {
    $window.location.reload(true);
    $ionicHistory.clearCache();
    storeInfo.clearData();
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

app.controller('OptionsController', function($scope, storeInfo, $state, $ionicModal, $timeout, backEnd, flash){
  var lotInfo = storeInfo.getData();
  if (lotInfo.lotInfo === undefined) {
    $state.go('app.findParking');
    flash.setMessage('Please select your current lot before exploring options!');
  }
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
    var theData = storeInfo.getData();
    theData.requestCarInfo = $scope.requestCarData;
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

app.controller('CheckoutController', function($scope, $state, storeInfo, $http, flash, $timeout, $localStorage) {
  var lotInfo = storeInfo.getData();
  if (lotInfo.lotInfo === undefined) {
    $state.go('app.findParking');
    flash.setMessage('Please select your current lot before checking out!');
  }
  $scope.payment = {amount: undefined};
  var transactionData = storeInfo.getData();
  var data = transactionData;
  $scope.pay = function() {
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
            transaction: data,
            user: $localStorage.user
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

app.controller('ReviewController',function($scope, backEnd, storeInfo, $state, flash, $timeout, $localStorage) {
  var lotInfo = storeInfo.getData();
  if (lotInfo.lotInfo === undefined) {
    $state.go('app.findParking');
    flash.setMessage('Please select your current lot before reviewing!');
  }
  $scope.review = {
    star: undefined,
    one: false,
    two: false,
    three: false,
    four: false,
    comments: undefined
  };

  $scope.reviewLot = function() {
    var data = {
      review: $scope.review,
      lotData: lotInfo,
      user: $localStorage.user,
      token: $localStorage.token
    };
    backEnd.submitReview(data)
    .then(function(res) {
    });
    $state.go('app.thanks');
  };
});

app.controller('PromotionsController', function($scope, $state, $ionicModal, backEnd, storeInfo, $localStorage) {
  var userData = {};
  backend.getPromotions(userData).then(function(res){
    $scope.promos = res.data.data;
  });
});

app.controller('ThanksController', function($scope, $state, $timeout, storeInfo, $ionicHistory) {
  $timeout(function () {
    $state.go('app.home');
    storeInfo.clearData();
    $ionicHistory.clearCache();
  }, 4000);
});
