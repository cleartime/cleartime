/**
 * Created by Laggo on 11/4/15.
 */
var app = angular.module('app', ['ui.router', 'ngStorage','ngAnimate','cAlert','ngFileUpload']);
app.run(['$rootScope', '$window', '$http', 'ajax', function ($rootScope, $window, $http, ajax) {
    $http.defaults.withCredentials = true;
}]);
/**
 * Created by Laggo on 11/4/15.
 */
var config = {
    'SERVER_URL': 'http://localhost:3000'
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
app.controller('loginController', ['$scope', '$state', 'ajax', 'toast', '$http', function ($scope, $state, ajax, toast, $http) {

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
app.directive("categorylist", ['categoryService', function (categoryService) {
    return {
        restrict: 'E',
        templateUrl: 'www/html/directive/categoryList.html',
        replace: true,
        transclude: true,
        link: function (scope, ele, attr) {
            categoryService.list().then(function (result) {
                scope.list = result
            })

        },
    }
}]);

/**
 * Created by Laggo on 11/5/15.
 */
app.directive("recommendlist", ['recommendService', function (recommendService) {
    return {
        restrict: 'E',
        templateUrl: 'www/html/directive/recommendList.html',
        replace: true,
        transclude: true,
        scope: {},
        link: function (scope, ele, attr) {
            recommendService.list().then(function (result) {
                scope.list = result
            })

        },
    }
}]);

app.service('toolService', function () {

});

app.service('ajax', ['$q', '$http', '$rootScope', 'SERVER_URL', '$state', 'cAlert', 'toast', 'Upload', function ($q, $http, $rootScope, SERVER_URL, $state, cAlert, toast, Upload) {
    this.post = function (postData) {
        var req = {
            method: 'POST',
            url: SERVER_URL + postData.url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: postData.data
        };
        return this.ajax(req, postData);
    };
    this.get = function (postData) {
        var req = {
            method: 'GET',
            url: SERVER_URL + postData.url,
            params: postData.data
        };
        return this.ajax(req, postData);
    };
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
                } else {
                    cAlert.create({
                        msg: response.data.msg
                    });
                    $state.go('login')
                }
            },
            function failed(response) {
                cAlert.create({
                    msg: '服务端错误！'
                })
            }
        );
        return promise
    };
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
        });
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
        });
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
        });
        return promise
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
            template: "<div class='toast' ng-if='toast.has'>{{toast.msg}}</div>",
            link: function (scope, ele, attrs) {
            }
        }
    }]);
    app.service('cAlert', ['$rootScope', 'toast', function ($rootScope, toast) {
        this.create = function (obj) {
            if (obj.comfirm) {
                $rootScope.cAlert.comfirm = true;
            } else {
                $rootScope.cAlert.comfirm = false;
            }
            toast.dismiss();
            $rootScope.cAlert.has = true;
            $rootScope.cAlert.text = obj.msg;
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
        this.create = function (msg) {
            $rootScope.toast.msg = msg;
            $rootScope.toast.has = true;
        };
        this.dismiss = function (msg) {
            $rootScope;
            if (msg) {
                $rootScope.toast.msg = msg;
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
        $rootScope.canverImageShow = function (url) {
            $rootScope.canverImage.url = url;
            $rootScope.canverImage.show = true;
        };
        $rootScope.canverImageClose = function () {
            $rootScope.canverImage.url = '';
            $rootScope.canverImage.show = false;
        };
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
    };

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
    });

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
    });

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
    });

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
    });


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
    });

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
app.controller('addUserController', ['$scope', 'ajax', 'toast', '$state', function ($scope, ajax, toast, $state) {
    $scope.submit = function () {
        ajax.post({
            url: '/user',
            data: {
                username: $scope.name,
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
    ajax.get({
        url: '/user'
    }).then(
        function (result) {
            console.log(result);
            $scope.list = result;
        }
    );

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
app.controller('informationController', ['$scope', 'ajax', 'cAlert','toast', function ($scope, ajax, cAlert,toast) {
    ajax.post({
        url: '/information/query',
        toast: "获取中..."
    }).then(function(result){
        $scope.info = result;
        toast.dismiss('获取成功');
    });

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
    });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInJvdXRlci5qcyIsImNvbnRyb2xsZXIvaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sYXlvdXRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sb2dpbkNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmUvY2F0ZWdvcnlMaXN0LmpzIiwiZGlyZWN0aXZlL3JlY29tbWVuZExpc3QuanMiLCJzZXJ2aWNlL1Rvb2xTZXJ2aWNlLmpzIiwic2VydmljZS9hamF4U2VydmljZS5qcyIsInNlcnZpY2UvYXJ0aWNsZS5qcyIsInNlcnZpY2UvY2F0ZWdvcnkuanMiLCJzZXJ2aWNlL3JlY29tbWVuZC5qcyIsIm1vZHVsZXMvY0FsZXJ0LmpzIiwibW9kdWxlcy9jYW52ZXJJbWFnZS5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hZGRBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS91cGRhdGVBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvY2F0ZWdvcnkvYWRkQ2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9jYXRlZ29yeS9saXN0Q2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9mcmllbmQvYWRkLmpzIiwiY29udHJvbGxlci9mcmllbmQvZnJpZW5kLmpzIiwiY29udHJvbGxlci9tYW5hZ2VyL21hbmFnZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9yZWNvbW1lbmQvYWRkUmVjb21tZW5kQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcmVjb21tZW5kL3JlY29tbWVuZENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3VzZXIvYWRkVXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3VzZXIvdXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3dlYmluZm8vaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci93ZWJpbmZvL3dlYmluZm9Db250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS80LzE1LlxuICovXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsJ25nQW5pbWF0ZScsJ2NBbGVydCcsJ25nRmlsZVVwbG9hZCddKTtcbmFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyR3aW5kb3cnLCAnJGh0dHAnLCAnYWpheCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkd2luZG93LCAkaHR0cCwgYWpheCkge1xuICAgICRodHRwLmRlZmF1bHRzLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzQvMTUuXG4gKi9cbnZhciBjb25maWcgPSB7XG4gICAgJ1NFUlZFUl9VUkwnOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJ1xufTtcbmZvcihpdGVtIGluIGNvbmZpZyl7XG4gICAgYXBwLmNvbnN0YW50KGl0ZW0sY29uZmlnW2l0ZW1dKVxufSIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS81LzE1LlxuICovXG5hcHAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL2xvZ2luXCIpO1xuICAgIC8vIE5vdyBzZXQgdXAgdGhlIHN0YXRlc1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC8v55m75b2VXG4gICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9sb2dpbi5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImxvZ2luQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5biD5bGAXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9sYXlvdXRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2xheW91dC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImxheW91dENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+agj+ebrlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5jYXRlZ29yeScsIHtcbiAgICAgICAgICAgIHVybDogXCIvY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2NhdGVnb3J5L2xpc3QuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsaXN0Q2F0ZWdvcnlDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkY2F0ZWdvcnknLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2FkZGNhdGVnb3J5XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9jYXRlZ29yeS9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRDYXRlZ29yeUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+euoeeQhuWRmOeuoeeQhlxuICAgICAgICAuc3RhdGUoJ2xheW91dC51c2VyJywge1xuICAgICAgICAgICAgdXJsOiBcIi91c2VyXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC91c2VyL2xpc3QuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJ1c2VyQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZHVzZXInLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2FkZHVzZXJcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3VzZXIvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkVXNlckNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+aWh+eroOeuoeeQhlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hcnRpY2xlJyx7XG4gICAgICAgICAgICB1cmw6IFwiL2FydGljbGVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2FydGljbGUvYXJ0aWNsZS5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFydGljbGVDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi9hZGRhcnRpY2xlXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9hcnRpY2xlL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZEFydGljbGVDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQudXBkYXRlYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi91cGRhdGVhcnRpY2xlLzppZFwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvYXJ0aWNsZS9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJ1cGRhdGVBcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5o6o6I2Q5L2N572u566h55CGXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnJlY29tbWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9yZWNvbW1lbmQvcmVjb21tZW5kLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicmVjb21tZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZHJlY29tbWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2FkZHJlY29tbWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9yZWNvbW1lbmQvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkUmVjb21tZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v572R56uZ5L+h5oGv6K6+572uXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LndlYmluZm8nLHtcbiAgICAgICAgICAgIHVybDogJy93ZWJpbmZvJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3dlYmluZm8vd2ViaW5mby5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcIndlYkluZm9Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/kuKrkurrkv6Hmga/orr7nva5cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuaW5mb3JtYXRpb24nLHtcbiAgICAgICAgICAgIHVybDogJy9pbmZvcm1hdGlvbicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC93ZWJpbmZvL2luZm9ybWF0aW9uLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiaW5mb3JtYXRpb25Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/lj4vmg4Xpk77mjqVcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuZnJpZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvZnJpZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2ZyaWVuZC9mcmllbmQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJmcmllbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkZnJpZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvYWRkZnJpZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2ZyaWVuZC9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRGcmllbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbn1dKTtcbiIsIiIsImFwcC5jb250cm9sbGVyKCdsYXlvdXRDb250cm9sbGVyJywgWyckc2NvcGUnLCckd2luZG93JyxmdW5jdGlvbiAoJHNjb3BlLCR3aW5kb3cpIHtcbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRzdGF0ZScsICdhamF4JywgJ3RvYXN0JywgJyRodHRwJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBhamF4LCB0b2FzdCwgJGh0dHApIHtcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi55m75b2V5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfnmbvlvZXmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQnKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5kaXJlY3RpdmUoXCJjYXRlZ29yeWxpc3RcIiwgWydjYXRlZ29yeVNlcnZpY2UnLGZ1bmN0aW9uIChjYXRlZ29yeVNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3d3dy9odG1sL2RpcmVjdGl2ZS9jYXRlZ29yeUxpc3QuaHRtbCcsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRyKSB7XG4gICAgICAgICAgICBjYXRlZ29yeVNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzY29wZS5saXN0ID0gcmVzdWx0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0sXG4gICAgfVxufV0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5kaXJlY3RpdmUoXCJyZWNvbW1lbmRsaXN0XCIsIFsncmVjb21tZW5kU2VydmljZScsZnVuY3Rpb24gKHJlY29tbWVuZFNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3d3dy9odG1sL2RpcmVjdGl2ZS9yZWNvbW1lbmRMaXN0Lmh0bWwnLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICBzY29wZToge1xuXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRyKSB7XG4gICAgICAgICAgICByZWNvbW1lbmRTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgc2NvcGUubGlzdCA9IHJlc3VsdFxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9LFxuICAgIH1cbn1dKTtcbiIsImFwcC5zZXJ2aWNlKCd0b29sU2VydmljZScsIGZ1bmN0aW9uICgpIHtcblxufSk7XG4iLCJhcHAuc2VydmljZSgnYWpheCcsIFsnJHEnLCAnJGh0dHAnLCAnJHJvb3RTY29wZScsICdTRVJWRVJfVVJMJywgJyRzdGF0ZScsICdjQWxlcnQnLCAndG9hc3QnLCAnVXBsb2FkJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHJvb3RTY29wZSwgU0VSVkVSX1VSTCwgJHN0YXRlLCBjQWxlcnQsIHRvYXN0LCBVcGxvYWQpIHtcbiAgICB0aGlzLnBvc3QgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgcG9zdERhdGEudXJsLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBvYmopXG4gICAgICAgICAgICAgICAgICAgIHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHIuam9pbihcIiZcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YTogcG9zdERhdGEuZGF0YVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5hamF4KHJlcSwgcG9zdERhdGEpO1xuICAgIH07XG4gICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyBwb3N0RGF0YS51cmwsXG4gICAgICAgICAgICBwYXJhbXM6IHBvc3REYXRhLmRhdGFcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWpheChyZXEsIHBvc3REYXRhKTtcbiAgICB9O1xuICAgIHRoaXMuYWpheCA9IGZ1bmN0aW9uIChyZXEsIHBvc3REYXRhKSB7XG4gICAgICAgIC8vaWYocG9zdERhdGEudG9hc3QmJiRyb290U2NvcGUudG9hc3QuaGFzKXtcbiAgICAgICAgLy8gICAgYWxlcnQoJ+S4jeimgemHjeWkjeaTjeS9nCEnKTtcbiAgICAgICAgLy8gICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vfVxuICAgICAgICBpZiAocG9zdERhdGEudG9hc3QpIHtcbiAgICAgICAgICAgIHRvYXN0LmNyZWF0ZShwb3N0RGF0YS50b2FzdCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICAkaHR0cChyZXEpLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuY29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXNwb25zZS5kYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiByZXNwb25zZS5kYXRhLm1zZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZhaWxlZChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICBtc2c6ICfmnI3liqHnq6/plJnor6/vvIEnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9O1xuICAgIHRoaXMudXBsb2FkID0gZnVuY3Rpb24gKGZpbGUsIGRhdGEpIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICAvL+acjeWKoeerr+aOpeaUtlxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgLy/kuIrkvKDnmoTlkIzml7bluKbnmoTlj4LmlbBcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBmaWxlOiBmaWxlXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgICAgICAvLyB2YXIgcHJvZ3Jlc3NQZXJjZW50YWdlID0gcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKTtcbiAgICAgICAgICAgIC8vIGRlZmVycmVkLnJlc29sdmUocHJvZ3Jlc3NQZXJjZW50YWdlKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Byb2dyZXNzOiAnICsgcHJvZ3Jlc3NQZXJjZW50YWdlICsgJyUgJyArIGV2dC5jb25maWcuZGF0YS5maWxlLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn1cbl0pXG47XG4iLCJhcHAuc2VydmljZSgnYXJ0aWNsZVNlcnZpY2UnLCBbJ2FqYXgnLCAnJHEnLCBmdW5jdGlvbiAoYWpheCwgJHEpIHtcbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG59XSk7XG5cbiIsImFwcC5zZXJ2aWNlKCdjYXRlZ29yeVNlcnZpY2UnLCBbJ2FqYXgnLCAnJHEnLCBmdW5jdGlvbiAoYWpheCwgJHEpIHtcbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTYvMi80LlxuICovXG5hcHAuc2VydmljZSgncmVjb21tZW5kU2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZCdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2NBbGVydCcsIFtdKTtcbiAgICBhcHAucnVuKFsnJHJvb3RTY29wZScsICdjQWxlcnQnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgY0FsZXJ0LCB0b2FzdCkge1xuICAgICAgICAkcm9vdFNjb3BlLnRvYXN0ID0ge307XG4gICAgICAgIGNBbGVydC5kaXNtaXNzKCk7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ2RlbW8nKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxjYWxlcnQ+PC9jYWxlcnQ+PHRvYXN0PjwvdG9hc3Q+PGNjb25maXJtPjwvY2NvbmZpcm0+XCIpO1xuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCdjYWxlcnQnLCBbJyRyb290U2NvcGUnLCAnY0FsZXJ0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsIGNBbGVydCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPSdjQWxlcnQgY0FsZXJ0LXt7Y0FsZXJ0Lmhhc319Jz48ZGl2IGNsYXNzPSdjQWxlcnQtYm94Jz48ZGl2IGNsYXNzPSdjQWxlcnQtaW5uZXJib3gnPjxkaXYgY2xhc3M9J2NBbGVydC1jb250ZW50Jz48cCBjbGFzcz0nY0FsZXJ0LXRpdGxlJz7mj5DnpLo8L3A+PHAgY2xhc3M9J2NBbGVydC1mb250Jz57e2NBbGVydC50ZXh0fX08L3A+PGRpdiBjbGFzcz0nY0FsZXJ0LWJ0bi1ib3gnPjxwIGNsYXNzPSdjQWxlcnQtYnRuIGNBbGVydC1idG4tZmFpbGQnIG5nLWNsaWNrPSdkaXNtaXNzKCknIG5nLWlmPSdjQWxlcnQuY29tZmlybSc+5YWz6ZetPC9wPjxwIGNsYXNzPSdjQWxlcnQtYnRuIGNBbGVydC1idG4tdHJ1ZScgbmctY2xpY2s9J2RvKCknPuehruiupDwvcD48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRycykge1xuICAgICAgICAgICAgICAgIHNjb3BlLmRpc21pc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNBbGVydC5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzY29wZS5kbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRyb290U2NvcGUuY0FsZXJ0LmJhY2spICRyb290U2NvcGUuY0FsZXJ0LmJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgYXBwLmRpcmVjdGl2ZSgndG9hc3QnLCBbJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPSd0b2FzdCcgbmctaWY9J3RvYXN0Lmhhcyc+e3t0b2FzdC5tc2d9fTwvZGl2PlwiLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHJzKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgYXBwLnNlcnZpY2UoJ2NBbGVydCcsIFsnJHJvb3RTY29wZScsICd0b2FzdCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCB0b2FzdCkge1xuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIGlmKG9iai5jb21maXJtKXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5jb21maXJtID0gdHJ1ZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmNvbWZpcm0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmhhcyA9IHRydWU7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC50ZXh0ID0gb2JqLm1zZztcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmJhY2sgPSBvYmouYmFjaztcblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRpc21pc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydCA9IHt9O1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQudGV4dCA9ICcnO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuYmFjayA9ICcnO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuaGFzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgYXBwLnNlcnZpY2UoJ3RvYXN0JywgWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsICR0aW1lb3V0KSB7XG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgJHJvb3RTY29wZS50b2FzdC5tc2cgPSBtc2c7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0LmhhcyA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGlzbWlzcyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICRyb290U2NvcGU7XG4gICAgICAgICAgICBpZiAobXNnKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS50b2FzdC5tc2cgPSBtc2c7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0LmhhcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDUwMClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0LmhhcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSlcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2NhbnZlckltYWdlJywgW10pO1xuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZSA9IHtcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlU2hvdyA9IGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlLnVybCA9IHVybDtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2Uuc2hvdyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZUNsb3NlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2UudXJsID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlLnNob3cgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGNhbnZlcmltYWdlPjwvY2FudmVyaW1hZ2U+XCIpO1xuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCdjYW52ZXJpbWFnZScsIFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J2NhbnZlckltYWdlIGNhbnZlckltYWdlLXt7Y2FudmVySW1hZ2Uuc2hvd319JyBuZy1jbGljaz0nY2FudmVySW1hZ2VDbG9zZSgpJz48ZGl2PjxpbWcgbmctc3JjPSd7e2NhbnZlckltYWdlLnVybH19JyBhbHQ9Jyc+PC9kaXY+PC9kaXY+XCIsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cnMpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcblxufSkoKTsiLCJhcHAuY29udHJvbGxlcignYWRkQXJ0aWNsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsJ1NFUlZFUl9VUkwnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLFNFUlZFUl9VUkwpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2FydGljbGUvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5hcnRpY2xlLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuYXJ0aWNsZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICAkc2NvcGUudXBsb2FkSW1nID0gZnVuY3Rpb24oZmlsZSl7XG4gICAgICAgIGFqYXgudXBsb2FkKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gU0VSVkVSX1VSTCtcIi91cGxvYWQvXCIrcmVzdWx0LmZpbGVuYW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsJ2FydGljbGVTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsYXJ0aWNsZVNlcnZpY2UpIHtcblxuICAgIGFydGljbGVTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaWQsaW5kZXgpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2FydGljbGUvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigndXBkYXRlQXJ0aWNsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICdTRVJWRVJfVVJMJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIFNFUlZFUl9VUkwsICRzdGF0ZVBhcmFtcykge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy9hcnRpY2xlL3F1ZXJ5JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6ICRzdGF0ZVBhcmFtcy5pZFxuICAgICAgICB9LFxuICAgICAgICB0b2FzdDogXCLojrflj5bmlbDmja4uLi5cIlxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCfojrflj5bmiJDlip8hJyk7XG4gICAgICAgICRzY29wZS5hcnRpY2xlID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYXJ0aWNsZS51cGRhdGVUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL3VwZGF0ZScsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuYXJ0aWNsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuS/ruaUueS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+S/ruaUueaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5hcnRpY2xlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH07XG4gICAgJHNjb3BlLnVwbG9hZEltZyA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGFqYXgudXBsb2FkKGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLmltZ1BhdGggPSBTRVJWRVJfVVJMICsgXCIvdXBsb2FkL1wiICsgcmVzdWx0LmZpbGVuYW1lO1xuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkQ2F0ZWdvcnlDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeS9hZGQnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmNhdGVnb3J5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignbGlzdENhdGVnb3J5Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCdjYXRlZ29yeVNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCxjYXRlZ29yeVNlcnZpY2UpIHtcbiAgICBjYXRlZ29yeVNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgfSlcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbiAoaWQsIGluZGV4KSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnkvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FkZEZyaWVuZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2ZyaWVuZC9hZGQnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmRhdGEsXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmZyaWVuZCcpO1xuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgSG91IG9uIDE2LzMvMjkuXG4gKi9cbmFwcC5jb250cm9sbGVyKCdmcmllbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCAnY0FsZXJ0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSwgY0FsZXJ0KSB7XG4gICAgYWpheC5wb3N0KHtcbiAgICAgICAgdXJsOiAnL2ZyaWVuZC9xdWVyeScsXG4gICAgICAgIHRvYXN0OiBcImRvLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgJHNjb3BlLnJlc3VsdERhdGEgPSByZXN1bHQ7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ2VuZC4uIScpO1xuICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5mcmllbmQnKTtcbiAgICB9KVxuXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgIG1lczogJ+aYr+WQpuehruiupOWIoOmZpCEnLFxuICAgICAgICAgICAgY29tZmlybTogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvZnJpZW5kL2RlbCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHREYXRhLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbn1dKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBneHggb24gMjAxNi8xLzI4LlxuICovXG5hcHAuY29udHJvbGxlcignbWFuYWdlckNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxufV0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ2FkZFJlY29tbWVuZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZC9hZGQnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQucmVjb21tZW5kJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdyZWNvbW1lbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICdyZWNvbW1lbmRTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsIHJlY29tbWVuZFNlcnZpY2UpIHtcbiAgICByZWNvbW1lbmRTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZC9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkVXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3VzZXInLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC51c2VyJylcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3VzZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0KSB7XG4gICAgYWpheC5nZXQoe1xuICAgICAgICB1cmw6ICcvdXNlcidcbiAgICB9KS50aGVuKFxuICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICApXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaWQsaW5kZXgpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3VzZXJzL2RlbCcsXG4gICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgX2lkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignaW5mb3JtYXRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICdjQWxlcnQnLCd0b2FzdCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIGNBbGVydCx0b2FzdCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy9pbmZvcm1hdGlvbi9xdWVyeScsXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluS4rS4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAkc2NvcGUuaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfJyk7XG4gICAgfSlcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2luZm9ybWF0aW9uL3NldCcsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuaW5mbyxcbiAgICAgICAgICAgIHRvYXN0OiBcIuS/ruaUueS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIG1lczon5L+u5pS55oiQ5YqfJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3dlYkluZm9Db250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICdjQWxlcnQnLCd0b2FzdCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIGNBbGVydCx0b2FzdCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy93ZWJpbmZvL3F1ZXJ5JyxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5LitLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5pbmZvID0gcmVzdWx0O1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCfojrflj5bmiJDlip8nKTtcbiAgICB9KVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvd2ViaW5mby9zZXQnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmluZm8sXG4gICAgICAgICAgICB0b2FzdDogXCLkv67mlLnkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICBtZXM6J+S/ruaUueaIkOWKnydcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
