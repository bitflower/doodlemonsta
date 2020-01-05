var app = angular.module('starter');

app.factory('DoodleData', function($rootScope, $q) {

    var monsta;
    var monstaBase64; //: '',

    var service = {

        ////////////////////
        // DATA FUNCTIONS //
        ////////////////////

        setMonsta: function(newMonsta) {
            monsta = newMonsta;
        },

        getMonsta: function() {
            return monsta;
        },

        needs: function() {
            return monsta.needs;
        },

        setPlayer: function(part, user) {
            monsta[part].user = user;
        },

        updatePart: function(part, data) {

            // Set this body part's segments
            monsta[part].paperjs = data.paperjs;

            // Crosslines
            monsta[part].crossLines = data.crossLines;

            // Set this body part's canvas properties
            monsta[part].canvas = data.canvasInfo;

        },

        nextPart: function() {
            if (monsta.needs === 'head') {
                monsta.needs = 'stomach';
                return;
            }
            if (monsta.needs === 'stomach') {
                monsta.needs = 'legs';
                return;
            }
            if (monsta.needs === 'legs') {
                monsta.needs = 'complete';
                return;
            }
        },

        saveMonsta: function() {

            var d = $q.defer();

            cleanupReferences();

            // Call REST API
            if (monsta._id) {

                // EXISTING monsta
                monsta.$update(function(savedMonsta, putResponseHeaders) {

                    monsta = savedMonsta;

                    d.resolve();
                }, function(errorResult) {
                    if (errorResult.status === 503) {
                        console.log('SHIT !');
                    }
                });
            } else {

                // NEW monsta
                monsta.$save(function(savedMonsta, putResponseHeaders) {

                    // Replace local monsta with freshly saved
                    monsta = savedMonsta;

                    d.resolve();

                }, function(errorResult) {
                    if (errorResult.status === 503) {
                        console.log('SHIT !');
                    }
                });
            }

            return d.promise;

        },

        isNew: function() {
            return monsta.head.paperjs.length === 0 && monsta.stomach.paperjs.length === 0 && monsta.legs.paperjs.length === 0;
            // return !monsta._id;
        },

        getFinishedParts: function() {

            switch (monsta.needs) {
                case 'stomach':
                    return [monsta.head];

                case 'legs':
                    // Head & Stomach laden
                    return [monsta.head, monsta.stomach];

                case 'complete':
                    // Head, Stomach & Legs laden
                    return [monsta.head, monsta.stomach, monsta.legs];

            }

        }

    };

    function cleanupReferences() {

        monsta.head.user = _.get(monsta, 'head.user._id');
        monsta.stomach.user = _.get(monsta, 'stomach.user._id');
        monsta.legs.user = _.get(monsta, 'legs.user._id');

    }

    return service;

});
