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
    //'SERVER_URL': 'https://gxx.leanapp.cn'
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
            url: "/adduser/:username/:objectId",
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
        //评论管理
        .state('layout.comments',{
            url: '/comments',
            templateUrl: "www/html/comments/comments.html",
            controller: "commentsController"
        })
        .state('layout.addComments',{
            url: '/addComments/:id',
            templateUrl: "www/html/comments/add.html",
            controller: "addCommentsController"
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
                console.log(result);
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

/**
 * Created by gxx on 16/7/25.
 */
app.filter('article_count', function () {
    return function categoryType(data) {
        if(data){
            return data.length
        }
        return 0
    }
});
app.filter('categoryType', ['categoryService', '$http', function (categoryService, $http) {
    return function categoryType(cod) {
        return
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
            if(obj.comfirm){
                $rootScope.cAlert.comfirm = true;
            }else{
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
        //console.log(req);
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
                if (response.data.code == (200 || 101)) {
                    defer.resolve(response.data.data);
                } else {
                    cAlert.create({
                        msg: response.data.msg
                    });
                    //$state.go('login')
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
    this.upload = function (file) {
        var deferred = $q.defer();
        Upload.upload({
            url: SERVER_URL + '/upload',
            file: file,
            toast: "上传中..."
        }).then(function (res) {
            deferred.resolve(res.data);
        }, function (resp) {
            //console.log('Error status: ' + resp.status);
        }, function (evt) {
            //console.log(evt);
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
        ajax.get({
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
        ajax.get({
            url: '/category'
        }).then(function (result) {
            defer.resolve(result);
        });
        return promise
    }
    this.list = function () {
        var defer = $q.defer();
        var promise = defer.promise;
        ajax.get({
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
        ajax.get({
            url: '/recommend'
        }).then(function (result) {
            defer.resolve(result);
        });
        return promise
    }
}]);


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
app.controller('articleController', ['$scope', 'ajax', 'toast', 'articleService', function ($scope, ajax, toast, articleService) {

    articleService.list().then(function (result) {
        $scope.list = result;
    });

    $scope.del = function (id, index,fileId) {
        ajax.post({
            url: '/article/del',
            data: {
                objectId: id
            },
            toast: "删除中..."
        }).then(
            function (result) {
                //同时删除图片
                ajax.post({
                    url: '/upload/del',
                    data: {
                        objectId:fileId
                    },
                    toast: "删除中..."
                }).then(
                    function (result) {
                        toast.dismiss('OK!');
                        $scope.list.splice(index, 1)
                    }
                )
            }
        )
    }
}]);
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
app.controller('addCategoryController', ['$scope', 'ajax', 'toast', '$state', function ($scope, ajax, toast, $state) {
    $scope.submit = function () {
        ajax.post({
            url: '/category',
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
                objectId: id
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
app.controller('commentsController', ['$scope', 'ajax', 'toast', function ($scope, ajax, toast) {
    //查询管理员
    ajax.get({
        url: '/comments',
        toast: "获取中..."
    }).then(
        function (result) {
            $scope.list = result;
        }
    );
    //删除管理员
    $scope.del = function(id,index){
        ajax.post({
            url: '/comments/del',
            data: {
                objectId: id
            },
            toast: "删除中..."
        }).then(
            function (result) {
                toast.dismiss('OK!');
                $scope.list.splice(index, 1);
            }
        )
    };

}]);
app.controller('addFriendController', ['$scope', 'ajax', 'toast', '$state', function ($scope, ajax, toast, $state) {
    $scope.submit = function () {
        ajax.post({
            url: '/linkfriend',
            data: $scope.data,
            toast: "添加中..."
        }).then(function (result) {
            toast.dismiss('添加成功!');
            $state.go('layout.friend');
        })
    }
}]);
/**
 * Created by gxx on 16/3/29.
 */
app.controller('friendController', ['$scope', 'ajax', 'toast', '$state', 'cAlert', function ($scope, ajax, toast, $state, cAlert) {
    ajax.get({
        url: '/linkfriend',
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
                    url: '/linkfriend/del',
                    data: {
                        objectId: id
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
            url: '/recommend',
            data: {
                name: $scope.name,
                nickname: $scope.nickname,
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
app.controller('addUserController', ['$scope', 'ajax', 'toast', '$state', '$stateParams', function ($scope, ajax, toast, $state, $stateParams) {

    $scope.data = {
        username: $stateParams.username,
        objectId: $stateParams.objectId
    };

    $scope.isDisabled = function () {
        if ($stateParams.objectId) {
            return true
        }
        return false
    };

    $scope.submit = function () {

        var url = $stateParams.objectId ? '/user/updata' : '/user/';
        var data = $stateParams.objectId ? {
            objectId: $stateParams.objectId,
            password: $scope.password
        } : {
            username: $scope.data.username,
            password: $scope.password
        };
        var _toast = $stateParams.objectId ? '修改中...' : '添加中...';
        var _dismiss = $stateParams.objectId ? '修改成功!' : '添加成功!';

        ajax.post({
            url: url,
            data: data,
            toast: _toast
        }).then(function (result) {
            toast.dismiss(_dismiss);
            $state.go('layout.user')
        })
    }
}]);
app.controller('userController', ['$scope', 'ajax', 'toast', function ($scope, ajax, toast) {
    //查询管理员
    ajax.get({
        url: '/user',
        toast: "获取中..."
    }).then(
        function (result) {
            $scope.list = result;
        }
    );
    //删除管理员
    $scope.del = function(id,index){
        ajax.post({
            url: '/user/del',
            data: {
                objectId: id
            },
            toast: "删除中..."
        }).then(
            function (result) {
                toast.dismiss('OK!');
                $scope.list.splice(index, 1);
            }
        )
    };

}]);
app.controller('informationController', ['$scope', 'ajax', 'cAlert', 'toast', function ($scope, ajax, cAlert, toast) {
    $scope.isUpdata = false;
    //查询个人信息
    ajax.get({
        url: '/information',
        toast: "获取中..."
    }).then(function (result) {
        if (result.length < 1) {
            $scope.isUpdata = true;
        }
        $scope.info = result[0];
        toast.dismiss('获取成功');
    });


    //设置个人信息
    $scope.submit = function () {
        var url = '';
        var data = '';
        if ($scope.isUpdata) {
            url = '/information';
        } else {
            url = '/information/updata';
        }
        console.log(url);
        ajax.post({
            url: url,
            data: $scope.info,
            toast: "设置中..."
        }).then(function (result) {
            toast.dismiss('设置成功');
        })
    }
}]);
app.controller('webInfoController', ['$scope', 'ajax', 'cAlert','toast', function ($scope, ajax, cAlert,toast) {
    $scope.isUpdata = false;
    //查询个人信息
    ajax.get({
        url: '/webinfo',
        toast: "获取中..."
    }).then(function (result) {
        if (!result.length) {
            $scope.isUpdata = true;
        }
        $scope.info = result[0];
        toast.dismiss('获取成功');
    });


    //设置个人信息
    $scope.submit = function () {
        var url = '';
        var data = '';
        if ($scope.isUpdata) {
            url = '/webinfo';
        } else {
            url = '/webinfo/updata';
        }
        ajax.post({
            url: url,
            data: $scope.info,
            toast: "设置中..."
        }).then(function (result) {
            toast.dismiss('设置成功');
        })
    }
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInJvdXRlci5qcyIsImNvbnRyb2xsZXIvbGF5b3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvbG9naW5Db250cm9sbGVyLmpzIiwiZGlyZWN0aXZlL2NhdGVnb3J5TGlzdC5qcyIsImRpcmVjdGl2ZS9yZWNvbW1lbmRMaXN0LmpzIiwiZmlsdGVyL2FydGljbGVfY291bnQuanMiLCJmaWx0ZXIvY2F0ZWdvcnlGaWx0ZXIuanMiLCJtb2R1bGVzL2NBbGVydC5qcyIsIm1vZHVsZXMvY2FudmVySW1hZ2UuanMiLCJzZXJ2aWNlL1Rvb2xTZXJ2aWNlLmpzIiwic2VydmljZS9hamF4U2VydmljZS5qcyIsInNlcnZpY2UvYXJ0aWNsZS5qcyIsInNlcnZpY2UvY2F0ZWdvcnkuanMiLCJzZXJ2aWNlL3JlY29tbWVuZC5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hZGRBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS91cGRhdGVBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvY2F0ZWdvcnkvYWRkQ2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9jYXRlZ29yeS9saXN0Q2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9jb21tZW50cy9hZGRDb21tZW50c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL2NvbW1lbnRzL2NvbW1lbnRzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvZnJpZW5kL2FkZC5qcyIsImNvbnRyb2xsZXIvZnJpZW5kL2ZyaWVuZC5qcyIsImNvbnRyb2xsZXIvbWFuYWdlci9tYW5hZ2VyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcmVjb21tZW5kL2FkZFJlY29tbWVuZENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3JlY29tbWVuZC9yZWNvbW1lbmRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci91c2VyL2FkZFVzZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci91c2VyL3VzZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci93ZWJpbmZvL2luZm9ybWF0aW9uQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvd2ViaW5mby93ZWJpbmZvQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS80LzE1LlxuICovXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJywgJ25nU3RvcmFnZScsJ25nQW5pbWF0ZScsJ2NBbGVydCcsJ25nRmlsZVVwbG9hZCddKTtcbmFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyR3aW5kb3cnLCAnJGh0dHAnLCAnYWpheCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkd2luZG93LCAkaHR0cCwgYWpheCkge1xuICAgICRodHRwLmRlZmF1bHRzLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzQvMTUuXG4gKi9cbnZhciBjb25maWcgPSB7XG4gICAgJ1NFUlZFUl9VUkwnOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJ1xuICAgIC8vJ1NFUlZFUl9VUkwnOiAnaHR0cHM6Ly9neHgubGVhbmFwcC5jbidcbn07XG5mb3IoaXRlbSBpbiBjb25maWcpe1xuICAgIGFwcC5jb25zdGFudChpdGVtLGNvbmZpZ1tpdGVtXSlcbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9sb2dpblwiKTtcbiAgICAvLyBOb3cgc2V0IHVwIHRoZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAvL+eZu+W9lVxuICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvbG9naW4uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsb2dpbkNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+W4g+WxgFxuICAgICAgICAuc3RhdGUoJ2xheW91dCcsIHtcbiAgICAgICAgICAgIHVybDogXCIvbGF5b3V0XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9sYXlvdXQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsYXlvdXRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/moI/nm65cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuY2F0ZWdvcnknLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2NhdGVnb3J5XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9jYXRlZ29yeS9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdENhdGVnb3J5Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGNhdGVnb3J5Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGRjYXRlZ29yeVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvY2F0ZWdvcnkvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkQ2F0ZWdvcnlDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/nrqHnkIblkZjnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQudXNlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvdXNlclwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvdXNlci9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidXNlckNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGR1c2VyJywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGR1c2VyLzp1c2VybmFtZS86b2JqZWN0SWRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3VzZXIvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkVXNlckNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+aWh+eroOeuoeeQhlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hcnRpY2xlJyx7XG4gICAgICAgICAgICB1cmw6IFwiL2FydGljbGVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2FydGljbGUvYXJ0aWNsZS5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFydGljbGVDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi9hZGRhcnRpY2xlXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9hcnRpY2xlL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZEFydGljbGVDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQudXBkYXRlYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi91cGRhdGVhcnRpY2xlLzppZFwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvYXJ0aWNsZS9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJ1cGRhdGVBcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5o6o6I2Q5L2N572u566h55CGXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnJlY29tbWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9yZWNvbW1lbmQvcmVjb21tZW5kLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicmVjb21tZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZHJlY29tbWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2FkZHJlY29tbWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9yZWNvbW1lbmQvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkUmVjb21tZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v572R56uZ5L+h5oGv6K6+572uXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LndlYmluZm8nLHtcbiAgICAgICAgICAgIHVybDogJy93ZWJpbmZvJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3dlYmluZm8vd2ViaW5mby5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcIndlYkluZm9Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/kuKrkurrkv6Hmga/orr7nva5cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuaW5mb3JtYXRpb24nLHtcbiAgICAgICAgICAgIHVybDogJy9pbmZvcm1hdGlvbicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC93ZWJpbmZvL2luZm9ybWF0aW9uLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiaW5mb3JtYXRpb25Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/lj4vmg4Xpk77mjqVcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuZnJpZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvZnJpZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2ZyaWVuZC9mcmllbmQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJmcmllbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkZnJpZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvYWRkZnJpZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2ZyaWVuZC9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRGcmllbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/or4TorrrnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuY29tbWVudHMnLHtcbiAgICAgICAgICAgIHVybDogJy9jb21tZW50cycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9jb21tZW50cy9jb21tZW50cy5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImNvbW1lbnRzQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZENvbW1lbnRzJyx7XG4gICAgICAgICAgICB1cmw6ICcvYWRkQ29tbWVudHMvOmlkJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2NvbW1lbnRzL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZENvbW1lbnRzQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG59XSk7XG4iLCJhcHAuY29udHJvbGxlcignbGF5b3V0Q29udHJvbGxlcicsIFsnJHNjb3BlJywnJHdpbmRvdycsZnVuY3Rpb24gKCRzY29wZSwkd2luZG93KSB7XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckc3RhdGUnLCAnYWpheCcsICd0b2FzdCcsICckaHR0cCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgYWpheCwgdG9hc3QsICRodHRwKSB7XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIueZu+W9leS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn55m75b2V5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQnKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5kaXJlY3RpdmUoXCJjYXRlZ29yeWxpc3RcIiwgWydjYXRlZ29yeVNlcnZpY2UnLGZ1bmN0aW9uIChjYXRlZ29yeVNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3d3dy9odG1sL2RpcmVjdGl2ZS9jYXRlZ29yeUxpc3QuaHRtbCcsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRyKSB7XG4gICAgICAgICAgICBjYXRlZ29yeVNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzY29wZS5saXN0ID0gcmVzdWx0XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgIH1cbn1dKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS81LzE1LlxuICovXG5hcHAuZGlyZWN0aXZlKFwicmVjb21tZW5kbGlzdFwiLCBbJ3JlY29tbWVuZFNlcnZpY2UnLGZ1bmN0aW9uIChyZWNvbW1lbmRTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd3d3cvaHRtbC9kaXJlY3RpdmUvcmVjb21tZW5kTGlzdC5odG1sJyxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHIpIHtcbiAgICAgICAgICAgIHJlY29tbWVuZFNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzY29wZS5saXN0ID0gcmVzdWx0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0sXG4gICAgfVxufV0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGd4eCBvbiAxNi83LzI1LlxuICovXG5hcHAuZmlsdGVyKCdhcnRpY2xlX2NvdW50JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBjYXRlZ29yeVR5cGUoZGF0YSkge1xuICAgICAgICBpZihkYXRhKXtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmxlbmd0aFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwXG4gICAgfVxufSk7IiwiYXBwLmZpbHRlcignY2F0ZWdvcnlUeXBlJywgWydjYXRlZ29yeVNlcnZpY2UnLCAnJGh0dHAnLCBmdW5jdGlvbiAoY2F0ZWdvcnlTZXJ2aWNlLCAkaHR0cCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBjYXRlZ29yeVR5cGUoY29kKSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cbn1dKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY0FsZXJ0JywgW10pO1xuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgJ2NBbGVydCcsICd0b2FzdCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBjQWxlcnQsIHRvYXN0KSB7XG4gICAgICAgICRyb290U2NvcGUudG9hc3QgPSB7fTtcbiAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygnZGVtbycpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGNhbGVydD48L2NhbGVydD48dG9hc3Q+PC90b2FzdD48Y2NvbmZpcm0+PC9jY29uZmlybT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbGVydCcsIFsnJHJvb3RTY29wZScsICdjQWxlcnQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgY0FsZXJ0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J2NBbGVydCBjQWxlcnQte3tjQWxlcnQuaGFzfX0nPjxkaXYgY2xhc3M9J2NBbGVydC1ib3gnPjxkaXYgY2xhc3M9J2NBbGVydC1pbm5lcmJveCc+PGRpdiBjbGFzcz0nY0FsZXJ0LWNvbnRlbnQnPjxwIGNsYXNzPSdjQWxlcnQtdGl0bGUnPuaPkOekujwvcD48cCBjbGFzcz0nY0FsZXJ0LWZvbnQnPnt7Y0FsZXJ0LnRleHR9fTwvcD48ZGl2IGNsYXNzPSdjQWxlcnQtYnRuLWJveCc+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi1mYWlsZCcgbmctY2xpY2s9J2Rpc21pc3MoKScgbmctaWY9J2NBbGVydC5jb21maXJtJz7lhbPpl608L3A+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi10cnVlJyBuZy1jbGljaz0nZG8oKSc+56Gu6K6kPC9wPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNjb3BlLmRvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS5jQWxlcnQuYmFjaykgJHJvb3RTY29wZS5jQWxlcnQuYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuZGlzbWlzcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCd0b2FzdCcsIFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J3RvYXN0JyBuZy1pZj0ndG9hc3QuaGFzJz57e3RvYXN0Lm1zZ319PC9kaXY+XCIsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cnMpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgnY0FsZXJ0JywgWyckcm9vdFNjb3BlJywgJ3RvYXN0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsIHRvYXN0KSB7XG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgaWYob2JqLmNvbWZpcm0pe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmNvbWZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuY29tZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuaGFzID0gdHJ1ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LnRleHQgPSBvYmoubXNnO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuYmFjayA9IG9iai5iYWNrO1xuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0ID0ge307XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC50ZXh0ID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5iYWNrID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5oYXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgndG9hc3QnLCBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1zZyA9IG1zZztcbiAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kaXNtaXNzID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgJHJvb3RTY29wZTtcbiAgICAgICAgICAgIGlmIChtc2cpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1zZyA9IG1zZztcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgNTAwKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKVxuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY2FudmVySW1hZ2UnLCBbXSk7XG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlID0ge1xuICAgICAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2VTaG93ID0gZnVuY3Rpb24odXJsKXtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2UudXJsID0gdXJsO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS5zaG93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlQ2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS51cmwgPSAnJztcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2Uuc2hvdyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8Y2FudmVyaW1hZ2U+PC9jYW52ZXJpbWFnZT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbnZlcmltYWdlJywgWyckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz0nY2FudmVySW1hZ2UgY2FudmVySW1hZ2Ute3tjYW52ZXJJbWFnZS5zaG93fX0nIG5nLWNsaWNrPSdjYW52ZXJJbWFnZUNsb3NlKCknPjxkaXY+PGltZyBuZy1zcmM9J3t7Y2FudmVySW1hZ2UudXJsfX0nIGFsdD0nJz48L2Rpdj48L2Rpdj5cIixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRycykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG59KSgpOyIsImFwcC5zZXJ2aWNlKCd0b29sU2VydmljZScsIGZ1bmN0aW9uICgpIHtcblxufSk7XG4iLCJhcHAuc2VydmljZSgnYWpheCcsIFsnJHEnLCAnJGh0dHAnLCAnJHJvb3RTY29wZScsICdTRVJWRVJfVVJMJywgJyRzdGF0ZScsICdjQWxlcnQnLCAndG9hc3QnLCAnVXBsb2FkJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHJvb3RTY29wZSwgU0VSVkVSX1VSTCwgJHN0YXRlLCBjQWxlcnQsIHRvYXN0LCBVcGxvYWQpIHtcbiAgICB0aGlzLnBvc3QgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgcG9zdERhdGEudXJsLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBvYmopXG4gICAgICAgICAgICAgICAgICAgIHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHIuam9pbihcIiZcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YTogcG9zdERhdGEuZGF0YVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5hamF4KHJlcSwgcG9zdERhdGEpO1xuICAgIH07XG4gICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyBwb3N0RGF0YS51cmwsXG4gICAgICAgICAgICBwYXJhbXM6IHBvc3REYXRhLmRhdGFcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWpheChyZXEsIHBvc3REYXRhKTtcbiAgICB9O1xuICAgIHRoaXMuYWpheCA9IGZ1bmN0aW9uIChyZXEsIHBvc3REYXRhKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2cocmVxKTtcbiAgICAgICAgLy9pZihwb3N0RGF0YS50b2FzdCYmJHJvb3RTY29wZS50b2FzdC5oYXMpe1xuICAgICAgICAvLyAgICBhbGVydCgn5LiN6KaB6YeN5aSN5pON5L2cIScpO1xuICAgICAgICAvLyAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgLy99XG4gICAgICAgIGlmIChwb3N0RGF0YS50b2FzdCkge1xuICAgICAgICAgICAgdG9hc3QuY3JlYXRlKHBvc3REYXRhLnRvYXN0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgICRodHRwKHJlcSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5jb2RlID09ICgyMDAgfHwgMTAxKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3BvbnNlLmRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2c6IHJlc3BvbnNlLmRhdGEubXNnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnbG9naW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiBmYWlsZWQocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbXNnOiAn5pyN5Yqh56uv6ZSZ6K+v77yBJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfTtcbiAgICB0aGlzLnVwbG9hZCA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuS4iuS8oOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXMuZGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXZ0KTtcbiAgICAgICAgICAgIC8vIHZhciBwcm9ncmVzc1BlcmNlbnRhZ2UgPSBwYXJzZUludCgxMDAuMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWwpO1xuICAgICAgICAgICAgLy8gZGVmZXJyZWQucmVzb2x2ZShwcm9ncmVzc1BlcmNlbnRhZ2UpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncHJvZ3Jlc3M6ICcgKyBwcm9ncmVzc1BlcmNlbnRhZ2UgKyAnJSAnICsgZXZ0LmNvbmZpZy5kYXRhLmZpbGUubmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufVxuXSlcbjtcbiIsImFwcC5zZXJ2aWNlKCdhcnRpY2xlU2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LmdldCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiYXBwLnNlcnZpY2UoJ2NhdGVnb3J5U2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LmdldCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnknXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG4gICAgdGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgIGFqYXguZ2V0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDE2LzIvNC5cbiAqL1xuYXBwLnNlcnZpY2UoJ3JlY29tbWVuZFNlcnZpY2UnLCBbJ2FqYXgnLCAnJHEnLCBmdW5jdGlvbiAoYWpheCwgJHEpIHtcbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5nZXQoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZCdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiYXBwLmNvbnRyb2xsZXIoJ2FkZEFydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCAnU0VSVkVSX1VSTCcsICckaHR0cCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIFNFUlZFUl9VUkwsICRodHRwKSB7XG4gICAgJHNjb3BlLmFydGljbGUgPSB7fTtcblxuICAgICRzY29wZS51cGxvYWRJbWcgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBhamF4LnVwbG9hZChmaWxlKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5hcnRpY2xlLmZpbGVJZCA9IHJlc3VsdC5maWxlSWQ7XG4gICAgICAgICAgICAkc2NvcGUuaW1nUGF0aCA9IHJlc3VsdC5maWxlVXJsO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKCEkc2NvcGUuYXJ0aWNsZS5maWxlSWQpe1xuICAgICAgICAgICAgYWxlcnQoJ+ivt+S4iuS8oOWbvueJhyEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZScsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuYXJ0aWNsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgIC8vJHNjb3BlLmxpbmsocmVzdWx0WzBdLm9iamVjdElkKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5hcnRpY2xlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH07XG5cblxuICAgIC8v55m+5bqm6ZO+5o6l5o+Q5LqkXG4gICAgJHNjb3BlLmxpbmsgPSBmdW5jdGlvbihhKXtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2RhdGEuenouYmFpZHUuY29tL3VybHM/c2l0ZT13d3cuZ3VpeGlhb3hpYW8uY24mdG9rZW49djE0Mmd2NEpiekZLbmZneCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHsgJ2h0dHAnOiAnLy9ndWl4aWFveGlhby5jbi9wb3N0LycrYX1cbiAgICAgICAgfVxuICAgICAgICAkaHR0cChyZXEpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+eZvuW6pumTvuaOpeaPkOS6pOaIkOWKnyEnKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+eZvuW6pumTvuaOpeaPkOS6pOWksei0pSEnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICdhcnRpY2xlU2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCBhcnRpY2xlU2VydmljZSkge1xuXG4gICAgYXJ0aWNsZVNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICB9KTtcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbiAoaWQsIGluZGV4LGZpbGVJZCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2FydGljbGUvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvYmplY3RJZDogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIC8v5ZCM5pe25Yig6Zmk5Zu+54mHXG4gICAgICAgICAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3VwbG9hZC9kZWwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RJZDpmaWxlSWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0LnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigndXBkYXRlQXJ0aWNsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICdTRVJWRVJfVVJMJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIFNFUlZFUl9VUkwsICRzdGF0ZVBhcmFtcykge1xuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL2FydGljbGUvcXVlcnknLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBvYmplY3RJZDogJHN0YXRlUGFyYW1zLmlkXG4gICAgICAgIH0sXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluaVsOaNri4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ+iOt+WPluaIkOWKnyEnKTtcbiAgICAgICAgJHNjb3BlLmFydGljbGUgPSByZXN1bHQ7XG4gICAgICAgICRzY29wZS5hcnRpY2xlLmNhdGVnb3J5ID0gJHNjb3BlLmFydGljbGUuY2F0ZWdvcnkudG9TdHJpbmcoKTtcbiAgICAgICAgJHNjb3BlLmFydGljbGUuY29udGVudCA9IGRlY29kZVVSSUNvbXBvbmVudCgkc2NvcGUuYXJ0aWNsZS5jb250ZW50KTtcbiAgICAgICAgdmFyIGZpbGVJZCA9IHJlc3VsdC5maWxlSWQ7XG4gICAgICAgIGlmKGZpbGVJZCl7XG4gICAgICAgICAgICBhamF4LmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3VwbG9hZC9xdWVyeScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RJZDogZmlsZUlkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b2FzdDogXCLojrflj5bmlbDmja4uLi5cIlxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gcmVzdWx0WzBdLnVybDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuYXJ0aWNsZSA9IHt9O1xuXG4gICAgJHNjb3BlLnVwbG9hZEltZyA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGFqYXgudXBsb2FkKGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLmFydGljbGUuZmlsZUlkID0gcmVzdWx0LmZpbGVJZDtcbiAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gcmVzdWx0LmZpbGVVcmw7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoISRzY29wZS5hcnRpY2xlLmZpbGVJZCl7XG4gICAgICAgICAgICBhbGVydCgn6K+35LiK5Lyg5Zu+54mHIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL3VwZGF0ZScsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuYXJ0aWNsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmFydGljbGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfTtcbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkQ2F0ZWdvcnlDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeScsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJHNjb3BlLm5hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuY2F0ZWdvcnknKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdsaXN0Q2F0ZWdvcnlDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsJ2NhdGVnb3J5U2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LGNhdGVnb3J5U2VydmljZSkge1xuICAgIGNhdGVnb3J5U2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeS9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhZGRDb21tZW50c0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgIGlmICgkc3RhdGVQYXJhbXMuaWQpIHtcbiAgICAgICAgYWpheC5nZXQoe1xuICAgICAgICAgICAgdXJsOiAnL2NvbW1lbnRzL3F1ZXJ5JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvYmplY3RJZDokc3RhdGVQYXJhbXMuaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5p+l6K+i5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmn6Xor6LmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbW1lbnRzID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9ICRzdGF0ZVBhcmFtcy5pZD8nL2NvbW1lbnRzL3VwZGF0YSc6Jy9jb21tZW50cyc7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5jb21tZW50cyxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmNvbW1lbnRzJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdjb21tZW50c0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QpIHtcbiAgICAvL+afpeivoueuoeeQhuWRmFxuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL2NvbW1lbnRzJyxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5LitLi4uXCJcbiAgICB9KS50aGVuKFxuICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICAgICAgfVxuICAgICk7XG4gICAgLy/liKDpmaTnrqHnkIblkZhcbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaWQsaW5kZXgpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2NvbW1lbnRzL2RlbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0SWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfTtcblxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhZGRGcmllbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9saW5rZnJpZW5kJyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5kYXRhLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5mcmllbmQnKTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGd4eCBvbiAxNi8zLzI5LlxuICovXG5hcHAuY29udHJvbGxlcignZnJpZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgJ2NBbGVydCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIGNBbGVydCkge1xuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL2xpbmtmcmllbmQnLFxuICAgICAgICB0b2FzdDogXCJkby4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICRzY29wZS5yZXN1bHREYXRhID0gcmVzdWx0O1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCdlbmQuLiEnKTtcbiAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuZnJpZW5kJyk7XG4gICAgfSlcblxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbiAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICBtZXM6ICfmmK/lkKbnoa7orqTliKDpmaQhJyxcbiAgICAgICAgICAgIGNvbWZpcm06IHRydWUsXG4gICAgICAgICAgICBiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2xpbmtmcmllbmQvZGVsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0SWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgICAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0RGF0YS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG59XSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZ3h4IG9uIDIwMTYvMS8yOC5cbiAqL1xuYXBwLmNvbnRyb2xsZXIoJ21hbmFnZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbn1dKTtcbiIsImFwcC5jb250cm9sbGVyKCdhZGRSZWNvbW1lbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgICAgIG5pY2tuYW1lOiAkc2NvcGUubmlja25hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5yZWNvbW1lbmQnKTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3JlY29tbWVuZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJ3JlY29tbWVuZFNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgcmVjb21tZW5kU2VydmljZSkge1xuICAgIHJlY29tbWVuZFNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgfSlcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbiAoaWQsIGluZGV4KSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kL2RlbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ09LIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5saXN0LnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhZGRVc2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsICRzdGF0ZVBhcmFtcykge1xuXG4gICAgJHNjb3BlLmRhdGEgPSB7XG4gICAgICAgIHVzZXJuYW1lOiAkc3RhdGVQYXJhbXMudXNlcm5hbWUsXG4gICAgICAgIG9iamVjdElkOiAkc3RhdGVQYXJhbXMub2JqZWN0SWRcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzRGlzYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkc3RhdGVQYXJhbXMub2JqZWN0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfTtcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHVybCA9ICRzdGF0ZVBhcmFtcy5vYmplY3RJZCA/ICcvdXNlci91cGRhdGEnIDogJy91c2VyLyc7XG4gICAgICAgIHZhciBkYXRhID0gJHN0YXRlUGFyYW1zLm9iamVjdElkID8ge1xuICAgICAgICAgICAgb2JqZWN0SWQ6ICRzdGF0ZVBhcmFtcy5vYmplY3RJZCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgfSA6IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiAkc2NvcGUuZGF0YS51c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIF90b2FzdCA9ICRzdGF0ZVBhcmFtcy5vYmplY3RJZCA/ICfkv67mlLnkuK0uLi4nIDogJ+a3u+WKoOS4rS4uLic7XG4gICAgICAgIHZhciBfZGlzbWlzcyA9ICRzdGF0ZVBhcmFtcy5vYmplY3RJZCA/ICfkv67mlLnmiJDlip8hJyA6ICfmt7vliqDmiJDlip8hJztcblxuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgdG9hc3Q6IF90b2FzdFxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoX2Rpc21pc3MpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQudXNlcicpXG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCd1c2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCkge1xuICAgIC8v5p+l6K+i566h55CG5ZGYXG4gICAgYWpheC5nZXQoe1xuICAgICAgICB1cmw6ICcvdXNlcicsXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluS4rS4uLlwiXG4gICAgfSkudGhlbihcbiAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICApO1xuICAgIC8v5Yig6Zmk566h55CG5ZGYXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uKGlkLGluZGV4KXtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy91c2VyL2RlbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0SWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfTtcblxufV0pOyIsImFwcC5jb250cm9sbGVyKCdpbmZvcm1hdGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ2NBbGVydCcsICd0b2FzdCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIGNBbGVydCwgdG9hc3QpIHtcbiAgICAkc2NvcGUuaXNVcGRhdGEgPSBmYWxzZTtcbiAgICAvL+afpeivouS4quS6uuS/oeaBr1xuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL2luZm9ybWF0aW9uJyxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5LitLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAkc2NvcGUuaXNVcGRhdGEgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5pbmZvID0gcmVzdWx0WzBdO1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCfojrflj5bmiJDlip8nKTtcbiAgICB9KTtcblxuXG4gICAgLy/orr7nva7kuKrkurrkv6Hmga9cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdXJsID0gJyc7XG4gICAgICAgIHZhciBkYXRhID0gJyc7XG4gICAgICAgIGlmICgkc2NvcGUuaXNVcGRhdGEpIHtcbiAgICAgICAgICAgIHVybCA9ICcvaW5mb3JtYXRpb24nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsID0gJy9pbmZvcm1hdGlvbi91cGRhdGEnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pbmZvLFxuICAgICAgICAgICAgdG9hc3Q6IFwi6K6+572u5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCforr7nva7miJDlip8nKTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3dlYkluZm9Db250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICdjQWxlcnQnLCd0b2FzdCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIGNBbGVydCx0b2FzdCkge1xuICAgICRzY29wZS5pc1VwZGF0YSA9IGZhbHNlO1xuICAgIC8v5p+l6K+i5Liq5Lq65L+h5oGvXG4gICAgYWpheC5nZXQoe1xuICAgICAgICB1cmw6ICcvd2ViaW5mbycsXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluS4rS4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmICghcmVzdWx0Lmxlbmd0aCkge1xuICAgICAgICAgICAgJHNjb3BlLmlzVXBkYXRhID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaW5mbyA9IHJlc3VsdFswXTtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfJyk7XG4gICAgfSk7XG5cblxuICAgIC8v6K6+572u5Liq5Lq65L+h5oGvXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9ICcnO1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoJHNjb3BlLmlzVXBkYXRhKSB7XG4gICAgICAgICAgICB1cmwgPSAnL3dlYmluZm8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXJsID0gJy93ZWJpbmZvL3VwZGF0YSc7XG4gICAgICAgIH1cbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmluZm8sXG4gICAgICAgICAgICB0b2FzdDogXCLorr7nva7kuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+iuvue9ruaIkOWKnycpO1xuICAgICAgICB9KVxuICAgIH1cbn1dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
