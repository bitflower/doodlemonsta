'use strict';

(function() {

    angular.module('doodleMonsta.auth')

    .run(function($rootScope, $state, Auth) {

        // Redirect to login if route requires auth and the user is not logged in
        $rootScope.$on('$stateChangeStart', function(event, next) {

            if (!next.authenticate) {
                return;
            }

            Auth.isLoggedIn(_.noop).then(function(isLoggedIn) {
                if (isLoggedIn) {
                    return;
                }

                event.preventDefault();
                $state.go('app.loggedOut');
            });

        });

    });

})();
