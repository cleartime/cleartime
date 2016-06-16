app.controller('addArticleController', ['$scope', 'ajax', 'toast', '$state', 'SERVER_URL', function ($scope, ajax, toast, $state, SERVER_URL) {
    $scope.submit = function () {
        ajax.post({
            url: '/article',
            data: $scope.article,
            toast: "添加中..."
        }).then(
            function (result) {
                toast.dismiss('添加成功!');
                $state.go('layout.article')
            }
        )
    };

    $scope.uploadImg = function (file) {
        console.log(file);
        //ajax.upload(file).then(function(result){
        //    //$scope.imgPath = SERVER_URL+"/upload/"+result.filename;
        //    console.log(result);
        //})


        // 前端代码，基于 jQuery
        // 获取浏览器 file 对象
        var files = file[0];
        // 创建 formData 对象
        var formData = new window.FormData(uploadFormDom[0]);
        if (files.length) {
            this.ajax({
                // 注意，这个 url 地址是一个例子，真实使用时需替换为自己的上传接口 url
                url: SERVER_URL + '/upload',
                method: 'post',
                data: formData,
                processData: false,
                contentType: false
            }).then(function (data) {
                // 上传成功，服务端设置返回
                console.log(data);
            });
        }
    }
}]);