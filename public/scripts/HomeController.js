'use strict';

/* Controllers */

angular.module('MiningUseCase')
       .controller('HomeController', ['$rootScope','$scope', '$http', '$window','$compile','MiningService',function ($rootScope,$scope, $http, $window,$compile,MiningService) {
            $("#navi").show();
            var val=MiningService.status();
            console.log(val);
            $rootScope.name=val;
           var refreshlist = function() {
                $("#first").show();
                $("#second").hide();
                $("#third").hide();
               $http.get($scope.baseurl + '/fileDetails').then(function (response) {
                   $scope.filelist = response.data;
                   $scope.file = {};
               },function (response)
               { return "Something went wrong." });
           };

           refreshlist();


           $scope.removefile = function(id) {
  
               $http.delete('/filelist/' + id).success(function(response) {
                   refreshlist();
               });
           };

           $scope.myFunction = function () {
               $("#first").hide();
                $("#second").show();
                $("#third").hide();
               $scope.ConversionList = {};
                $scope.EntityList = {};
               $http.get($scope.baseurl + '/entity').then(function (response) {
              $scope.EntityList = response.data;
                }, function (response)
                { return "Something went wrong." });
              // $window.location.href = 'http://localhost:3002'; //You should have http here. 
                $http.get($scope.baseurl + '/projects').then(function (response) {
              $scope.ConversionList = response.data;
                }, function (response)
                { return "Something went wrong." });
              document.Pharmaform.action = "/saveshipmentconversion/" ;

           };


        $scope.ShowShipmentFabrication = function (ShipmentId) {
            //ShowWait(true);
           // $scope.ShipmentID = ShipmentId;
           $("#first").hide();
           $("#second").hide();
           $("#third").show();
            $http.get($scope.baseurl + '/fabricationshipmentdetail/' + ShipmentId).then(function (response) {
                $scope.ShipmentDetailsF = response.data[0];
              //  $scope.ShipmentDetailsFB = JSON.parse(response.data[0]);
                $("#ShipmentFiles").empty();
                var filedata = '';
                var Conversion = 'Conversion';
                for (var i = 0; i <= $scope.ShipmentDetailsF.shipmentfiles.files.length - 1; i++) {
                    filedata = filedata + "<span style='font-weight:bold;cursor:pointer;color:blue;'"
                        + "ng-click='DownloadFileF(\"" + Conversion + "\",\"" + $scope.ShipmentDetailsF._id + "\",\"" + $scope.ShipmentDetailsF.shipmentfiles.files[i].filename + "\")'"
                        + "class='ng-binding'>" + $scope.ShipmentDetailsF.shipmentfiles.files[i].filename + "</span><span> |</span>";
                }
                var temp = $compile(filedata)($scope);
                angular.element(document.getElementById('ShipmentFiles')).append(temp);
                //$("#divGridfabrication").hide();
                //$("#ShipmentDetailsFabricator").show();
                //ShowWait(false);
            }, function (response)
                { return "Something went wrong." });
        };

                $scope.DownloadFileF = function (Type, ShipmentID, FileName ) {
            ShowWait(true);
            var config = '';
            $http.get('/download/' + ShipmentID + '/' + FileName).then(function (response) {
                if (response.data.data == 'The file is corrupt.') {
                    ShowWait(false);
                    $("#message").html("The file is corrupt.");
                }
                else {
                    if (response.data.data == "OK") {
                        ShowWait(false);
                        $window.open('/downloadfile/' + response.data.filename);
                    }                   
                }
            });
            ShowWait(false);
        };
        $scope.close=function()
        {
            refreshlist();
        }
  }]);
