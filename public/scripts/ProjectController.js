'use strict';

angular.module('MiningUseCase')
    .controller('ProjectController', ['$scope', '$http', function ($scope, $http) {
        var refresh = function () {
            $http.get($scope.baseurl + '/projects').then(function (response) {
                $scope.projectlist = response.data;
                $scope.project = {};
            }, function (response)
                { return "Something went wrong." });
        };
        refresh();

        $scope.addProject = function () {
            $http.post($scope.baseurl + '/projects', $scope.project).then(function (response) {
            refresh();
            },function (response)
                { return "Something went wrong." });
        };

        $scope.remove = function (id) {
            $http.delete($scope.baseurl + '/projects/' + id).then(function (response) {
                refresh();
            });
        };


        $scope.edit = function (id) {
            $http.get($scope.baseurl + '/projects/' + id).then(function (response) {
                $scope.project = response.data;
            },function(response){
                return "Something went wrong";
            });
        };


        $scope.updateProject = function () {
            $http.put($scope.baseurl + '/projects/' + $scope.project._id, $scope.project).then(function (response) {
                refresh();
            },function(response){return "Something went wrong."});
        };

        $scope.deselect = function () {
            $scope.project = {};
        }

    }]);
