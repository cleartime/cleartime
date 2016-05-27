/**
 * Created by Laggo on 11/4/15.
 */
var app = angular.module('app', ['ui.router', 'ngStorage','ngAnimate','cAlert','ngFileUpload']);
app.run(['$rootScope', '$window', '$http', 'ajax', function ($rootScope, $window, $http, ajax) {
    $rootScope.canverImage = function(url){
        $rootScope.canverImageUrl = url;
        $rootScope.canverImageShow = true;
    }
    $rootScope.canverImageClose = function(url){
        $rootScope.canverImageUrl = url;
        $rootScope.canverImageShow = false;
    }
}]);
/**
 * Created by Laggo on 11/4/15.
 */
var config = {
    'SERVER_URL' : 'http://192.168.1.1:3000'
};
for(item in config){
    app.constant(item,config[item])
}
/**
 * Created by Laggo on 11/5/15.
 */
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");
    // Now set up the states
    $stateProvider
        //登录
        .state('login', {
            url: "/login",
            templateUrl: "www/html/login.html",
            controller: "loginController"
        })
        //布局
        .state('layout', {
            url: "/layout",
            templateUrl: "www/html/layout.html",
            controller: "layoutController"
        })
        //栏目
        .state('layout.category', {
            url: "/category",
            templateUrl: "www/html/category/list.html",
            controller: "listCategoryController"
        })
        .state('layout.addcategory', {
            url: "/addcategory",
            templateUrl: "www/html/category/add.html",
            controller: "addCategoryController"
        })
        //管理员管理
        .state('layout.user', {
            url: "/user",
            templateUrl: "www/html/user/list.html",
            controller: "userController"
        })
        .state('layout.adduser', {
            url: "/adduser",
            templateUrl: "www/html/user/add.html",
            controller: "addUserController"
        })
        //文章管理
        .state('layout.article',{
            url: "/article",
            templateUrl: "www/html/article/article.html",
            controller: "articleController"
        })
        .state('layout.addarticle',{
            url: "/addarticle",
            templateUrl: "www/html/article/add.html",
            controller: "addArticleController"
        })
        .state('layout.updatearticle',{
            url: "/updatearticle/:id",
            templateUrl: "www/html/article/add.html",
            controller: "updateArticleController"
        })
        //推荐位置管理
        .state('layout.recommend',{
            url: '/recommend',
            templateUrl: "www/html/recommend/recommend.html",
            controller: "recommendController"
        })
        .state('layout.addrecommend',{
            url: '/addrecommend',
            templateUrl: "www/html/recommend/add.html",
            controller: "addRecommendController"
        })
        //网站信息设置
        .state('layout.webinfo',{
            url: '/webinfo',
            templateUrl: "www/html/webinfo/webinfo.html",
            controller: "webInfoController"
        })
        //个人信息设置
        .state('layout.information',{
            url: '/information',
            templateUrl: "www/html/webinfo/information.html",
            controller: "informationController"
        })
        //友情链接
        .state('layout.friend',{
            url: '/friend',
            templateUrl: "www/html/friend/friend.html",
            controller: "friendController"
        })
        .state('layout.addfriend',{
            url: '/addfriend',
            templateUrl: "www/html/friend/add.html",
            controller: "addFriendController"
        })
}]);


app.controller('layoutController', ['$scope','$window',function ($scope,$window) {
    $scope.goBack = function(){
        $window.history.back();
    }
}]);
app.controller('loginController', ['$scope', '$state', 'ajax', 'toast', function ($scope, $state, ajax, toast) {
    $scope.submit = function () {
        ajax.post({
            url: '/login',
            data: {
                username: $scope.name,
                password: $scope.password
            },
            toast: "登录中..."
        }).then(
            function (result) {
                toast.dismiss('登录成功!');
                $state.go('layout')
            }
        )
    }
}]);
/**
 * Created by Laggo on 11/5/15.
 */
app.directive("categorylist", ['categoryService',function (categoryService) {
    return {
        restrict: 'E',
        templateUrl: 'www/html/directive/categoryList.html',
        replace: true,
        transclude: true,
        link: function (scope, ele, attr) {
            categoryService.list().then(function(result){
                scope.list = result
            })

        },
    }
}]);

/**
 * Created by Laggo on 11/5/15.
 */
app.directive("recommendlist", ['recommendService',function (recommendService) {
    return {
        restrict: 'E',
        templateUrl: 'www/html/directive/recommendList.html',
        replace: true,
        transclude: true,
        scope: {

        },
        link: function (scope, ele, attr) {
            recommendService.list().then(function(result){
                scope.list = result
            })

        },
    }
}]);

