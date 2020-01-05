angular.module('starter.controllers')

.controller('InstructionCtrl', function($scope, $rootScope, $state, $timeout, monsta, DoodleApp, Draw, Sound, Auth) {

    window._MY_SCOPE = $scope;

    $scope.monsta = monsta;

    // // Modal for 'home' button
    // $ionicModal.fromTemplateUrl('templates/modals/go-home.html', {
    //     scope: $scope,
    //     animation: 'slide-in-up'
    // }).then(function(modal) {
    //     $scope.modalGoHome = modal;
    // });

    // View is entered
    $scope.$on('$ionicView.enter', function() {

        DoodleApp.toggleAppTitle(false);
        DoodleApp.toggleWholeBackground(true);

        // Texts / Translations
        $rootScope.advice = {
            verb: 'Draw',
            marker: 'a',
            monster: 'monster',
            bodyPart: $scope.monsta.needs + '!'
        };

        // Setup game view for draw state
        $scope.$emit('body::class::remove', 'show-app-caption');
        $scope.$emit('body::class::add', 'push-back-scene');
        $scope.$emit('body::class::add', 'show-advice');
        $scope.$emit('body::class::remove', 'hide-monster');
        $scope.$emit('body::class::add', 'hide-kids');

        $scope.$emit('body::class::remove', 'show-app-caption');
        $scope.$emit('body::class::add', 'show-next');
        $scope.$emit('body::class::add', 'show-advice');

        // Which body part should be highlighted
        $scope.$emit('body::class::remove', 'highlight-head');
        $scope.$emit('body::class::remove', 'highlight-stomach');
        $scope.$emit('body::class::remove', 'highlight-legs');

        $scope.$emit('body::class::add', 'highlight-' + $scope.monsta.needs);

    });

    // Method to go to the next body part / player
    $scope.next = function(options) {

        Sound.play('select');

        $state.go('app.draw');

    };

    // // Methods for interrupting drawing and going to home
    // $scope.goHomeRequest = function() {
    //     Sound.play('really');
    //     $scope.modalGoHome.show();
    // };
    // $scope.goHome = function() {
    //     Sound.play('abort');
    //     $scope.modalGoHome.hide();
    //     $timeout(function() {
    //         $state.go('app.home');
    //     }, 500);
    // };
    // // Method for closing all modals
    // $scope.closeModal = function() {
    //     Sound.play('select');
    //     $scope.modalGoHome.hide();
    // };

    // Clean up scope
    $scope.$on('$destroy', function() {
        // $scope.modalGoHome.remove();
    });

});
