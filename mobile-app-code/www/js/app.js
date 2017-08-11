// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.service','starter.controllers','starter.circleService'])

.run(function($ionicPlatform) {
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
})

.config(function($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {
   $ionicConfigProvider.navBar.alignTitle('center');
  $stateProvider
  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    controller: 'HomeCtrl',
    cache:false


  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'templates/dashboard.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('todayRecharge', {
    url: '/todayRecharge',
    templateUrl: 'templates/todayRecharge.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('history', {
    url: '/history',
    templateUrl: 'templates/history.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('account', {
    url: '/account',
    templateUrl: 'templates/account.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('earnings', {
    url: '/earnings',
    templateUrl: 'templates/earnings.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('noNetwork', {
    url: '/network',
    templateUrl: 'templates/no_network.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('features', {
    url: '/features',
    templateUrl: 'templates/features.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  .state('companyinfo', {
    url: '/companyinfo',
    templateUrl: 'templates/companyinfo.html',
    controller: 'DashboardCtrl',
    cache:false
  })
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});
