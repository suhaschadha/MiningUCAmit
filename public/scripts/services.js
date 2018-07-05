'use strict';

angular.module('MiningUseCase')
    .factory('MiningService', ['$http', '$localStorage','$rootScope', function ($http, $localStorage,$rootScope) {
        var baseUrl = "http://localhost:3002";
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }



        return {
            save: function (data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
            },
            signin: function (data, callback) {
                $http.post(baseUrl + '/authenticate', data).then(function (response) {
                    $rootScope.FullName = response.data.data.fullname;
                    $rootScope.EMail = response.data.data.email;
                    if (response.data.token != undefined) {
                        $rootScope.showflag = true;
                        $localStorage.token = response.data.token;
                        window.location = "#/";
                    }
                }, function (response) {
                    return "Something went wrong";
                }
                );
            },
            logout: function (success) {
                changeUser({});
                delete $localStorage.token;
                success();
            },
            getUserFromToken: function (success) {
                var token = $localStorage.token;
                var user = {};
                if (typeof token !== 'undefined') {
                    var encoded = token.split('.')[1];
                    user = JSON.parse(urlBase64Decode(encoded));
                }
                return user;
            },
            status: function () {
                var token = $localStorage.token;
                var user = {};
                  var encoded = token.split('.')[1];
                    user = JSON.parse(urlBase64Decode(encoded));
                    return user.fullname;
            }
        };
    }
    ]);