// alert('DEBUGGING starts ...');
var start = new Date().getTime();
var startAngular;
var runAngular;
var ionicReady;
var preloaderReady;
var musicStarts;

angular.element(document).ready(function() {

    // alert('DEBUGGING 2 starts ...');

    if (window.cordova) {
        // alert('DEBUGGING 3 starts ...');
        document.addEventListener('deviceready', function() {

            setTimeout(function() {

                // Hide splash screen
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                }

                // Bootstrap Angular
                startAngular = new Date().getTime();
                angular.bootstrap(document.body, ['starter']);

            }, 1);
            
        }, false);
    } else {
        // alert('DEBUGGING 3 starts ...');
        angular.bootstrap(document.body, ['starter']);
    }


});
