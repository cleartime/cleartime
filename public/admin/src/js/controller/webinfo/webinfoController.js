app.controller('webInfoController', ['$scope', 'ajax', 'cAlert','toast', function ($scope, ajax, cAlert,toast) {
    $scope.isUpdata = false;
    //查询个人信息
    ajax.get({
        url: '/webinfo',
        toast: "获取中..."
    }).then(function (result) {
        if (!result.length) {
            $scope.isUpdata = true;
        }
        $scope.info = result[0];
        toast.dismiss('获取成功');
    });


    //设置个人信息
    $scope.submit = function () {
        var url = '';
        var data = '';
        if ($scope.isUpdata) {
            url = '/webinfo';
        } else {
            url = '/webinfo/updata';
        }
        ajax.post({
            url: url,
            data: $scope.info,
            toast: "设置中..."
        }).then(function (result) {
            toast.dismiss('设置成功');
        })
    }
}]);