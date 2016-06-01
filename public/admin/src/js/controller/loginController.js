app.controller('loginController', ['$scope', '$state', 'ajax', 'toast', '$http', function ($scope, $state, ajax, toast, $http) {

    $scope.submit = function () {
        var data = {
            username: $scope.name,
            password: $scope.password
        };
        $http.post('http://localhost:3000/login', data).then(function (res) {
            console.log(res);
        }, function (res) {
            console.log(res);
        });

    };


}]);