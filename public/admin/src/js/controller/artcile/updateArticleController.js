app.controller('updateArticleController', ['$scope', 'ajax', 'toast', '$state', 'SERVER_URL', '$stateParams', function ($scope, ajax, toast, $state, SERVER_URL, $stateParams) {
    ajax.get({
        url: '/article/query',
        data: {
            objectId: $stateParams.id
        },
        toast: "获取数据..."
    }).then(function (result) {
        toast.dismiss('获取成功!');
        $scope.article = result;
        $scope.article.category = $scope.article.category.toString();
        $scope.article.content = decodeURIComponent($scope.article.content);
        var fileId = result.fileId;
        if(fileId){
            ajax.get({
                url: '/upload/query',
                data: {
                    objectId: fileId
                },
                toast: "获取数据..."
            }).then(function (result) {
                toast.dismiss('获取成功!');
                $scope.imgPath = result[0].url;
            });
        }
    });

    $scope.article = {};

    $scope.uploadImg = function (file) {
        ajax.upload(file).then(function (result) {
            $scope.article.fileId = result.fileId;
            $scope.imgPath = result.fileUrl;
        })
    }

    $scope.submit = function () {
        if(!$scope.article.fileId){
            alert('请上传图片!');
            return false
        }
        ajax.post({
            url: '/article/update',
            data: $scope.article,
            toast: "添加中..."
        }).then(
            function (result) {
                toast.dismiss('添加成功!');
                $state.go('layout.article')
            }
        )
    };
}]);