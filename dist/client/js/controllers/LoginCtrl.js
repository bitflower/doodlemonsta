angular.module('starter.controllers')

.controller('LoginCtrl', function($scope, $rootScope, $state, $timeout, DoodleApp, Sound, Auth) {

    window._MY_SCOPE = $scope;

    $scope.loginData = {};

    // View is entered
    $scope.$on('$ionicView.enter', function() {

        // Clean up
        $scope.$emit('body::class::remove', 'highlight-head');
        $scope.$emit('body::class::remove', 'highlight-stomach');
        $scope.$emit('body::class::remove', 'highlight-legs');
        $scope.$emit('body::class::remove', 'disable-next');

        DoodleApp.toggleWholeBackground(true);
        DoodleApp.toggleAppTitle(false);

        // Setup game view for home
        // $scope.$emit('body::class::add', 'show-app-caption');
        $scope.$emit('body::class::remove', 'show-app-caption');
        // $scope.$emit('body::class::remove', 'hide-monster');
        $scope.$emit('body::class::add', 'hide-monster');
        $scope.$emit('body::class::remove', 'push-back-scene');
        $scope.$emit('body::class::remove', 'show-advice');
        // $scope.$emit('body::class::remove', 'hide-kids');
        $scope.$emit('body::class::add', 'hide-kids');

        // // Start music
        // $timeout(function() {
        //     Sound.startBackgroundMusic();
        // }, 300);

    });

    $scope.doLogin = function(form) {

        Sound.play('select');

        // this.submitted = true;

        if (!form.$dirty) {
            Sound.play('really');
            DoodleApp.showToast('Please enter your username & password');
            return;
        }

        if (form.$valid) {
            DoodleApp.showToast('Logging in ....');
            Auth.login({
                    username: $scope.loginData.username,
                    password: $scope.loginData.password
                })
                .then(function() {
                    DoodleApp.hideToasts();
                    form.$setPristine();
                    // Logged in, redirect to home
                    $state.go('app.home');
                })
                .catch(function(err) {
                    Sound.play('really');
                    DoodleApp.showToast('Login failed: ' + err);
                    // this.errors.other = err.message;
                });
        } else {

            if (!form.$error.minlength) {
                Sound.play('really');
                DoodleApp.showToast('Your username & password are at least 3 characters long.');
                return;
            }

            if (!$scope.loginData.username) {
                Sound.play('really');
                DoodleApp.showToast('You have not entered your username.');
                return;
            }

            if (!$scope.loginData.password) {
                Sound.play('really');
                DoodleApp.showToast('You have not entered a password.');
                return;
            }
        }

    };


});
