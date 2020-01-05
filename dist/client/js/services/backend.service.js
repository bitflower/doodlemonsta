var app = angular.module('starter');

app.factory('Backend', function($resource, Config) {

    var service = {

        /////////////
        // MONSTAS //
        /////////////

        getMonstaApi: function() {
            return $resource(Config.backendUrl + 'api/monstas/:id', {
                id: '@_id'
            }, {
                get: {
                    method: 'GET'
                },
                save: {
                    method: 'POST'
                },
                update: {
                    method: 'PUT'
                }
            });
        },

        getNewMonsta: function() {

            var test = new this.getMonstaApi();
            var myNewMonsta = new test({
                name: 'New monsta',
                needs: 'head',
                head: {
                    paperjs: [],
                    crossLines: [],
                    canvas: {
                        width: 0,
                        height: 0
                    },
                    user: {}
                },
                stomach: {
                    paperjs: [],
                    crossLines: [],
                    canvas: {
                        width: 0,
                        height: 0
                    },
                    user: {}
                },
                legs: {
                    paperjs: [],
                    crossLines: [],
                    canvas: {
                        width: 0,
                        height: 0
                    },
                    user: {}
                }
            });

            return myNewMonsta;
        },

        ///////////////////////////////////
        // ACOUNT / REGISTRATION / LOGIN //
        ///////////////////////////////////

        getUserApi: function() {
            return $resource(Config.backendUrl + 'api/users/:id', {
                id: '@_id'
            }, {
                get: {
                    method: 'GET',
                    params: {
                        id: 'me'
                    }
                },
                save: {
                    method: 'POST'
                }
            });
        },
        getUserSearchApi: function() {
            return $resource(Config.backendUrl + 'api/users/search/:username', {
                username: '@username'
            }, {
                search: {
                    method: 'GET'
                }
            });
        }

    };

    return service;

});
