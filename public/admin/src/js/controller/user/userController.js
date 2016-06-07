app.controller('userController', ['$scope', 'ajax', 'toast', function ($scope, ajax, toast) {
    ajax.get({
        url: '/user'
    }).then(
        function (result) {
            $scope.list = result;
        }
    );

    $scope.del = function(id,index){
        console.log(id);
        //ajax.post({
        //    url: '/user/del',
        //    data:{
        //        objectId: id
        //    },
        //    toast: "删除中..."
        //}).then(
        //    function (result) {
        //        toast.dismiss('OK!');
        //        $scope.list.splice(index,1)
        //    }
        //)
    }

}]);