// Custom URL via LaunchMyApp
function handleOpenURL(url) {

    // Set URL into local storage for first app open
    window.localStorage.setItem("external_load", url);

    // Extract the id from the URL
    var id = url.replace('doodlemonsta://', '');

    // Set id into local storage for first app open
    window.localStorage.setItem("external_load_id", id);

    // Fire event when app is already running
    var event = new CustomEvent(
        'doodlemonsta::externalLink', {
            detail: {
                'url': url,
                'id': id
            }
            // ,
            // bubbles: true,
            // cancelable: true
        });

    setTimeout(function() {
        window.dispatchEvent(event);
    }, 0);
}

// Define app module
angular.module('starter', [
    'ionic', //'ionic.service.core',
    'ngAnimate',
    'ngCordova',
    'ngResource',
    // 'restangular',
    'starter.controllers',
    'starter.directives',
    'DeferredWithUpdate',
    'doodleMonsta.auth',
    'doodlemonsta.decorators',
    'ngOpenFB'
]);
