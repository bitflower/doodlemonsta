var app = angular.module('starter.directives', []);

app.directive('doodleMonsta', ['$window', function($window) {
    return {
        restrict: 'A',
        scope: true,
        link: function($scope, $element, $attrs) {

            // Set height & width
            var retinaMulti = 1;
            if (window.devicePixelRatio) {
                retinaMulti = window.devicePixelRatio;
            }

            $element.css('height', $window.innerHeight - 44 + 'px');
            $attrs.$set('height', ($window.innerHeight - 44) * retinaMulti + 'px');
            $element.css('width', $window.innerWidth + 'px');
            $attrs.$set('width', ($window.innerWidth) * retinaMulti + 'px');

            // Add id to canvas
            $attrs.$set('id', 'doodleMonsta');

            // Setup Taxhero game
            $scope.myDoodleMonstaGame = new $window.Doodlemonsta($element[0]);




            // Listen for event from controller
            // $scope.$on('Taxhero::startGame', function(e, args) {
            //     console.log('Got the START EVENT');
            // });


            // Clean up
            // $element.on('$destroy', function() {
            //     console.log("Destroy");
            //     $scope.myTaxHeroGame.end();
            // });

        }
    };
}]);
