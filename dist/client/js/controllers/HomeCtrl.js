angular.module('starter.controllers')

.controller('HomeCtrl', function($scope, $rootScope, $state, $timeout, DoodleApp, Sound) {

    window._MY_SCOPE = $scope;

    // Show next (for now show it always, later depending upon having finished the "link area")
    DoodleApp.config.navigation.showNext = true;

    // // Navigation: Next page
    // $scope.$on('doodleMonsta::nextPage', function(event, args) {
    // });

    // View is entered
    $scope.$on('$ionicView.enter', function() {

        // Texts / Translations
        $rootScope.advice = {
            verb: 'Draw',
            marker: 'monsters',
            monster: 'with your',
            bodyPart: 'friends!'
        };

        // Clean up
        $scope.$emit('body::class::remove', 'highlight-head');
        $scope.$emit('body::class::remove', 'highlight-stomach');
        $scope.$emit('body::class::remove', 'highlight-legs');
        $scope.$emit('body::class::remove', 'disable-next');

        DoodleApp.toggleWholeBackground(true);
        DoodleApp.toggleAppTitle(true);

        // Setup game view for home
        $scope.$emit('body::class::add', 'show-app-caption');
        $scope.$emit('body::class::remove', 'hide-monster');
        $scope.$emit('body::class::remove', 'push-back-scene');
        $scope.$emit('body::class::remove', 'show-advice');
        $scope.$emit('body::class::remove', 'hide-kids');

        // Start music
        $timeout(function() {
            Sound.startBackgroundMusic();
        }, 300);

        // Show "next" button after a delay
        $scope.$emit('body::class::add', 'show-advice');

        // Show "next" button after a delay
        $scope.$emit('body::class::add', 'show-next');

    });

    // Method to go to the next body part / player
    $scope.nextPage = function() {

        Sound.play('select');

        $scope.$emit('body::class::remove', 'show-app-caption');
        $scope.$emit('body::class::add', 'push-back-scene');
        $scope.$emit('body::class::remove', 'show-next');
        $scope.$emit('body::class::remove', 'show-advice');

        $scope.$emit('body::class::remove', 'highlight-head');
        $scope.$emit('body::class::remove', 'highlight-stomach');
        $scope.$emit('body::class::remove', 'highlight-legs');

        DoodleApp.toggleAppTitle(false);
        // Go to social sharing view
        $state.go('app.newGame');

    };

    $scope.doRefresh = function() {

        $http.get('/new-items')
            .success(function(newItems) {
                $scope.items = newItems;
            })
            .finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });

    };

});
