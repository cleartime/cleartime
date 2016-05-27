app.controller('layoutController', ['$scope','$window',function ($scope,$window) {
    $scope.goBack = function(){
        $window.history.back();
    }
}]);