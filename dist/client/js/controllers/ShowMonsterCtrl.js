angular.module('starter.controllers')

.controller('ShowMonsterCtrl', function($scope, $state, $timeout, monsta, DoodleApp, Draw, Sound) {

    window._MY_SCOPE = $scope;

    $scope.monsta = monsta;

    // Route states
    $timeout(function() {
        $scope.state = {
            fadeCanvas: false,
            numberIntersections: [0] // Counter for number of intersections made on this body part
        };
    }, 1);

    // Wird von draw directive befüllt
    $scope.drawData = {
        monstaData: [],
        canvasInfo: {
            width: 0,
            height: 0
        }
    };

    // View is entered
    $scope.$on('$ionicView.enter', function() {

        DoodleApp.toggleAppTitle(false);
        DoodleApp.toggleWholeBackground(false);

        Draw.toggleCrossLine('top', false);
        Draw.toggleCrossLine('bottom', false);

        // Setup game view for draw state
        $scope.$emit('body::class::remove', 'show-app-caption');
        $scope.$emit('body::class::add', 'push-back-scene');
        $scope.$emit('body::class::remove', 'show-advice');
        $scope.$emit('body::class::add', 'hide-monster');
        $scope.$emit('body::class::add', 'highlight-head');
        $scope.$emit('body::class::add', 'hide-kids');
        $scope.$emit('body::class::add', 'show-next');
        $scope.$emit('body::class::remove', 'highlight-head');
        $scope.$emit('body::class::remove', 'highlight-stomach');
        $scope.$emit('body::class::remove', 'highlight-legs');

        // Disable next
        $scope.$emit('body::class::add', 'disable-next');

        Draw.toggleDrawing(false);

        // Ist es ein bestehendes Monster?
        if (!DoodleApp.isNew()) {
            var finishedParts = DoodleApp.getFinishedParts();
            _.forEach(finishedParts, function(o) {
                Draw
                    .loadPart(o)
                    .moveUp();
            });
            // Scaling initialisieren
            Draw
                .nextPart({
                    movePartsUp: false
                })
                .startAnimation();

        }


    });

    // Method to go to the next body part / player
    $scope.next = function() {

        Sound.play('select');

        // Spin out animation
        Draw
            .spinOut();

        // Back to home
        $timeout(function() {
            $state.go('app.home');
        }, 3100);

    };

    // Monster parts where loaded
    $scope.$on('draw::partLoaded', function(e, data) {

    });

    // Clean up scope
    $scope.$on('$destroy', function() {

    });

});
