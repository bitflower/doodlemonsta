'use strict';

(function() {

    function AuthService($location, $http, $cookies, $q, $window, Util, Backend, Config) {

        var safeCb = Util.safeCb;
        var currentUser = {};

        if ($cookies.get('token') && $location.path() !== '/logout') {
            currentUser = Backend.getUserApi().get();
        }

        var Auth = {

            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional, function(error, user)
             * @return {Promise}
             */
            login: function(loginData, callback) {

                return $http.post(Config.backendUrl + 'auth/local', {
                        username: loginData.username,
                        password: loginData.password
                    })
                    .then(function(res) {
                        $cookies.put('token', res.data.token);

                        // GET /users/me
                        currentUser = Backend.getUserApi().get();
                        return currentUser.$promise;
                    })
                    .then(function(user) {
                        safeCb(callback)(null, user);
                        return user;
                    })
                    .catch(function(err) {
                        Auth.logout();
                        safeCb(callback)(err.data);
                        return $q.reject(err.data);
                    });

            },

            /**
             * Delete access token and user info
             */
            logout: function() {
                $cookies.remove('token');
                currentUser = {};
            },

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional, function(error, user)
             * @return {Promise}
             */
            createUser: function(user, callback) {

                return Backend.getUserApi().save(user,
                    function(data) {
                        $cookies.put('token', data.token);
                        currentUser = Backend.getUserApi().get();
                        return safeCb(callback)(null, user);
                    },
                    function(err) {
                        Auth.logout();
                        return safeCb(callback)(err);
                    }).$promise;

            },

            /**
             * Gets all available info on a user
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, funciton(user)
             * @return {Object|Promise}
             */
            getCurrentUser: function(callback) {
                if (arguments.length === 0) {
                    return currentUser;
                }

                var value = (currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
                return $q.when(value)
                    .then(function(user) {
                        safeCb(callback)(user);
                        return user;
                    }, function() {
                        safeCb(callback)({});
                        return {};
                    });
            },

            /**
             * Check if a user is logged in
             *   (synchronous|asynchronous)
             *
             * @param  {Function|*} callback - optional, function(is)
             * @return {Bool|Promise}
             */
            isLoggedIn: function(callback) {
                if (arguments.length === 0) {
                    return currentUser.hasOwnProperty('role');
                }

                return Auth.getCurrentUser(null)
                    .then(function(user) {
                        var is = user.hasOwnProperty('role');
                        safeCb(callback)(is);
                        return is;
                    });
            },

            /**
             * Get auth token
             *
             * @return {String} - a token string used for authenticating
             */
            getToken: function() {
                return $cookies.get('token');
            },

            signInFacebook: function() {

                var d = $q.defer();

                if (!!window.cordova && window.cordova.InAppBrowser) {

                    // Cordova solution

                    var ref = cordova.InAppBrowser.open(Config.backendUrl + 'auth/facebook', '_blank', 'location=no');
                    ref.addEventListener('loaderror', function(event) {
                        alert('Error loading in app browser URL: ' + event);
                    });
                    ref.addEventListener("loadstop", function(event) {

                        if (event.url.match("")) { // = Config.backendUrl

                            // Get token from InAppBrowser & set currentUser
                            ref.executeScript({
                                code: "persistCookie()"
                            }, function(token) {
                                $cookies.put('token', token[0]);
                                $window.sessionStorage.fbtoken = token[0]; // TEMP !!!

                                currentUser = Backend.getUserApi().get();

                                // Close IAB
                                ref.close();

                                // Go to home screen
                                d.resolve();
                            });

                        }
                    });

                } else {

                    // Javascript solution

                    var ref = window.open(Config.backendUrl + 'auth/facebook', 'myWindow', "height=100,width=300");
                    window.onmessage = function(e) {

                        if (e.data) {
                            $cookies.put('token', e.data);
                            $window.sessionStorage.fbtoken = e.data; // TEMP !!!
                            
                            currentUser = Backend.getUserApi().get();

                            // Close the window
                            ref.close();

                            // Go to home screen
                            d.resolve();

                        } else {
                            //Code for false
                        }
                    };

                }

                return d.promise;

            }
        };

        return Auth;
    }

    angular.module('doodleMonsta.auth')
        .factory('Auth', AuthService);

})();
