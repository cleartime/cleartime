app.controller('addCommentsController', ['$scope', 'ajax', 'toast', '$state', '$stateParams', function ($scope, ajax, toast, $state, $stateParams) {

    if ($stateParams.id) {
        ajax.get({
            url: '/comments/query',
            data: {
                objectId:$stateParams.id,
            },
            toast: "查询中..."
        }).then(
            function (result) {
                toast.dismiss('查询成功!');
                $scope.comments = result;
            }
        )
    }

    $scope.submit = function () {
        var url = $stateParams.id?'/comments/updata':'/comments';
        ajax.post({
            url: url,
            data: $scope.comments,
            toast: "添加中..."
        }).then(
            function (result) {
                toast.dismiss('添加成功!');
                $state.go('layout.comments')
            }
        )

    }
}]);