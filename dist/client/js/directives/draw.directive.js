var app = angular.module('starter');

app.directive('draw', ['$window', 'Draw', function($window, Draw) {
    return {
        restrict: 'A',
        scope: {
            ngModel: '=',
            canvasInfo: '=',
            fadeCanvas: '='
        },
        template: '<canvas ng-style="getCanvasStyle()"></canvas>',
        replace: true,
        link: function($scope, $element, $attrs) {

            // Set height & width of canvas
            var retinaMulti = 1;
            if (window.devicePixelRatio) {
                retinaMulti = window.devicePixelRatio;
            }

            var headerHeight = 0;

            // Save canvas info into scope
            $scope.canvasInfo = {
                width: ($window.innerWidth) * retinaMulti,
                height: ($window.innerHeight - headerHeight) * retinaMulti,
                devicePixelRatio: retinaMulti
            };

            $element.addClass('draw-canvas');
            $element.css('height', $window.innerHeight - headerHeight + 'px');
            $attrs.$set('height', $scope.canvasInfo.height + 'px');
            $element.css('width', $window.innerWidth + 'px');
            $attrs.$set('width', $scope.canvasInfo.width + 'px');

            // Register mouse & touch events
            $element.on('mousedown', _.bind(Draw.mouseDown, Draw)).on('mouseup', _.bind(Draw.mouseUp, Draw)).on('mousemove', _.bind(Draw.mouseDrag, Draw));
            $element.on('touchstart', _.bind(Draw.mouseDown, Draw)).on('touchend', _.bind(Draw.mouseUp, Draw)).on('touchmove', _.bind(Draw.mouseDrag, Draw));

            // Init service
            Draw.initPaper($element[0], $scope.canvasInfo);

            // Canvas style
            $scope.getCanvasStyle = function() {
                if ($scope.fadeCanvas === true) {
                    return {
                        'opacity': 0
                    };
                }
                return {
                    'opacity': 1
                };

            };

        }
    };
}]);
