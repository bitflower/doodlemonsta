angular.module('starter')

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('app', {
        url: "",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.loggedOut', {
        url: "/",
        views: {
            'menuContent': {
                templateUrl: "templates/logged-out.html",
                controller: 'LoggedOutCtrl'
            }
        }
    })

    .state('app.login', {
        url: "/login",
        views: {
            'menuContent': {
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.register', {
        url: "/register",
        views: {
            'menuContent': {
                templateUrl: "templates/register.html",
                controller: 'RegisterCtrl'
            }
        }
    })

    .state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'HomeCtrl'
            }
        },
        authenticate: true
    })

    .state('app.newGame', {
        url: "/new-game",
        resolve: {
            monsta: function(DoodleApp, $stateParams, $q) {

                // console.log('Checking if monsta ID is given: ' + $stateParams.monstaId);

                var q = $q.defer();

                // NEW
                DoodleApp
                    .newMonsta()
                    .then(function(monsta) {
                        q.resolve(monsta);
                    });


                return q.promise;

            }
        },
        params: { bodyPart: null }, // Helper to allow state parameters
        views: {
            'menuContent': {
                templateUrl: "templates/new-game.html",
                controller: 'NewGameCtrl'
            }
        },
        authenticate: true
    })

    .state('app.playerSelection', {
        url: "/player-selection",
        params: { bodyPart: null }, // Helper to allow state parameters
        views: {
            'menuContent': {
                templateUrl: "templates/player-selection.html",
                controller: 'PlayerSelectionCtrl'
            }
        },
        authenticate: true
    })

    .state('app.searchUserLocal', {
        url: "/search-user-local",
        params: { bodyPart: null }, // Helper to allow state parameters
        views: {
            'menuContent': {
                templateUrl: "templates/search-user-local.html",
                controller: 'SearchUserLocalCtrl'
            }
        },
        authenticate: true
    })

    // .state('app.searchUserFacebook', {
    //     url: "/search-user-facebook",
    //     params: { bodyPart: null }, // Helper to allow state parameters
    //     views: {
    //         'menuContent': {
    //             templateUrl: "templates/search-user-facebook.html",
    //             controller: 'SearchUserFacebookCtrl'
    //         }
    //     },
    //     authenticate: true
    // })

    .state('app.instruction', {
        url: "/instruction/:monstaId",
        resolve: {
            monsta: function(DoodleApp, $stateParams) {

                // Loading an existing monsta?
                if ($stateParams.monstaId && $stateParams.monstaId !== '0') {
                    return DoodleApp
                        .loadMonsta($stateParams.monstaId);
                } else {
                    // Current monsta
                    return DoodleApp
                        .getMonsta();
                }

            }
        },
        views: {
            'menuContent': {
                templateUrl: "templates/instruction.html",
                controller: 'InstructionCtrl'
            }
        },
        authenticate: true
    })

    .state('app.draw', {
        url: "/draw/:monstaId",
        resolve: {
            monsta: function(DoodleApp, $stateParams) {

                // Loading an existing monsta?
                if ($stateParams.monstaId && $stateParams.monstaId !== '0') {
                    return DoodleApp
                        .loadMonsta($stateParams.monstaId);
                } else {
                    // Current monsta
                    return DoodleApp
                        .getMonsta();
                }
            }
        },
        views: {
            'menuContent': {
                templateUrl: "templates/draw.html",
                controller: 'DrawCtrl'
            }
        },
        authenticate: true
    })

    .state('app.show', {
        url: "/show/:monstaId",
        resolve: {
            monsta: function(DoodleApp, $stateParams) {

                // Loading an existing monsta?
                if ($stateParams.monstaId && $stateParams.monstaId !== '0') {
                    return DoodleApp
                        .loadMonsta($stateParams.monstaId);
                } else {
                    // Current monsta
                    return DoodleApp
                        .getMonsta();
                }
            }
        },
        views: {
            'menuContent': {
                templateUrl: "templates/show-monster.html",
                controller: 'ShowMonsterCtrl'
            }
        },
        authenticate: true
    })

    // .state('app.share', {
    //     url: "/share",
    //     views: {
    //         'menuContent': {
    //             templateUrl: "templates/share.html",
    //             controller: 'ShareCtrl'
    //         }
    //     }
    // })

    // .state('app.shareend', {
    //     url: "/share/end",
    //     views: {
    //         'menuContent': {
    //             templateUrl: "templates/shareEnd.html"
    //         }
    //     }
    // })

    // .state('app.show', {
    //     url: "/show/:monstaId",
    //     resolve: {
    //         monsta: function(Backend, $stateParams, $q) {
    //             // console.log('Checking if monsta ID is given: ' + $stateParams.monstaId);
    //             if ($stateParams.monstaId && $stateParams.monstaId !== '0') {

    //                 return Backend.get({
    //                     id: $stateParams.monstaId
    //                 }).$promise;

    //             }
    //         }
    //     },
    //     views: {
    //         'menuContent': {
    //             templateUrl: "templates/complete.html",
    //             controller: 'ShowCtrl'
    //         }
    //     }
    // })

    // .state('app.sendFacebookMessenger', {
    //     url: "/sendFacebookMessenger",
    //     views: {
    //         'menuContent': {
    //             templateUrl: "templates/sendFacebookMessenger.html"
    //         }
    //     }
    // })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

});
