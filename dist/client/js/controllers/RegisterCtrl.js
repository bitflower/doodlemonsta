angular.module('starter.controllers')

.controller('RegisterCtrl', function($scope, $rootScope, $state, $timeout, DoodleApp, Sound, Auth) {

    window._MY_SCOPE = $scope;

    $scope.regData = {};

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

    });

    $scope.tryRegister = function(form) {

        if (form.$valid) {
            Auth.createUser({
                    name: $scope.regData.username,
                    email: $scope.regData.email,
                    password: $scope.regData.password
                })
                .then(function() {
                    // Account created, redirect to home
                    form.$setPristine();
                    $state.go('app.home');
                })
                .catch(function(err) {
                    err = err.data;
                    // this.errors = {};

                    // // Update validity of form fields that match the mongoose errors
                    // angular.forEach(err.errors, (error, field) => {
                    //     form[field].$setValidity('mongoose', false);
                    //     this.errors[field] = error.message;
                    // });
                });
        }

        // var User = new Backend.getUserApi();
        // var newUser = new User({
        //     name: $scope.regData.username,
        //     password: $scope.regData.password,
        //     email: $scope.regData.email
        // });
        // newUser.$save(function(data, putResponseHeaders) {

        //     $cookies.put('token', data.token);
        //     var currentUser = User.get();

        // }, function(errorResult) {
        //     if (errorResult.status === 422) {
        //         alert('Username or email already taken.');
        //     }
        //     if (errorResult.status === 503) {
        //         console.log('SHIT !');
        //     }
        // });
    };

});
