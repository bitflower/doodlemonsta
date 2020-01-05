angular
    .module('starter')
    .config(function($ionicConfigProvider, $httpProvider) { //, RestangularProvider) {

        // Disable transistions
        $ionicConfigProvider.views.transition('none');

        // Disable iOS Swipe Back
        $ionicConfigProvider.views.swipeBackEnabled(false);

        // RestangularProvider.setBaseUrl('http://doodlemonsta.herokuapp.com/api');

        // CSRF Settings
        // $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        // $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';


    });
