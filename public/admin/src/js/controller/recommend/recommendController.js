app.controller('recommendController', ['$scope', 'ajax', 'toast', 'recommendService', function ($scope, ajax, toast, recommendService) {
    recommendService.list().then(function(result){
        $scope.list = result;
    })

    $scope.del = function (id, index) {
        ajax.post({
            url: '/recommend/del',
            data: {
                _id: id
            },
            toast: "删除中..."
        }).then(function (result) {
                toast.dismiss('OK!');
                $scope.list.splice(index, 1)
            }
        )
    }

}]);