(function () {
    'use strict';
    var app = angular.module('cAlert', []);
    app.run(['$rootScope', 'cAlert', 'toast', function ($rootScope, cAlert, toast) {
        $rootScope.toast = {};
        cAlert.dismiss();
        toast.dismiss('demo');
        angular.element(document.body).append("<calert></calert><toast></toast><cconfirm></cconfirm>");
    }]);
    app.directive('calert', ['$rootScope', 'cAlert', function ($rootScope, cAlert) {
        return {
            restrict: 'E',
            replace: true,
            template: "<div class='cAlert cAlert-{{cAlert.has}}'><div class='cAlert-box'><div class='cAlert-innerbox'><div class='cAlert-content'><p class='cAlert-title'>提示</p><p class='cAlert-font'>{{cAlert.text}}</p><div class='cAlert-btn-box'><p class='cAlert-btn cAlert-btn-faild' ng-click='dismiss()' ng-if='cAlert.comfirm'>关闭</p><p class='cAlert-btn cAlert-btn-true' ng-click='do()'>确认</p></div></div></div></div></div>",
            link: function (scope, ele, attrs) {
                scope.dismiss = function () {
                    cAlert.dismiss();
                };
                scope.do = function () {
                    if ($rootScope.cAlert.back) $rootScope.cAlert.back();
                    cAlert.dismiss();
                }
            }
        }
    }]);
    app.directive('toast', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            replace: true,
            template: "<div class='toast' ng-if='toast.has'>{{toast.mes}}</div>",
            link: function (scope, ele, attrs) {
            }
        }
    }]);
    app.service('cAlert', ['$rootScope', 'toast', function ($rootScope, toast) {
        this.create = function (obj) {
            if(obj.comfirm){
                $rootScope.cAlert.comfirm = true;
            }else{
                $rootScope.cAlert.comfirm = false;
            }
            toast.dismiss();
            $rootScope.cAlert.has = true;
            $rootScope.cAlert.text = obj.mes;
            $rootScope.cAlert.back = obj.back;

        };
        this.dismiss = function () {
            $rootScope.cAlert = {};
            $rootScope.cAlert.text = '';
            $rootScope.cAlert.back = '';
            $rootScope.cAlert.has = false;
        }
    }]);
    app.service('toast', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        this.create = function (mes) {
            $rootScope.toast.mes = mes;
            $rootScope.toast.has = true;
        };
        this.dismiss = function (mes) {
            $rootScope;
            if (mes) {
                $rootScope.toast.mes = mes;
                $timeout(function () {
                    $rootScope.toast.has = false;
                }, 500)
            } else {
                $timeout(function () {
                    $rootScope.toast.has = false;
                }, 1)
            }
        }
    }])

})();
(function () {
    'use strict';
    var app = angular.module('canverImage', []);
    app.run(['$rootScope', function ($rootScope) {
        $rootScope.canverImage = {
            url: '',
            show: false
        };
        $rootScope.canverImageShow = function(url){
            $rootScope.canverImage.url = url;
            $rootScope.canverImage.show = true;
        }
        $rootScope.canverImageClose = function(){
            $rootScope.canverImage.url = '';
            $rootScope.canverImage.show = false;
        }
        angular.element(document.body).append("<canverimage></canverimage>");
    }]);
    app.directive('canverimage', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            replace: true,
            template: "<div class='canverImage canverImage-{{canverImage.show}}' ng-click='canverImageClose()'><div><img ng-src='{{canverImage.url}}' alt=''></div></div>",
            link: function (scope, ele, attrs) {
            }
        }
    }]);

})();
app.service('toolService', function () {

});

