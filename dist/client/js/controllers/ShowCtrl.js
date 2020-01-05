angular.module('starter.controllers')

.controller('ShowCtrl', function($scope, $state, monsta, DoodleApp) {

    window._MY_SCOPE = $scope;

    // Wird von draw directive befüllt
    $scope.drawData = {
        monstaData: [],
        canvasInfo: {
            width: 0,
            height: 0
        }
    };

    // Show next (for now show it always, later depending upon having finished the "link area")
    DoodleApp.config.navigation.showNext = true;

    // Navigation: Next page
    $scope.$on('doodleMonsta::nextPage', function(event, args) {

        // Save base64 string for later usage
        // var canvas = document.getElementsByClassName("myCanvas");
        // if (canvas.length > 0) {
        //     DoodleApp.monstaBase64 = canvas[0].toDataURL(); // PNG is the default
        // }

        console.info('DrawCtrl:nextPage:monsta.needs: ' + DoodleApp.monsta.needs);

        ///////////////
        // SAVE DATA //
        ///////////////

        // Set segments
        DoodleApp.monsta[DoodleApp.monsta.needs].segments = $scope.drawData.monstaData;

        // Set canvas sizes
        DoodleApp.monsta[DoodleApp.monsta.needs].canvas = $scope.drawData.canvasInfo;
        // DoodleApp.monsta[DoodleApp.monsta.needs].canvas.width = $scope.drawData.canvasInfo.width;
        // DoodleApp.monsta[DoodleApp.monsta.needs].canvas.height = $scope.drawData.canvasInfo.height;

        // Call REST API
        if (DoodleApp.monsta._id) {

            // EXISTING monsta
            DoodleApp.monsta.$update(function(savedMonsta, putResponseHeaders) {

                // Clear canvas
                $scope.$broadcast('draw::clearCanvas'); //, $scope.gameData);

                // Go to social sharing view
                $state.go('app.share');

            }, function(errorResult) {
                if (errorResult.status === 503) {
                    console.log('SHIT !');
                }
            });

        } else {

            // NEW monsta
            DoodleApp.monsta.$save(function(savedMonsta, putResponseHeaders) {

                // Clear canvas
                $scope.$broadcast('draw::clearCanvas');

                // Replace local monsta with freshly saved
                DoodleApp.monsta = savedMonsta;

                // Go to social sharing view
                $state.go('app.share');

            }, function(errorResult) {
                if (errorResult.status === 503) {
                    console.log('SHIT !');
                }
            });
        }

    });

    // View is entered
    $scope.$on('$ionicView.enter', function() {

        // Monsta in service setzen
        $scope.monsta = monsta;
        DoodleApp.monsta = monsta;

    });

});
