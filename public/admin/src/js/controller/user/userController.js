app.controller('userController', ['$scope', 'ajax', 'toast', function ($scope, ajax, toast) {
    ajax.post({
        url: '/users'
    }).then(
        function (result) {
            $scope.list = result;
        }
    )

    $scope.del = function(id,index){
        ajax.post({
            url: '/users/del',
            data:{
              _id: id
            },
            toast: "删除中..."
        }).then(
            function (result) {
                toast.dismiss('OK!');
                $scope.list.splice(index,1)
            }
        )
    }

}]);