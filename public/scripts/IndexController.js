'use strict';

/* Controllers */

angular.module('MiningUseCase')
    .controller('IndexController', ['$rootScope', '$scope', '$location', '$localStorage', 'MiningService', function ($rootScope, $scope, $location, $localStorage, MiningService) {
        var currentUser = MiningService.getUserFromToken();
        if (currentUser.fullname == undefined) {
            window.location.assign("#/signin")
        }
        else {
          $rootScope.showflag= true;
        }
    }]);
