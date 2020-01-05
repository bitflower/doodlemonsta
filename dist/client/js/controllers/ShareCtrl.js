(function() {
    'use strict';

    angular.module('starter.controllers')

    .controller('ShareCtrl', function($scope, $state, $ionicModal, DoodleApp, $cordovaSocialSharing, $cordovaContacts) {

        window._MY_SCOPE = $scope;

        DoodleApp.config.navigation.showNext = false;

        // Message contents
        var subject = 'Let\'s draw a monster together!';
        var link = 'doodlemonsta://' + DoodleApp.monsta._id;
        var body = ' Click here: ' + link;
        var message = subject + ' Click here:';
        var image; // = '';

        // Sharing options
        $scope.shareOptions = [{
            name: 'friend',
            description: 'Hand over the device to a friend.'
        }, {
            name: 'friendGeo',
            description: 'Invite a friend near you.'
        }, {
            name: 'facebook',
            description: 'Send an invitation on Facebook.',
            onClickFunction: 'sendFacebookMessage()'
        }, {
            name: 'whatsapp',
            description: 'Write a Whatsapp message with an invitation.',
            onClickFunction: 'sendWhatsapp()'
        }, {
            name: 'email',
            description: 'Write a email with an invitation.',
            href: 'mailto:?subject=' + subject + '&body=' + body
        }, {
            name: 'sms',
            description: 'Write a SMS message with an invitation.',
            onClickFunction: 'sendSMS()'
        }];

        // INSTAGRAM
        // Instagram.isInstalled(function(err, installed) {
        //     if (installed) {

        //         console.log("Instagram is ", installed); // installed app version on Android

        // $scope.shareOptions.push({
        //     name: 'instagram',
        //     description: 'DEBUGGING: Store image on instagram.',
        //     onClickFunction: 'saveOnInstagram()'
        // });

        //         console.log('Anzahl sharing options: ' + $scope.shareOptions.length);

        //     } else {
        //         console.log("Instagram is not installed");
        //     }
        // });

        // Styles / heights
        $scope.setStyle = function() {

            return {
                'height': (100 / $scope.shareOptions.length).toFixed(2) + '%'
            };

        };


        // FACEBOOK
        $scope.sendFacebookMessage = function() {

            if (!window.plugins) {
                return;
            }

            $cordovaSocialSharing
                .shareViaFacebook(message, image, link)
                .then(function(result) {

                    // Go to social sharing successful view
                    $state.go('app.shareend');

                }, function(err) {
                    // An error occurred. Show a message to the user
                });

        };


        // WHATSAPP
        $scope.sendWhatsapp = function() {

            if (!window.plugins) {
                return;
            }

            $cordovaSocialSharing
                .shareViaWhatsApp(message, image, link)
                .then(function(result) {

                    // Go to social sharing successful view
                    $state.go('app.shareend');

                }, function(err) {
                    // An error occurred. Show a message to the user
                });

        };


        // SMS
        $scope.sendSMS = function() {

            if (!window.plugins) {
                return;
            }




            $cordovaSocialSharing
                .shareViaSMS(message, number)
                .then(function(result) {
                    // Success!
                }, function(err) {
                    // An error occurred. Show a message to the user
                });

        };



        // INSTAGRAM
        $scope.saveOnInstagram = function() {

            console.log('DoodleApp.monstaBase64: ' + DoodleApp.monstaBase64);

            Instagram.share(DoodleApp.monstaBase64, 'Monsta No. ' + DoodleApp.monsta._id, function(err) {
                if (err) {
                    console.log("not shared");
                } else {
                    console.log("shared");
                }
            });

        };



        // Load contacts
        $scope.loadContacts = function() {

            if (!navigator.contacts) {
                return;
            }

            $scope.phoneContacts = [];

            function onSuccess(contacts) {
                for (var i = 0; i < contacts.length; i++) {
                    var contact = contacts[i];
                    $scope.phoneContacts.push(contact);
                }
            }

            function onError(contactError) {
                alert(contactError);
            }

            var options = {
                multiple: true
            };
            $cordovaContacts.find(options).then(onSuccess, onError);

        };


    });

}());
