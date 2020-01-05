angular.module('starter')
    .run(function($ionicPlatform, $state, $q, $timeout, Sound, $openFB) {

        runAngular = new Date().getTime();

        // Disable BACK button on home
        $ionicPlatform.registerBackButtonAction(function(event) {

            // 

            if ($state.current.name == "app.home") {
                if (true) { // your check here
                    $ionicPopup.confirm({
                        title: 'System warning',
                        template: 'are you sure you want to exit?'
                    }).then(function(res) {
                        if (res) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
            } else {
                event.preventDefault();
            }

        }, 100);

        $ionicPlatform.ready(function() {

            ionicReady = new Date().getTime();

            ionic.Platform.fullScreen(true, false);

            // alert('DEBUGGING starts ...');

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                // StatusBar.styleDefault();
                StatusBar.hide();
            }

            // // then override any default you want
            // if (window.plugins && window.plugins.nativepagetransitions) {
            //     window.plugins.nativepagetransitions.globalOptions.duration = 500;
            //     window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
            //     window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
            //     window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
            //     window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
            //     // these are used for slide left/right only currently
            //     window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
            //     window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
            // }

            // Preload stuff then hide splashscreen
            var preloaders = [Sound.preload()];
            $q.all(preloaders)
                .then(function() {

                    preloaderReady = new Date().getTime();

                    // // Hide splash screen
                    // if (navigator.splashscreen) {
                    //     navigator.splashscreen.hide();
                    // }

                });

            $openFB.init({
                appId: '191467987890729'
                    // ,
                    // tokenStore: 'cookie'
            });

            // Go to route if app was launched from custom URL
            window.addEventListener('doodlemonsta::externalLink', function(e) {
                var linkInfo = e.detail;
                $state.go('app.draw', {
                    monstaId: linkInfo.id
                });
            });
            if (window.localStorage["external_load"] && window.localStorage["external_load"] !== '') {
                window.localStorage.setItem("external_load", '');
                window.localStorage.setItem("external_load_id", '');
                $state.go('app.draw', {
                    monstaId: window.localStorage["external_load_id"]
                });
            }

        });

    });
