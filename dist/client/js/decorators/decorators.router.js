'use strict';

(function() {

    angular
        .module('doodlemonsta.decorators')
        .run(function($rootScope, $state, $ionicHistory, $timeout) {

            $rootScope.$on('$stateChangeSuccess', function(event, next) {

                // Clear history to prevent Android back button and iOS Swipe back
                $ionicHistory.clearHistory();

            });

        });

})();
