'use strict';

angular.module('MiningUseCase')
    .controller('UserController', ['$scope', '$http', function ($scope, $http) {
        var refreshUser = function () {
            $http.get($scope.baseurl + '/users').then(function (response) {
                $scope.Userlist = response.data.AllUsers;
                $scope.UserType = response.data.UserTypes;
                $scope.User = {};
            }, function (response)
                { return "Something went wrong." });
        };
        refreshUser();

        $scope.addUser = function () {
            $http.post($scope.baseurl + '/users', $scope.User).then(function (response) {
            refreshUser();
            },function (response)
                { return "Something went wrong." });
        };

        $scope.remove = function (id) {
            $http.delete($scope.baseurl + '/Users/' + id).then(function (response) {
                refreshUser();
            });
        };


        $scope.edit = function (id) {
            $http.get($scope.baseurl + '/users/' + id).then(function (response) {
                $scope.User = response.data;
            },function(response){
                return "Something went wrong";
            });
        };


        $scope.updateUser = function () {
            $http.put($scope.baseurl + '/users/' + $scope.User._id, $scope.User).then(function (response) {
                refreshUser();
            },function(response){return "Something went wrong."});
        };

        $scope.deselect = function () {
            $scope.User = {};
        }

    }]);
