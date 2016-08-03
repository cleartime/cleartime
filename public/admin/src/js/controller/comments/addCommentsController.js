app.controller('addCommentsController', ['$scope', 'ajax', 'toast', '$state', '$stateParams', function ($scope, ajax, toast, $state, $stateParams) {
    $scope.submit = function () {
        ajax.post({
            url: '/comments',
            data: $scope.comments,
            toast: "添加中..."
        }).then(
            function (result) {
                toast.dismiss('添加成功!');
                $state.go('layout.article')
            }
        )

    }
}]);