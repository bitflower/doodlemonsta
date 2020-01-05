angular.module('doodleMonsta.auth', [
	'doodleMonsta.util',
    'ngCookies',
    'ui.router'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
