angular.module('starter.controllers')

.controller('NewGameCtrl', function($scope, $rootScope, $state, DoodleApp, Sound, Backend) {

    window._MY_SCOPE = $scope;

    $scope.state = {
        monsta: DoodleApp.getMonsta()
    };

    // View is entered
    $scope.$on('$ionicView.enter', function() {

        // Hier müsste ein neues Monsta genereiert werden? Oder schon im Routing?

        $scope.state.monsta = DoodleApp.getMonsta();

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

    $scope.selectPlayer = function(bodyPart) {

        Sound.play('select');

        $state.go('app.playerSelection', {
            bodyPart: bodyPart
        });

    };

    $scope.startDrawing = function() {

        Sound.play('select');

        DoodleApp.showToast('Ok! Get ready for drawing !!');

        DoodleApp
            .saveMonsta() // Save monsta with selected players
            .then(function() {
                $state.go('app.instruction');
            });

    };

});
