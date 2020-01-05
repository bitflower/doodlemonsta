angular.module('starter.controllers')

.controller('DrawCtrl', function($scope, $rootScope, $state, $timeout, $ionicModal, monsta, DoodleApp, Draw, Sound, Auth) {

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
        DoodleApp.toggleWholeBackground(false);

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

        Draw.toggleDrawing(true);

        // Ist es ein bestehendes Monster?
        if (!DoodleApp.isNew()) {
            var finishedParts = DoodleApp.getFinishedParts();
            _.forEach(finishedParts, function(o) {
                Draw
                    .loadPart(o)
                    .moveUp();
            });

        }

        // Disable next
        $scope.$emit('body::class::add', 'disable-next');

        switch ($scope.monsta.needs) {
            case 'head':
                Draw.toggleCrossLine('top', false);
                Draw.toggleCrossLine('bottom', true);
                break;
            case 'stomach':
                Draw.toggleCrossLine('top', true);
                Draw.toggleCrossLine('bottom', true);
                break;
            case 'legs':
                Draw.toggleCrossLine('top', true);
                Draw.toggleCrossLine('bottom', false);
                break;
        }

    });

    // Method to go to the next body part / player
    $scope.next = function() {

        Sound.play('select');

        switch ($scope.monsta.needs) {

            // HEAD & STOMACH
            case 'head':
            case 'stomach':
            case 'legs':

                // Move to next part and export, rasterize & move on the way

                Draw
                    .nextPart({
                        movePartsUp: true
                    })
                    .exportData()
                    .then(function(data) {

                        savePart(data)
                            .then(function() {
                                Draw
                                    .rasterizePart()
                                    .startAnimation();
                                addCrossLineCounter();

                                if ($scope.monsta.needs === 'complete') {
                                    $state.go('app.show');
                                } else {

                                    // Next player
                                    $scope.checkNextPlayer();
                                }

                            });

                    });

                break;

        }

    };



    // Crossline was hit
    Draw.crossLineHit().update(function(data) {

        // If 2 or more crossings have been made, allow to go to the next body part / player
        // For the stomach 4 crossings have to be made

        var index = 0;
        if ($scope.monsta.needs === 'stomach') index = 1;
        if ($scope.monsta.needs === 'legs') index = 2;

        var nextAllowed = false;
        switch ($scope.monsta.needs) {
            case 'head': // HEAD

                // Increase counter everytime a path crosses the line
                $scope.state.numberIntersections[index]++;
                nextAllowed = $scope.state.numberIntersections[index] >= 2;

                break;

            case 'stomach': // STOMACH

                // Bottom crossline was hit
                if (data.index === 0) {
                    // Increase counter everytime a path crosses the line
                    $scope.state.numberIntersections[1]++;
                }
                // Top crossline was hit
                if (data.index === 1) {
                    // Increase counter everytime a path crosses the line
                    $scope.state.numberIntersections[0]++;
                }

                nextAllowed = ($scope.state.numberIntersections[0] >= 4 && $scope.state.numberIntersections[1] >= 2);

                break;

            case 'legs': // LEGS

                // Increase counter everytime a path crosses the line
                $scope.state.numberIntersections[1]++;
                nextAllowed = $scope.state.numberIntersections[1] >= 4;

                break;

        }

        if (nextAllowed) {
            $scope.$emit('body::class::remove', 'disable-next');
        }

    });

    // Monster was moved up
    function savePart(data) {

        // Set this body part
        DoodleApp.updatePart($scope.monsta.needs, {
            paperjs: data.data,
            crossLines: data.crossLines,
            canvasInfo: $scope.drawData.canvasInfo
        });

        // Set next part
        DoodleApp.nextPart();

        // Save monsta
        return DoodleApp.saveMonsta();

    }

    // Monster was moved up
    function addCrossLineCounter() {

        // Add crossline counter for body part
        $scope.state.numberIntersections.push(0);

    }

    // Monster parts where loaded
    $scope.$on('draw::partLoaded', function(e, data) {
        $scope.next(true);
    });


    // Method to set the selected color
    $scope.setColor = function(color) {
        Sound.play('select');
        Draw.setColor(color);
    };

    // Method to set the selected color
    $scope.setMode = function(mode) {
        Sound.play('select');
        Draw.setMode(mode);
    };
    // Method to undo last draw action
    $scope.undo = function() {
        Sound.play('undo');
        Draw.undo();
    };
    $scope.isSelectedColor = function(color) {
        return (color === Draw.getColor()) ? {
            stroke: '#FFFFFF'
        } : {};
    };
    $scope.isSelectedMode = function(mode) {
        return (mode === Draw.getMode()) ? {
            stroke: '#FFFFFF'
        } : {};
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

    // CHeck next player
    $scope.checkNextPlayer = function() {

        // Is the next user one from a social network?
        if ($scope.monsta.needs && monsta[$scope.monsta.needs].user && monsta[$scope.monsta.needs].user._id !== Auth.getCurrentUser()._id) {
            $state.go('app.home');
        } else {
            $state.go('app.instruction');
        }

    };

    // // Select a collab option
    // $scope.selectCollabOption = function() {

    //     $scope.state.nextStyles = {
    //         transform: 'scale(45)'
    //     };

    //     $timeout(function() {
    //         DoodleApp.selectCollabOptions()
    //             .then(function(options) {
    //                 // Collab options have been closed
    //                 $scope.state.nextStyles = {};

    //                 if (options && options.type !== 'internal') {
    //                     $state.go('app.home');
    //                 }

    //             });
    //     }, 800);

    // };


    // Clean up scope
    $scope.$on('$destroy', function() {
        // $scope.modalGoHome.remove();
    });

});
