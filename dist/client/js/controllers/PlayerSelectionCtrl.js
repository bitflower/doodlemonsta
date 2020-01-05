angular.module('starter.controllers')

.controller('PlayerSelectionCtrl', function($scope, $rootScope, $state, $stateParams, DoodleApp, Sound, Backend) {

    window._MY_SCOPE = $scope;

    $scope.state = {
        friendList: [{
            name: 'Johnny'
        }, {
            name: 'Jane'
        }]
    };

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

    $scope.searchLocal = function() {
        Sound.play('select');
        $state.go('app.searchUserLocal', {
            bodyPart: $stateParams.bodyPart
        });

    };

    $scope.searchFacebook = function() {
        Sound.play('select');
        $state.go('app.searchUserFacebook', {
            bodyPart: $stateParams.bodyPart
        });
    };

    $scope.inviteExternal = function() {
        Sound.play('select');
        DoodleApp.showToast('Coming soon!');
    };

    $scope.selectPlayer = function(friend) {
        Sound.play('select');
        DoodleApp.showToast('Coming soon!');
    };

});
