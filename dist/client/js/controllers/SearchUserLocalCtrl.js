angular.module('starter.controllers')

.controller('SearchUserLocalCtrl', function($scope, $rootScope, $state, $stateParams, DoodleApp, Sound, Backend) {

    window._MY_SCOPE = $scope;

    $scope.state = {
        searchData: {},
        results: []
    };

    // View is entered
    $scope.$on('$ionicView.enter', function() {

        $scope.state = {
            searchData: {},
            results: []
        };

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

    $scope.searchUser = function(form) {

        Sound.play('select');

        if (!form.$dirty) {
            Sound.play('really');
            DoodleApp.showToast('Please enter your friend\'s name.');
            return;
        }

        if (form.$valid) {
            DoodleApp.showToast('Searching ....');
            Backend
                .getUserSearchApi()
                .search({
                    username: $scope.state.searchData.username
                })
                .$promise
                .then(function(user) {
                    DoodleApp.hideToasts();
                    form.$setPristine();
                    // console.log('Found user', user);
                    $scope.state.results = [user];
                }, function(err) {
                    DoodleApp.hideToasts();
                    Sound.play('really');
                    DoodleApp.showToast('We couldn\'t find your friend "' + $scope.state.searchData.username + '".');
                    form.$setPristine();
                });

        } else {

            if (!form.$error.minlength) {
                Sound.play('really');
                DoodleApp.showToast('The name is at least 3 characters long.');
                return;
            }

            if (!$scope.state.searchData.username) {
                Sound.play('really');
                DoodleApp.showToast('You have not entered your friend\'s name.');
                return;
            }
        }

    };

    $scope.selectUser = function(user) {

        Sound.play('select');

        DoodleApp.setPlayer($stateParams.bodyPart, user);

        $state.go('app.newGame');

    };

});
