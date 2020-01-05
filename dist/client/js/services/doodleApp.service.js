var app = angular.module('starter');

app.factory('DoodleApp', function($rootScope, $q, DoodleData, Backend, Collab, Auth) {

    $rootScope.state = {
        backgroundVisible: true
    };

    var service = {

        //////////////////////
        // CONFIG FUNCTIONS //
        //////////////////////

        config: {
            navigation: {
                showNext: true
            }
        },

        ////////////////////
        // DATA FUNCTIONS //
        ////////////////////

        // setMonsta: function(newMonsta) {
        //     DoodleData.setMonsta(newMonsta);
        // },

        clearMonsta: function() {
            DoodleData.setMonsta(null);
            return this;
        },

        newMonsta: function() {
            var d = $q.defer();
            setTimeout(function() {
                // if (!DoodleData.getMonsta()) {
                var monsta = Backend.getNewMonsta();
                monsta.head.user = Auth.getCurrentUser();
                DoodleData.setMonsta(monsta);
                // }
                d.resolve(DoodleData.getMonsta());
            }, 10);
            return d.promise;
        },

        loadMonsta: function(id) {
            var d = $q.defer();
            Backend.getMonstaApi().get({
                id: id
            }, function(monsta) {
                DoodleData.setMonsta(monsta);
                d.resolve(monsta);
            });
            return d.promise;
        },

        saveMonsta: function() {
            return DoodleData.saveMonsta();
        },

        // Gets the current monsta
        getMonsta: function() {
            return DoodleData.getMonsta();
        },

        needs: function() {
            return DoodleData.needs();
        },

        updatePart: function(part, data) {
            DoodleData.updatePart(part, data);
        },

        nextPart: function() {
            DoodleData.nextPart();
        },

        setPlayer: function(bodyPart, user) {
            DoodleData.setPlayer(bodyPart, user);
        },

        isNew: function() {
            return DoodleData.isNew();
        },

        getFinishedParts: function() {
            return DoodleData.getFinishedParts();
        },

        //////////////////
        // UX FUNCTIONS //
        //////////////////

        toggleWholeBackground: function(val) {
            $rootScope.state.backgroundVisible = val;
        },
        toggleAppTitle: function(val) {
            $rootScope.state.appTitleVisible = val;
        },

        //////////////////////
        // COLLAB FUNCTIONS //
        //////////////////////

        selectCollabOptions: function() {
            return Collab.showCollabOptions();
        },

        collabOnWhatsapp: function() {

            $cordovaSocialSharing
                .shareViaWhatsApp(message, image, link)
                .then(function(result) {
                    // Success!
                }, function(err) {
                    // An error occurred. Show a message to the user
                });

        },

        ///////////////////
        // NOTIFICATIONS //
        ///////////////////

        showToast: function(msg, options) {

            if (window.plugins && window.plugins.toast) {

                options = options || {
                    duration: "short",
                    styling: {
                        backgroundColor: '#2196F3',
                        textColor: '#FFFFFF'
                    }
                };

                window.plugins.toast.showWithOptions({
                    message: msg,
                    duration: options.duration,
                    position: "top",
                    styling: {
                        opacity: 0.92, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                        backgroundColor: options.styling.backgroundColor, // make sure you use #RRGGBB. Default #333333
                        textColor: options.styling.textColor, // Ditto. Default #FFFFFF
                        // cornerRadius: 100, // minimum is 0 (square). iOS default 20, Android default 100
                        // horizontalPadding: 20, // iOS default 16, Android default 50
                        // verticalPadding: 16 // iOS default 12, Android default 30
                    }
                });
            } else {
                alert(msg);
            }

        },

        hideToasts: function() {
            if (window.plugins && window.plugins.toast) {
                window.plugins.toast.hide();
            }
        }


    };

    return service;

});
