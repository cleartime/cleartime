app.controller('loginController', ['$scope', '$state', 'ajax', 'toast', function ($scope, $state, ajax, toast) {
    $scope.submit = function () {
        ajax.post({
            url: '/login',
            data: {
                username: $scope.name,
                password: $scope.password
            },
            toast: "登录中..."
        }).then(
            function (result) {
                toast.dismiss('登录成功!');
                $state.go('layout')
            }
        )
    }
}]);