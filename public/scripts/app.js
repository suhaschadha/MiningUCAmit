'use strict';

angular.module('MiningUseCase', [
    'ngStorage',
    'ngRoute',
    'angular-loading-bar'
])
.config(['$routeProvider', '$httpProvider','$locationProvider', function ($routeProvider, $httpProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        }).
        when('/signin', {
            templateUrl: 'partials/signin.html',
            controller: 'SigninController'
        }).
        when('/project', {
            templateUrl: 'partials/project.html',
            controller: 'ProjectController'
        }).
        when('/user', {
            templateUrl: 'partials/user.html',
            controller: 'UserController'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'SigninUpController'
        }).
        when('/myself', {
            templateUrl: 'partials/myself.html',
            controller: 'MeController'
        }).
        otherwise({
            redirectTo: '/'
        });
    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    





}

])
.run(['$rootScope',function($rootScope){
$rootScope.showflag = false;
$rootScope.baseurl = 'http://localhost:3002';
}
]);