app.service('ajax', ['$q', '$http', '$rootScope', 'SERVER_URL', '$state', 'cAlert', 'toast', 'Upload', function ($q, $http, $rootScope, SERVER_URL, $state, cAlert, toast, Upload) {
    this.post = function (postData) {
        var req = {
            method: 'POST',
            url: SERVER_URL + postData.url,
            data: postData.data
        }
        return this.ajax(req, postData);
    };
    this.get = function (postData) {
        var req = {
            method: 'GET',
            url: SERVER_URL + postData.url,
            params: postData.data
        }
        return this.ajax(req, postData);
    }
    this.ajax = function (req, postData) {
        //if(postData.toast&&$rootScope.toast.has){
        //    alert('不要重复操作!');
        //    return false
        //}
        if (postData.toast) {
            toast.create(postData.toast);
        }
        var defer = $q.defer();
        var promise = defer.promise;
        $http(req).then(
            function success(response) {
                if (response.data.code == 200) {
                    defer.resolve(response.data.data);
                } else if (response.data.code == 202) {
                    $state.go('login')
                } else {
                    cAlert.create({
                        mes: response.data.mes
                    })
                }
            },
            function failed(response) {
                cAlert.create({
                    mes: '服务端错误！'
                })
            }
        );
        return promise
    }
    this.upload = function (file, data) {
        var deferred = $q.defer();
        Upload.upload({
            //服务端接收
            url: SERVER_URL + '/upload',
            //上传的同时带的参数
            data: data,
            file: file
        }).then(function (resp) {
            deferred.resolve(resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // deferred.resolve(progressPercentage);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        return deferred.promise;
    };
}
])
;

app.service('articleService', ['ajax', '$q', function (ajax, $q) {
    this.list = function () {
        var defer = $q.defer();
        var promise = defer.promise;
        ajax.post({
            url: '/article'
        }).then(function (result) {
            defer.resolve(result);
        })
        return promise
    }
}]);


app.service('categoryService', ['ajax', '$q', function (ajax, $q) {
    this.list = function () {
        var defer = $q.defer();
        var promise = defer.promise;
        ajax.post({
            url: '/category'
        }).then(function (result) {
            defer.resolve(result);
        })
        return promise
    }
}]);


/**
 * Created by Laggo on 16/2/4.
 */
app.service('recommendService', ['ajax', '$q', function (ajax, $q) {
    this.list = function () {
        var defer = $q.defer();
        var promise = defer.promise;
        ajax.post({
            url: '/recommend'
        }).then(function (result) {
            defer.resolve(result);
        })
        return promise
    }
}]);


app.controller('addArticleController', ['$scope', 'ajax', 'toast', '$state','SERVER_URL', function ($scope, ajax, toast, $state,SERVER_URL) {
    $scope.submit = function () {
        ajax.post({
            url: '/article/add',
            data: $scope.article,
            toast: "添加中..."
        }).then(
            function (result) {
                toast.dismiss('添加成功!');
                $state.go('layout.article')
            }
        )
    }

    $scope.uploadImg = function(file){
        ajax.upload(file).then(function(result){
            $scope.imgPath = SERVER_URL+"/upload/"+result.filename;
            console.log(result);
        })
    }
}]);
app.controller('articleController', ['$scope', 'ajax', 'toast','articleService', function ($scope, ajax, toast,articleService) {

    articleService.list().then(function(result){
        console.log(result);
        $scope.list = result;
    })

    $scope.del = function(id,index){
        ajax.post({
            url: '/article/del',
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
app.controller('updateArticleController', ['$scope', 'ajax', 'toast', '$state', 'SERVER_URL', '$stateParams', function ($scope, ajax, toast, $state, SERVER_URL, $stateParams) {
    ajax.post({
        url: '/article/query',
        data: {
            id: $stateParams.id
        },
        toast: "获取数据..."
    }).then(function (result) {
        toast.dismiss('获取成功!');
        $scope.article = result;
    })

    $scope.submit = function () {
        $scope.article.updateTime = new Date();
        ajax.post({
            url: '/article/update',
            data: $scope.article,
            toast: "修改中..."
        }).then(function (result) {
                toast.dismiss('修改成功!');
                $state.go('layout.article')
            }
        )
    };
    $scope.uploadImg = function (file) {
        ajax.upload(file).then(function (result) {
            $scope.imgPath = SERVER_URL + "/upload/" + result.filename;
        })
    }
}]);
app.controller('addCategoryController', ['$scope', 'ajax', 'toast', '$state', function ($scope, ajax, toast, $state) {
    $scope.submit = function () {
        ajax.post({
            url: '/category/add',
            data: {
                name: $scope.name,
            },
            toast: "添加中..."
        }).then(
            function (result) {
                toast.dismiss('添加成功!');
                $state.go('layout.category')
            }
        )
    }
}]);
app.controller('listCategoryController', ['$scope', 'ajax', 'toast','categoryService', function ($scope, ajax, toast,categoryService) {
    categoryService.list().then(function(result){
        $scope.list = result;
    })

    $scope.del = function (id, index) {
        ajax.post({
            url: '/category/del',
            data: {
                _id: id
            },
            toast: "删除中..."
        }).then(
            function (result) {
                toast.dismiss('OK!');
                $scope.list.splice(index, 1)
            }
        )
    }
}]);
app.controller('addFriendController', ['$scope', 'ajax', 'toast', '$state', function ($scope, ajax, toast, $state) {
    $scope.submit = function () {
        ajax.post({
            url: '/friend/add',
            data: $scope.data,
            toast: "添加中..."
        }).then(function (result) {
            toast.dismiss('添加成功!');
            $state.go('layout.friend');
        })
    }
}]);
/**
 * Created by Hou on 16/3/29.
 */
app.controller('friendController', ['$scope', 'ajax', 'toast', '$state', 'cAlert', function ($scope, ajax, toast, $state, cAlert) {
    ajax.post({
        url: '/friend/query',
        toast: "do..."
    }).then(function (result) {
        $scope.resultData = result;
        toast.dismiss('end..!');
        $state.go('layout.friend');
    })


    $scope.del = function (id, index) {
        cAlert.create({
            mes: '是否确认删除!',
            comfirm: true,
            back: function () {
                ajax.post({
                    url: '/friend/del',
                    data: {
                        _id: id
                    },
                    toast: "删除中..."
                }).then(
                    function (result) {
                        toast.dismiss('OK!');
                        $scope.resultData.splice(index, 1)
                    }
                )
            }
        })
    }

}]);

/**
 * Created by gxx on 2016/1/28.
 */
app.controller('managerController', ['$scope', function ($scope) {

}]);

app.controller('addRecommendController', ['$scope', 'ajax', 'toast', '$state', function ($scope, ajax, toast, $state) {
    $scope.submit = function () {
        ajax.post({
            url: '/recommend/add',
            data: {
                name: $scope.name,
            },
            toast: "添加中..."
        }).then(function (result) {
            toast.dismiss('添加成功!');
            $state.go('layout.recommend');
        })
    }
}]);
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
app.controller('informationController', ['$scope', 'ajax', 'cAlert','toast', function ($scope, ajax, cAlert,toast) {
    ajax.post({
        url: '/information/query',
        toast: "获取中..."
    }).then(function(result){
        $scope.info = result;
        toast.dismiss('获取成功');
    })

    $scope.submit = function(){
        ajax.post({
            url: '/information/set',
            data: $scope.info,
            toast: "修改中..."
        }).then(function(result){
            cAlert.create({
                mes:'修改成功'
            })
        })
    }
}]);
app.controller('webInfoController', ['$scope', 'ajax', 'cAlert','toast', function ($scope, ajax, cAlert,toast) {
    ajax.post({
        url: '/webinfo/query',
        toast: "获取中..."
    }).then(function(result){
        $scope.info = result;
        toast.dismiss('获取成功');
    })

    $scope.submit = function(){
        ajax.post({
            url: '/webinfo/set',
            data: $scope.info,
            toast: "修改中..."
        }).then(function(result){
            cAlert.create({
                mes:'修改成功'
            })
        })
    }
}]);
app.controller('addUserController', ['$scope', 'ajax', 'toast', '$state', function ($scope, ajax, toast, $state) {
    $scope.submit = function () {
        ajax.post({
            url: '/users/add',
            data: {
                name: $scope.name,
                password: $scope.password
            },
            toast: "添加中..."
        }).then(function (result) {
            toast.dismiss('添加成功!');
            $state.go('layout.user')
        })
    }
}]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInJvdXRlci5qcyIsImNvbnRyb2xsZXIvaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sYXlvdXRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sb2dpbkNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmUvY2F0ZWdvcnlMaXN0LmpzIiwiZGlyZWN0aXZlL3JlY29tbWVuZExpc3QuanMiLCJtb2R1bGVzL2NBbGVydC5qcyIsIm1vZHVsZXMvY2FudmVySW1hZ2UuanMiLCJzZXJ2aWNlL1Rvb2xTZXJ2aWNlLmpzIiwic2VydmljZS9hamF4U2VydmljZS5qcyIsInNlcnZpY2UvYXJ0aWNsZS5qcyIsInNlcnZpY2UvY2F0ZWdvcnkuanMiLCJzZXJ2aWNlL3JlY29tbWVuZC5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hZGRBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS91cGRhdGVBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvY2F0ZWdvcnkvYWRkQ2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9jYXRlZ29yeS9saXN0Q2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9mcmllbmQvYWRkLmpzIiwiY29udHJvbGxlci9mcmllbmQvZnJpZW5kLmpzIiwiY29udHJvbGxlci9tYW5hZ2VyL21hbmFnZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9yZWNvbW1lbmQvYWRkUmVjb21tZW5kQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcmVjb21tZW5kL3JlY29tbWVuZENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3dlYmluZm8vaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci93ZWJpbmZvL3dlYmluZm9Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci91c2VyL2FkZFVzZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci91c2VyL3VzZXJDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNC8xNS5cbiAqL1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCduZ0FuaW1hdGUnLCdjQWxlcnQnLCduZ0ZpbGVVcGxvYWQnXSk7XG5hcHAucnVuKFsnJHJvb3RTY29wZScsICckd2luZG93JywgJyRodHRwJywgJ2FqYXgnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHdpbmRvdywgJGh0dHAsIGFqYXgpIHtcbiAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlID0gZnVuY3Rpb24odXJsKXtcbiAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZVVybCA9IHVybDtcbiAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZVNob3cgPSB0cnVlO1xuICAgIH1cbiAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlQ2xvc2UgPSBmdW5jdGlvbih1cmwpe1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlVXJsID0gdXJsO1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlU2hvdyA9IGZhbHNlO1xuICAgIH1cbn1dKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNC8xNS5cbiAqL1xudmFyIGNvbmZpZyA9IHtcbiAgICAnU0VSVkVSX1VSTCcgOiAnaHR0cDovLzE5Mi4xNjguMS4xOjMwMDAnXG59O1xuZm9yKGl0ZW0gaW4gY29uZmlnKXtcbiAgICBhcHAuY29uc3RhbnQoaXRlbSxjb25maWdbaXRlbV0pXG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvbG9naW5cIik7XG4gICAgLy8gTm93IHNldCB1cCB0aGUgc3RhdGVzXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLy/nmbvlvZVcbiAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2xvZ2luLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibG9naW5Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/luIPlsYBcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2xheW91dFwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvbGF5b3V0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGF5b3V0Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5qCP55uuXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmNhdGVnb3J5Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9jYXRlZ29yeVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvY2F0ZWdvcnkvbGlzdC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImxpc3RDYXRlZ29yeUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGRjYXRlZ29yeScsIHtcbiAgICAgICAgICAgIHVybDogXCIvYWRkY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2NhdGVnb3J5L2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZENhdGVnb3J5Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v566h55CG5ZGY566h55CGXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnVzZXInLCB7XG4gICAgICAgICAgICB1cmw6IFwiL3VzZXJcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3VzZXIvbGlzdC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInVzZXJDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkdXNlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvYWRkdXNlclwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvdXNlci9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRVc2VyQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5paH56ug566h55CGXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFydGljbGUnLHtcbiAgICAgICAgICAgIHVybDogXCIvYXJ0aWNsZVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvYXJ0aWNsZS9hcnRpY2xlLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYXJ0aWNsZUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGRhcnRpY2xlJyx7XG4gICAgICAgICAgICB1cmw6IFwiL2FkZGFydGljbGVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2FydGljbGUvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkQXJ0aWNsZUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC51cGRhdGVhcnRpY2xlJyx7XG4gICAgICAgICAgICB1cmw6IFwiL3VwZGF0ZWFydGljbGUvOmlkXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9hcnRpY2xlL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInVwZGF0ZUFydGljbGVDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/mjqjojZDkvY3nva7nrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQucmVjb21tZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3JlY29tbWVuZC9yZWNvbW1lbmQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJyZWNvbW1lbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkcmVjb21tZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvYWRkcmVjb21tZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3JlY29tbWVuZC9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRSZWNvbW1lbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/nvZHnq5nkv6Hmga/orr7nva5cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQud2ViaW5mbycse1xuICAgICAgICAgICAgdXJsOiAnL3dlYmluZm8nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvd2ViaW5mby93ZWJpbmZvLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwid2ViSW5mb0NvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+S4quS6uuS/oeaBr+iuvue9rlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5pbmZvcm1hdGlvbicse1xuICAgICAgICAgICAgdXJsOiAnL2luZm9ybWF0aW9uJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3dlYmluZm8vaW5mb3JtYXRpb24uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJpbmZvcm1hdGlvbkNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+WPi+aDhemTvuaOpVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5mcmllbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9mcmllbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvZnJpZW5kL2ZyaWVuZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImZyaWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGRmcmllbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9hZGRmcmllbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvZnJpZW5kL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZEZyaWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxufV0pO1xuIiwiIiwiYXBwLmNvbnRyb2xsZXIoJ2xheW91dENvbnRyb2xsZXInLCBbJyRzY29wZScsJyR3aW5kb3cnLGZ1bmN0aW9uICgkc2NvcGUsJHdpbmRvdykge1xuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuICAgICAgICAkd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FqYXgnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsIGFqYXgsIHRvYXN0KSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLnmbvlvZXkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+eZu+W9leaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dCcpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5kaXJlY3RpdmUoXCJjYXRlZ29yeWxpc3RcIiwgWydjYXRlZ29yeVNlcnZpY2UnLGZ1bmN0aW9uIChjYXRlZ29yeVNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3d3dy9odG1sL2RpcmVjdGl2ZS9jYXRlZ29yeUxpc3QuaHRtbCcsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRyKSB7XG4gICAgICAgICAgICBjYXRlZ29yeVNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzY29wZS5saXN0ID0gcmVzdWx0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0sXG4gICAgfVxufV0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5kaXJlY3RpdmUoXCJyZWNvbW1lbmRsaXN0XCIsIFsncmVjb21tZW5kU2VydmljZScsZnVuY3Rpb24gKHJlY29tbWVuZFNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3d3dy9odG1sL2RpcmVjdGl2ZS9yZWNvbW1lbmRMaXN0Lmh0bWwnLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICBzY29wZToge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRyKSB7XG4gICAgICAgICAgICByZWNvbW1lbmRTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgc2NvcGUubGlzdCA9IHJlc3VsdFxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9LFxuICAgIH1cbn1dKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY0FsZXJ0JywgW10pO1xuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgJ2NBbGVydCcsICd0b2FzdCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBjQWxlcnQsIHRvYXN0KSB7XG4gICAgICAgICRyb290U2NvcGUudG9hc3QgPSB7fTtcbiAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygnZGVtbycpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGNhbGVydD48L2NhbGVydD48dG9hc3Q+PC90b2FzdD48Y2NvbmZpcm0+PC9jY29uZmlybT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbGVydCcsIFsnJHJvb3RTY29wZScsICdjQWxlcnQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgY0FsZXJ0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J2NBbGVydCBjQWxlcnQte3tjQWxlcnQuaGFzfX0nPjxkaXYgY2xhc3M9J2NBbGVydC1ib3gnPjxkaXYgY2xhc3M9J2NBbGVydC1pbm5lcmJveCc+PGRpdiBjbGFzcz0nY0FsZXJ0LWNvbnRlbnQnPjxwIGNsYXNzPSdjQWxlcnQtdGl0bGUnPuaPkOekujwvcD48cCBjbGFzcz0nY0FsZXJ0LWZvbnQnPnt7Y0FsZXJ0LnRleHR9fTwvcD48ZGl2IGNsYXNzPSdjQWxlcnQtYnRuLWJveCc+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi1mYWlsZCcgbmctY2xpY2s9J2Rpc21pc3MoKScgbmctaWY9J2NBbGVydC5jb21maXJtJz7lhbPpl608L3A+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi10cnVlJyBuZy1jbGljaz0nZG8oKSc+56Gu6K6kPC9wPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNjb3BlLmRvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS5jQWxlcnQuYmFjaykgJHJvb3RTY29wZS5jQWxlcnQuYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuZGlzbWlzcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCd0b2FzdCcsIFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J3RvYXN0JyBuZy1pZj0ndG9hc3QuaGFzJz57e3RvYXN0Lm1lc319PC9kaXY+XCIsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cnMpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgnY0FsZXJ0JywgWyckcm9vdFNjb3BlJywgJ3RvYXN0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsIHRvYXN0KSB7XG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgaWYob2JqLmNvbWZpcm0pe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmNvbWZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuY29tZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuaGFzID0gdHJ1ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LnRleHQgPSBvYmoubWVzO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuYmFjayA9IG9iai5iYWNrO1xuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0ID0ge307XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC50ZXh0ID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5iYWNrID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5oYXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgndG9hc3QnLCBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobWVzKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1lcyA9IG1lcztcbiAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kaXNtaXNzID0gZnVuY3Rpb24gKG1lcykge1xuICAgICAgICAgICAgJHJvb3RTY29wZTtcbiAgICAgICAgICAgIGlmIChtZXMpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1lcyA9IG1lcztcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgNTAwKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKVxuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY2FudmVySW1hZ2UnLCBbXSk7XG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlID0ge1xuICAgICAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2VTaG93ID0gZnVuY3Rpb24odXJsKXtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2UudXJsID0gdXJsO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS5zaG93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlQ2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS51cmwgPSAnJztcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2Uuc2hvdyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8Y2FudmVyaW1hZ2U+PC9jYW52ZXJpbWFnZT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbnZlcmltYWdlJywgWyckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz0nY2FudmVySW1hZ2UgY2FudmVySW1hZ2Ute3tjYW52ZXJJbWFnZS5zaG93fX0nIG5nLWNsaWNrPSdjYW52ZXJJbWFnZUNsb3NlKCknPjxkaXY+PGltZyBuZy1zcmM9J3t7Y2FudmVySW1hZ2UudXJsfX0nIGFsdD0nJz48L2Rpdj48L2Rpdj5cIixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRycykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG59KSgpOyIsImFwcC5zZXJ2aWNlKCd0b29sU2VydmljZScsIGZ1bmN0aW9uICgpIHtcblxufSk7XG4iLCJhcHAuc2VydmljZSgnYWpheCcsIFsnJHEnLCAnJGh0dHAnLCAnJHJvb3RTY29wZScsICdTRVJWRVJfVVJMJywgJyRzdGF0ZScsICdjQWxlcnQnLCAndG9hc3QnLCAnVXBsb2FkJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHJvb3RTY29wZSwgU0VSVkVSX1VSTCwgJHN0YXRlLCBjQWxlcnQsIHRvYXN0LCBVcGxvYWQpIHtcbiAgICB0aGlzLnBvc3QgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgcG9zdERhdGEudXJsLFxuICAgICAgICAgICAgZGF0YTogcG9zdERhdGEuZGF0YVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmFqYXgocmVxLCBwb3N0RGF0YSk7XG4gICAgfTtcbiAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChwb3N0RGF0YSkge1xuICAgICAgICB2YXIgcmVxID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogU0VSVkVSX1VSTCArIHBvc3REYXRhLnVybCxcbiAgICAgICAgICAgIHBhcmFtczogcG9zdERhdGEuZGF0YVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmFqYXgocmVxLCBwb3N0RGF0YSk7XG4gICAgfVxuICAgIHRoaXMuYWpheCA9IGZ1bmN0aW9uIChyZXEsIHBvc3REYXRhKSB7XG4gICAgICAgIC8vaWYocG9zdERhdGEudG9hc3QmJiRyb290U2NvcGUudG9hc3QuaGFzKXtcbiAgICAgICAgLy8gICAgYWxlcnQoJ+S4jeimgemHjeWkjeaTjeS9nCEnKTtcbiAgICAgICAgLy8gICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vfVxuICAgICAgICBpZiAocG9zdERhdGEudG9hc3QpIHtcbiAgICAgICAgICAgIHRvYXN0LmNyZWF0ZShwb3N0RGF0YS50b2FzdCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICAkaHR0cChyZXEpLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuY29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXNwb25zZS5kYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuZGF0YS5jb2RlID09IDIwMikge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lczogcmVzcG9uc2UuZGF0YS5tZXNcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gZmFpbGVkKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG1lczogJ+acjeWKoeerr+mUmeivr++8gSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbiAgICB0aGlzLnVwbG9hZCA9IGZ1bmN0aW9uIChmaWxlLCBkYXRhKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgLy/mnI3liqHnq6/mjqXmlLZcbiAgICAgICAgICAgIHVybDogU0VSVkVSX1VSTCArICcvdXBsb2FkJyxcbiAgICAgICAgICAgIC8v5LiK5Lyg55qE5ZCM5pe25bim55qE5Y+C5pWwXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgZmlsZTogZmlsZVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3AuZGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3Igc3RhdHVzOiAnICsgcmVzcC5zdGF0dXMpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgICAgICAgLy8gdmFyIHByb2dyZXNzUGVyY2VudGFnZSA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XG4gICAgICAgICAgICAvLyBkZWZlcnJlZC5yZXNvbHZlKHByb2dyZXNzUGVyY2VudGFnZSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdwcm9ncmVzczogJyArIHByb2dyZXNzUGVyY2VudGFnZSArICclICcgKyBldnQuY29uZmlnLmRhdGEuZmlsZS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59XG5dKVxuO1xuIiwiYXBwLnNlcnZpY2UoJ2FydGljbGVTZXJ2aWNlJywgWydhamF4JywgJyRxJywgZnVuY3Rpb24gKGFqYXgsICRxKSB7XG4gICAgdGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCJhcHAuc2VydmljZSgnY2F0ZWdvcnlTZXJ2aWNlJywgWydhamF4JywgJyRxJywgZnVuY3Rpb24gKGFqYXgsICRxKSB7XG4gICAgdGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnknXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDE2LzIvNC5cbiAqL1xuYXBwLnNlcnZpY2UoJ3JlY29tbWVuZFNlcnZpY2UnLCBbJ2FqYXgnLCAnJHEnLCBmdW5jdGlvbiAoYWpheCwgJHEpIHtcbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQnXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiYXBwLmNvbnRyb2xsZXIoJ2FkZEFydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCdTRVJWRVJfVVJMJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSxTRVJWRVJfVVJMKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL2FkZCcsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuYXJ0aWNsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmFydGljbGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgJHNjb3BlLnVwbG9hZEltZyA9IGZ1bmN0aW9uKGZpbGUpe1xuICAgICAgICBhamF4LnVwbG9hZChmaWxlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAkc2NvcGUuaW1nUGF0aCA9IFNFUlZFUl9VUkwrXCIvdXBsb2FkL1wiK3Jlc3VsdC5maWxlbmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhcnRpY2xlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCdhcnRpY2xlU2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LGFydGljbGVTZXJ2aWNlKSB7XG5cbiAgICBhcnRpY2xlU2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uKGlkLGluZGV4KXtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL2RlbCcsXG4gICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgX2lkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3VwZGF0ZUFydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCAnU0VSVkVSX1VSTCcsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCBTRVJWRVJfVVJMLCAkc3RhdGVQYXJhbXMpIHtcbiAgICBhamF4LnBvc3Qoe1xuICAgICAgICB1cmw6ICcvYXJ0aWNsZS9xdWVyeScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiAkc3RhdGVQYXJhbXMuaWRcbiAgICAgICAgfSxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5pWw5o2uLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfIScpO1xuICAgICAgICAkc2NvcGUuYXJ0aWNsZSA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFydGljbGUudXBkYXRlVGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZS91cGRhdGUnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmFydGljbGUsXG4gICAgICAgICAgICB0b2FzdDogXCLkv67mlLnkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfkv67mlLnmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuYXJ0aWNsZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9O1xuICAgICRzY29wZS51cGxvYWRJbWcgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBhamF4LnVwbG9hZChmaWxlKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gU0VSVkVSX1VSTCArIFwiL3VwbG9hZC9cIiArIHJlc3VsdC5maWxlbmFtZTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FkZENhdGVnb3J5Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnkvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5jYXRlZ29yeScpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2xpc3RDYXRlZ29yeUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywnY2F0ZWdvcnlTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsY2F0ZWdvcnlTZXJ2aWNlKSB7XG4gICAgY2F0ZWdvcnlTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2NhdGVnb3J5L2RlbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhZGRGcmllbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9mcmllbmQvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5kYXRhLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5mcmllbmQnKTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEhvdSBvbiAxNi8zLzI5LlxuICovXG5hcHAuY29udHJvbGxlcignZnJpZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgJ2NBbGVydCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIGNBbGVydCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy9mcmllbmQvcXVlcnknLFxuICAgICAgICB0b2FzdDogXCJkby4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICRzY29wZS5yZXN1bHREYXRhID0gcmVzdWx0O1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCdlbmQuLiEnKTtcbiAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuZnJpZW5kJyk7XG4gICAgfSlcblxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbiAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICBtZXM6ICfmmK/lkKbnoa7orqTliKDpmaQhJyxcbiAgICAgICAgICAgIGNvbWZpcm06IHRydWUsXG4gICAgICAgICAgICBiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2ZyaWVuZC9kZWwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgICAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0RGF0YS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG59XSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZ3h4IG9uIDIwMTYvMS8yOC5cbiAqL1xuYXBwLmNvbnRyb2xsZXIoJ21hbmFnZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbn1dKTtcbiIsImFwcC5jb250cm9sbGVyKCdhZGRSZWNvbW1lbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LnJlY29tbWVuZCcpO1xuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigncmVjb21tZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAncmVjb21tZW5kU2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCByZWNvbW1lbmRTZXJ2aWNlKSB7XG4gICAgcmVjb21tZW5kU2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2luZm9ybWF0aW9uQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAnY0FsZXJ0JywndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCBjQWxlcnQsdG9hc3QpIHtcbiAgICBhamF4LnBvc3Qoe1xuICAgICAgICB1cmw6ICcvaW5mb3JtYXRpb24vcXVlcnknLFxuICAgICAgICB0b2FzdDogXCLojrflj5bkuK0uLi5cIlxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgJHNjb3BlLmluZm8gPSByZXN1bHQ7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ+iOt+WPluaIkOWKnycpO1xuICAgIH0pXG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9pbmZvcm1hdGlvbi9zZXQnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmluZm8sXG4gICAgICAgICAgICB0b2FzdDogXCLkv67mlLnkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICBtZXM6J+S/ruaUueaIkOWKnydcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCd3ZWJJbmZvQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAnY0FsZXJ0JywndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCBjQWxlcnQsdG9hc3QpIHtcbiAgICBhamF4LnBvc3Qoe1xuICAgICAgICB1cmw6ICcvd2ViaW5mby9xdWVyeScsXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluS4rS4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAkc2NvcGUuaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfJyk7XG4gICAgfSlcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3dlYmluZm8vc2V0JyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pbmZvLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5L+u5pS55LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgbWVzOifkv67mlLnmiJDlip8nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkVXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3VzZXJzL2FkZCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJHNjb3BlLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQudXNlcicpXG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCd1c2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy91c2VycydcbiAgICB9KS50aGVuKFxuICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICAgICAgfVxuICAgIClcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpZCxpbmRleCl7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvdXNlcnMvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
