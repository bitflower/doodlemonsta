var app = angular.module('starter');

app.factory('Collab', function($rootScope, $q, $timeout, $cordovaEmailComposer, $cordovaSocialSharing, $ionicModal, DoodleData) {

    var texts = {
        subject: 'Doodle Monsta request!',
        message: 'Doodle Monsta: draw {{}}!',
        link: 'doodlemonsta://', // 'http://www.doodlemonsta.com/?monsta=',
        linkText: 'Click here to join in!'
    };

    var state = {
        isEmailAvailable: true,
        modals: {
            collabOptions: {}
        }
    };

    // // Check if E-Mail is available
    // if (window.cordova) {
    //     $cordovaEmailComposer.isAvailable().then(function() {}, function() {
    //         state.isEmailAvailable = false;
    //     });
    //     // $cordovaSocialSharing.canShareVia('whatsapp')
    //     // .then();
    // }


    // Modal for 'collab' button
    var $scope = $scope || $rootScope.$new(); // WORKAROUND
    $ionicModal.fromTemplateUrl('templates/modals/collab-options.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
    }).then(function(modal) {
        state.modals.modalCollabOptions = modal;
    });

    // Promise placeholder used by collab modal
    var p;


    var service = {

        showCollabOptions: function() {

            p = $q.defer();

            $timeout(function() {
                $rootScope.$emit('body::class::add', 'no-backdrop');
                state.modals.modalCollabOptions.show();
            }, 0);

            return p.promise;

        },

        hideCollabOptions: function(options) {

            state.modals.modalCollabOptions.hide();
            $timeout(function() {
                $rootScope.$emit('body::class::remove', 'no-backdrop');

                p.resolve(options);

            }, 800);

        },

        isEmailAvailable: function() {
            return state.isEmailAvailable;
        },

        replaceVariables: function(text) {

            var msg = texts[text];

            switch (DoodleData.getMonsta().needs) {
                case 'stomach':
                    msg = msg.replace('{{}}', 'a belly');
                    break;

                case 'legs':
                    msg = msg.replace('{{}}', 'some legs');
                    break;
            }

            return msg;
        },

        sendMail: function() {

            if (!window.cordova) {
                return;
            }

            // VARIANTE 1
            // // toArr, ccArr and bccArr must be an array, file can be either null, string or array
            // $cordovaSocialSharing
            //     .shareViaEmail(texts.message, texts.subject, [], [], [], null)
            //     .then(function(result) {
            //         hideCollabOptions();
            //     }, function(err) {
            //         hideCollabOptions();
            //     });

            // return;

            var sub = service.replaceVariables('subject');
            var msg = service.replaceVariables('message');


            // VARIANTE 2
            var email = {
                // to: 'max@mustermann.de',
                // cc: 'erika@mustermann.de',
                // bcc: ['john@doe.com', 'jane@doe.com'],
                // attachments: [
                //     'file://img/logo.png',
                //     'res://icon.png',
                //     'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
                //     'file://README.pdf'
                // ],
                subject: sub,
                body: msg + '<br><a href="' + texts.link + DoodleData.getMonsta()._id + '">' + 'Click here' + '</a>',
                isHtml: true
            };



            $cordovaEmailComposer
                .open(email)
                .then(function() {
                    service.hideCollabOptions({
                        type: 'email'
                    });
                }, function() {
                    // service.hideCollabOptions();
                });

        },

        sendWhatsapp: function() {

            if (!window.cordova) {
                return;
            }

            var msg = service.replaceVariables('message');
            var monsta = DoodleData.getMonsta();

            return $cordovaSocialSharing
                .shareViaWhatsApp(msg, null, texts.link + monsta._id)
                .then(function(result) {
                    service.hideCollabOptions({
                        type: 'whatsapp'
                    });
                }, function(err) {
                    // service.hideCollabOptions();
                });

        },

        sendSMS: function() {

            if (!window.cordova) {
                return;
            }

            // access multiple numbers in a string like: '0612345678,0687654321'
            $cordovaSocialSharing
                .shareViaSMS(texts.message, number)
                .then(function(result) {
                    service.hideCollabOptions({
                        type: 'sms'
                    });
                }, function(err) {
                    // service.hideCollabOptions();
                });

        }

    };

    $scope.hideCollabOptions = function() {
        service.hideCollabOptions({
            type: 'internal'
        });
    };
    $scope.sendMail = function() {
        service.sendMail();
    };
    $scope.sendWhatsapp = function() {
        service.sendWhatsapp();
    };
    // $scope.$on('$destroy', function() {
    //     state.modals.modalCollabOptions.remove();
    // });

    return service;

});
