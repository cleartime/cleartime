app.controller('informationController', ['$scope', 'ajax', 'cAlert', 'toast', function ($scope, ajax, cAlert, toast) {
    //查询个人信息
    ajax.get({
        url: '/information',
        toast: "获取中..."
    }).then(function (result) {
        $scope.info = result[0];
        toast.dismiss('获取成功');
    });


    //设置个人信息
    $scope.submit = function () {
        ajax.post({
            url: '/information',
            data: $scope.info,
            toast: "设置中..."
        }).then(function (result) {
            cAlert.create({
                mes: '设置成功!'
            })
        })
    }
}]);