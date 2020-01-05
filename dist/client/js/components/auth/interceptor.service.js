'use strict';

(function() {

    function authInterceptor($q, $cookies, $injector, Util) {

        var state;
        return {
            // Add authorization token to headers
            request(config) {
                config.headers = config.headers || {};
                if ($cookies.get('token')) { // && Util.isSameOrigin(config.url)) {
                    config.headers.Authorization = 'Bearer ' + $cookies.get('token');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError(response) {
                if (response.status === 401) {
                    // Go to logged out page
                    // (state || (state = $injector.get('$state'))).go('app.loggedOut');
                    // remove any stale tokens
                    $cookies.remove('token');
                }
                return $q.reject(response);
            }
        };
    }

    angular.module('doodleMonsta.auth')
        .factory('authInterceptor', authInterceptor);

})();
