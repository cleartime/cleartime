app.controller('addArticleController', ['$scope', 'ajax', 'toast', '$state', 'SERVER_URL', '$http', function ($scope, ajax, toast, $state, SERVER_URL, $http) {
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
            url: '/article',
            data: $scope.article,
            toast: "添加中..."
        }).then(
            function (result) {
                toast.dismiss('添加成功!');
                //$scope.link(result[0].objectId);
                $state.go('layout.article')
            }
        )
    };


    //百度链接提交
    $scope.link = function(a){
        var req = {
            method: 'POST',
            url: 'http://data.zz.baidu.com/urls?site=www.guixiaoxiao.cn&token=v142gv4JbzFKnfgx',
            headers: {
                'Content-Type': 'text/plain'
            },
            data: { 'http': '//guixiaoxiao.cn/post/'+a}
        }
        $http(req).then(function(){
            toast.dismiss('百度链接提交成功!');
        }, function(){
            toast.dismiss('百度链接提交失败!');
        });
    }

}]);