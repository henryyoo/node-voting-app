var angular = require('angular');

var app = angular.module('nightlife', []);
app.controller('MainCtrl', ['$scope', "$http", function($scope, $http) {
  $scope.location = "";
  $scope.businesses = [];
  $scope.getResults = function(){
      $http.get("http://localhost:8080/api/yelp").then(function(data){
          var jsonData = JSON.parse(data.data);
          $scope.businesses = jsonData.businesses;
      });
  }
}]);
