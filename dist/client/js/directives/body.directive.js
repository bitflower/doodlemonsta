angular.module('starter')
    .directive('body', [function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                scope.$on('body::class::add', function(e, name) {
                    element.addClass(name);
                });
                scope.$on('body::class::remove', function(e, name) {
                    element.removeClass(name);
                });
                return;
            }
        };
    }]);
