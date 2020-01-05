angular.module('starter.controllers')

.controller('LoggedOutCtrl', function($scope, $rootScope, $state, $timeout, DoodleApp, Sound, Auth) {

    window._MY_SCOPE = $scope;

    // Texts / Translations
    $rootScope.advice = {
        verb: 'Draw',
        marker: 'monsters',
        monster: 'with your',
        bodyPart: 'friends!'
    };

    var now = new Date().getTime();
    $scope.performance = {
        start: now - window.start,
        startAngular: now - window.startAngular,
        runAngular: now - window.runAngular,
        ionicReady: now - window.ionicReady,
        preloaderReady: now - window.preloaderReady,
        musicStarts: now - window.musicStarts
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
        $scope.$emit('body::class::add', 'hide-monster');
        // $scope.$emit('body::class::remove', 'hide-monster');
        $scope.$emit('body::class::remove', 'push-back-scene');
        // $scope.$emit('body::class::add', 'show-advice');
        $scope.$emit('body::class::remove', 'show-advice');
        // $scope.$emit('body::class::remove', 'hide-kids');
        $scope.$emit('body::class::add', 'hide-kids');

        // Start music
        $timeout(function() {
            Sound.startBackgroundMusic();
        }, 300);

    });

    $scope.goLoginFacebook = function() {
        Sound.play('select');
        Auth
            .signInFacebook()
            .then(function() {
                DoodleApp.showToast('Successfully login in!');
                $state.go('app.home');
            });
    };
    $scope.goLogin = function() {
        Sound.play('select');
        $state.go('app.login');
    };
    $scope.goRegister = function() {
        Sound.play('select');
        $state.go('app.register');
    };

});
