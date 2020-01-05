var app = angular.module('starter');

app.factory('Sound', function($cordovaNativeAudio, $q) {

    var soundFiles = [{
        id: 'music',
        path: 'audio/DoodleMonstaOST.mp3',
        volume: 0.5,
        type: 'complex'
    }, {
        id: 'select',
        path: 'audio/Select.mp3',
        volume: 1,
        type: 'simple'
    }, {
        id: 'abort',
        path: 'audio/Abort.mp3',
        volume: 1,
        type: 'simple'
    }, {
        id: 'really',
        path: 'audio/Really.mp3',
        volume: 1,
        type: 'simple'
    }, {
        id: 'undo',
        path: 'audio/Undo.mp3',
        volume: 1,
        type: 'simple'
    }];
    var music = _.find(soundFiles, {
        id: 'music'
    });
    var isBackgroundMusicOn = false;

    return {

        isSoundActive: function() {

            return ((ionic.Platform.isIOS() || ionic.Platform.isAndroid()) && !!$cordovaNativeAudio);

        },

        preload: function() {

            var p = $q.defer();

            if (this.isSoundActive()) {

                var promises = [];

                _.forEach(soundFiles, function(o, key) {

                    // Complex sounds
                    promises.push($cordovaNativeAudio.preloadComplex(o.id, o.path, o.volume, 1)); // id, assetPath, volume, voices, delay

                });

                $q.all(promises)
                    .then(function() {
                        p.resolve();
                    }, function() {
                        alert('Error loading some sounds!');
                        p.resolve();
                    });

            } else {
                p.resolve();
            }

            return p;

        },

        play: function(id) {
            if (!this.isSoundActive()) {
                return;
            }
            $cordovaNativeAudio.play(id);

        },

        startBackgroundMusic: function() {
            if (!this.isSoundActive()) {
                return;
            }!isBackgroundMusicOn && $cordovaNativeAudio.loop(music.id);
            isBackgroundMusicOn = true;

        },

        stopBackgroundMusic: function() {
            if (!this.isSoundActive()) {
                return;
            }

            $cordovaNativeAudio.stop(music.id);
            // $cordovaNativeAudio.unload('click');

            isBackgroundMusicOn = false;

        }

    };

});
