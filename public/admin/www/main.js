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
                if (response.data.code == 200 || 101) {
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


app.controller('addArticleController', ['$scope', 'ajax', 'toast', '$state', 'SERVER_URL', function ($scope, ajax, toast, $state, SERVER_URL) {
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
                $state.go('layout.article')
            }
        )
    };


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
    ajax.post({
        url: '/article/query',
        data: {
            objectId: $stateParams.id
        },
        toast: "获取数据..."
    }).then(function (result) {
        toast.dismiss('获取成功!');
        $scope.article = result[0];
        $scope.article.category = $scope.article.category.toString();
        var fileId = result[0].fileId;
        if(fileId){
            ajax.post({
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
    ajax.post({
        url: '/linkfriend/query',
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
            url = '/webinfo';
        } else {
            url = '/webinfo/updata';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInJvdXRlci5qcyIsImNvbnRyb2xsZXIvbGF5b3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvbG9naW5Db250cm9sbGVyLmpzIiwiZGlyZWN0aXZlL2NhdGVnb3J5TGlzdC5qcyIsImRpcmVjdGl2ZS9yZWNvbW1lbmRMaXN0LmpzIiwiZmlsdGVyL2NhdGVnb3J5RmlsdGVyLmpzIiwibW9kdWxlcy9jQWxlcnQuanMiLCJtb2R1bGVzL2NhbnZlckltYWdlLmpzIiwic2VydmljZS9Ub29sU2VydmljZS5qcyIsInNlcnZpY2UvYWpheFNlcnZpY2UuanMiLCJzZXJ2aWNlL2FydGljbGUuanMiLCJzZXJ2aWNlL2NhdGVnb3J5LmpzIiwic2VydmljZS9yZWNvbW1lbmQuanMiLCJjb250cm9sbGVyL2FydGNpbGUvYWRkQXJ0aWNsZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL2FydGNpbGUvYXJ0aWNsZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL2FydGNpbGUvdXBkYXRlQXJ0aWNsZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL2ZyaWVuZC9hZGQuanMiLCJjb250cm9sbGVyL2ZyaWVuZC9mcmllbmQuanMiLCJjb250cm9sbGVyL3VzZXIvYWRkVXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3VzZXIvdXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3dlYmluZm8vaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci93ZWJpbmZvL3dlYmluZm9Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci9tYW5hZ2VyL21hbmFnZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9yZWNvbW1lbmQvYWRkUmVjb21tZW5kQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcmVjb21tZW5kL3JlY29tbWVuZENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL2NhdGVnb3J5L2FkZENhdGVnb3J5Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvY2F0ZWdvcnkvbGlzdENhdGVnb3J5Q29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNC8xNS5cbiAqL1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCduZ0FuaW1hdGUnLCdjQWxlcnQnLCduZ0ZpbGVVcGxvYWQnXSk7XG5hcHAucnVuKFsnJHJvb3RTY29wZScsICckd2luZG93JywgJyRodHRwJywgJ2FqYXgnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHdpbmRvdywgJGh0dHAsIGFqYXgpIHtcbiAgICAkaHR0cC5kZWZhdWx0cy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xufV0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS80LzE1LlxuICovXG52YXIgY29uZmlnID0ge1xuICAgICdTRVJWRVJfVVJMJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCdcbn07XG5mb3IoaXRlbSBpbiBjb25maWcpe1xuICAgIGFwcC5jb25zdGFudChpdGVtLGNvbmZpZ1tpdGVtXSlcbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9sb2dpblwiKTtcbiAgICAvLyBOb3cgc2V0IHVwIHRoZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAvL+eZu+W9lVxuICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvbG9naW4uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsb2dpbkNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+W4g+WxgFxuICAgICAgICAuc3RhdGUoJ2xheW91dCcsIHtcbiAgICAgICAgICAgIHVybDogXCIvbGF5b3V0XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9sYXlvdXQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsYXlvdXRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/moI/nm65cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuY2F0ZWdvcnknLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2NhdGVnb3J5XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9jYXRlZ29yeS9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdENhdGVnb3J5Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGNhdGVnb3J5Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGRjYXRlZ29yeVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvY2F0ZWdvcnkvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkQ2F0ZWdvcnlDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/nrqHnkIblkZjnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQudXNlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvdXNlclwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvdXNlci9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidXNlckNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGR1c2VyJywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGR1c2VyLzp1c2VybmFtZS86b2JqZWN0SWRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3VzZXIvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkVXNlckNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+aWh+eroOeuoeeQhlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hcnRpY2xlJyx7XG4gICAgICAgICAgICB1cmw6IFwiL2FydGljbGVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2FydGljbGUvYXJ0aWNsZS5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFydGljbGVDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi9hZGRhcnRpY2xlXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9hcnRpY2xlL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZEFydGljbGVDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQudXBkYXRlYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi91cGRhdGVhcnRpY2xlLzppZFwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvYXJ0aWNsZS9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJ1cGRhdGVBcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5o6o6I2Q5L2N572u566h55CGXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnJlY29tbWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9yZWNvbW1lbmQvcmVjb21tZW5kLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicmVjb21tZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZHJlY29tbWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2FkZHJlY29tbWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9yZWNvbW1lbmQvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkUmVjb21tZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v572R56uZ5L+h5oGv6K6+572uXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LndlYmluZm8nLHtcbiAgICAgICAgICAgIHVybDogJy93ZWJpbmZvJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3dlYmluZm8vd2ViaW5mby5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcIndlYkluZm9Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/kuKrkurrkv6Hmga/orr7nva5cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuaW5mb3JtYXRpb24nLHtcbiAgICAgICAgICAgIHVybDogJy9pbmZvcm1hdGlvbicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC93ZWJpbmZvL2luZm9ybWF0aW9uLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiaW5mb3JtYXRpb25Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/lj4vmg4Xpk77mjqVcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuZnJpZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvZnJpZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2ZyaWVuZC9mcmllbmQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJmcmllbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkZnJpZW5kJyx7XG4gICAgICAgICAgICB1cmw6ICcvYWRkZnJpZW5kJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2ZyaWVuZC9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRGcmllbmRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbn1dKTtcbiIsImFwcC5jb250cm9sbGVyKCdsYXlvdXRDb250cm9sbGVyJywgWyckc2NvcGUnLCckd2luZG93JyxmdW5jdGlvbiAoJHNjb3BlLCR3aW5kb3cpIHtcbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRzdGF0ZScsICdhamF4JywgJ3RvYXN0JywgJyRodHRwJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBhamF4LCB0b2FzdCwgJGh0dHApIHtcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi55m75b2V5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfnmbvlvZXmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dCcpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmRpcmVjdGl2ZShcImNhdGVnb3J5bGlzdFwiLCBbJ2NhdGVnb3J5U2VydmljZScsZnVuY3Rpb24gKGNhdGVnb3J5U2VydmljZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnd3d3L2h0bWwvZGlyZWN0aXZlL2NhdGVnb3J5TGlzdC5odG1sJyxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHIpIHtcbiAgICAgICAgICAgIGNhdGVnb3J5U2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHNjb3BlLmxpc3QgPSByZXN1bHRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgfVxufV0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5kaXJlY3RpdmUoXCJyZWNvbW1lbmRsaXN0XCIsIFsncmVjb21tZW5kU2VydmljZScsZnVuY3Rpb24gKHJlY29tbWVuZFNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3d3dy9odG1sL2RpcmVjdGl2ZS9yZWNvbW1lbmRMaXN0Lmh0bWwnLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICBzY29wZToge1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cikge1xuICAgICAgICAgICAgcmVjb21tZW5kU2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHNjb3BlLmxpc3QgPSByZXN1bHRcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSxcbiAgICB9XG59XSk7XG4iLCJhcHAuZmlsdGVyKCdjYXRlZ29yeVR5cGUnLCBbJ2NhdGVnb3J5U2VydmljZScsICckaHR0cCcsIGZ1bmN0aW9uIChjYXRlZ29yeVNlcnZpY2UsICRodHRwKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNhdGVnb3J5VHlwZShjb2QpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxufV0pOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY0FsZXJ0JywgW10pO1xuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgJ2NBbGVydCcsICd0b2FzdCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBjQWxlcnQsIHRvYXN0KSB7XG4gICAgICAgICRyb290U2NvcGUudG9hc3QgPSB7fTtcbiAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygnZGVtbycpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGNhbGVydD48L2NhbGVydD48dG9hc3Q+PC90b2FzdD48Y2NvbmZpcm0+PC9jY29uZmlybT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbGVydCcsIFsnJHJvb3RTY29wZScsICdjQWxlcnQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgY0FsZXJ0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J2NBbGVydCBjQWxlcnQte3tjQWxlcnQuaGFzfX0nPjxkaXYgY2xhc3M9J2NBbGVydC1ib3gnPjxkaXYgY2xhc3M9J2NBbGVydC1pbm5lcmJveCc+PGRpdiBjbGFzcz0nY0FsZXJ0LWNvbnRlbnQnPjxwIGNsYXNzPSdjQWxlcnQtdGl0bGUnPuaPkOekujwvcD48cCBjbGFzcz0nY0FsZXJ0LWZvbnQnPnt7Y0FsZXJ0LnRleHR9fTwvcD48ZGl2IGNsYXNzPSdjQWxlcnQtYnRuLWJveCc+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi1mYWlsZCcgbmctY2xpY2s9J2Rpc21pc3MoKScgbmctaWY9J2NBbGVydC5jb21maXJtJz7lhbPpl608L3A+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi10cnVlJyBuZy1jbGljaz0nZG8oKSc+56Gu6K6kPC9wPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNjb3BlLmRvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS5jQWxlcnQuYmFjaykgJHJvb3RTY29wZS5jQWxlcnQuYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuZGlzbWlzcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCd0b2FzdCcsIFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J3RvYXN0JyBuZy1pZj0ndG9hc3QuaGFzJz57e3RvYXN0Lm1zZ319PC9kaXY+XCIsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cnMpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgnY0FsZXJ0JywgWyckcm9vdFNjb3BlJywgJ3RvYXN0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsIHRvYXN0KSB7XG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgaWYob2JqLmNvbWZpcm0pe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmNvbWZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuY29tZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuaGFzID0gdHJ1ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LnRleHQgPSBvYmoubXNnO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuYmFjayA9IG9iai5iYWNrO1xuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0ID0ge307XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC50ZXh0ID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5iYWNrID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5oYXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgndG9hc3QnLCBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1zZyA9IG1zZztcbiAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kaXNtaXNzID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgJHJvb3RTY29wZTtcbiAgICAgICAgICAgIGlmIChtc2cpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1zZyA9IG1zZztcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgNTAwKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKVxuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY2FudmVySW1hZ2UnLCBbXSk7XG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlID0ge1xuICAgICAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2VTaG93ID0gZnVuY3Rpb24odXJsKXtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2UudXJsID0gdXJsO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS5zaG93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlQ2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS51cmwgPSAnJztcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2Uuc2hvdyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8Y2FudmVyaW1hZ2U+PC9jYW52ZXJpbWFnZT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbnZlcmltYWdlJywgWyckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz0nY2FudmVySW1hZ2UgY2FudmVySW1hZ2Ute3tjYW52ZXJJbWFnZS5zaG93fX0nIG5nLWNsaWNrPSdjYW52ZXJJbWFnZUNsb3NlKCknPjxkaXY+PGltZyBuZy1zcmM9J3t7Y2FudmVySW1hZ2UudXJsfX0nIGFsdD0nJz48L2Rpdj48L2Rpdj5cIixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRycykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG59KSgpOyIsImFwcC5zZXJ2aWNlKCd0b29sU2VydmljZScsIGZ1bmN0aW9uICgpIHtcblxufSk7XG4iLCJhcHAuc2VydmljZSgnYWpheCcsIFsnJHEnLCAnJGh0dHAnLCAnJHJvb3RTY29wZScsICdTRVJWRVJfVVJMJywgJyRzdGF0ZScsICdjQWxlcnQnLCAndG9hc3QnLCAnVXBsb2FkJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHJvb3RTY29wZSwgU0VSVkVSX1VSTCwgJHN0YXRlLCBjQWxlcnQsIHRvYXN0LCBVcGxvYWQpIHtcbiAgICB0aGlzLnBvc3QgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgcG9zdERhdGEudXJsLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBvYmopXG4gICAgICAgICAgICAgICAgICAgIHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHIuam9pbihcIiZcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YTogcG9zdERhdGEuZGF0YVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5hamF4KHJlcSwgcG9zdERhdGEpO1xuICAgIH07XG4gICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyBwb3N0RGF0YS51cmwsXG4gICAgICAgICAgICBwYXJhbXM6IHBvc3REYXRhLmRhdGFcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWpheChyZXEsIHBvc3REYXRhKTtcbiAgICB9O1xuICAgIHRoaXMuYWpheCA9IGZ1bmN0aW9uIChyZXEsIHBvc3REYXRhKSB7XG4gICAgICAgIC8vaWYocG9zdERhdGEudG9hc3QmJiRyb290U2NvcGUudG9hc3QuaGFzKXtcbiAgICAgICAgLy8gICAgYWxlcnQoJ+S4jeimgemHjeWkjeaTjeS9nCEnKTtcbiAgICAgICAgLy8gICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vfVxuICAgICAgICBpZiAocG9zdERhdGEudG9hc3QpIHtcbiAgICAgICAgICAgIHRvYXN0LmNyZWF0ZShwb3N0RGF0YS50b2FzdCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICAkaHR0cChyZXEpLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuY29kZSA9PSAyMDAgfHwgMTAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzcG9uc2UuZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogcmVzcG9uc2UuZGF0YS5tc2dcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdsb2dpbicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZhaWxlZChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICBtc2c6ICfmnI3liqHnq6/plJnor6/vvIEnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9O1xuICAgIHRoaXMudXBsb2FkID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyAnL3VwbG9hZCcsXG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5LiK5Lyg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlcy5kYXRhKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0Vycm9yIHN0YXR1czogJyArIHJlc3Auc3RhdHVzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhldnQpO1xuICAgICAgICAgICAgLy8gdmFyIHByb2dyZXNzUGVyY2VudGFnZSA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XG4gICAgICAgICAgICAvLyBkZWZlcnJlZC5yZXNvbHZlKHByb2dyZXNzUGVyY2VudGFnZSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdwcm9ncmVzczogJyArIHByb2dyZXNzUGVyY2VudGFnZSArICclICcgKyBldnQuY29uZmlnLmRhdGEuZmlsZS5uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59XG5dKVxuO1xuIiwiYXBwLnNlcnZpY2UoJ2FydGljbGVTZXJ2aWNlJywgWydhamF4JywgJyRxJywgZnVuY3Rpb24gKGFqYXgsICRxKSB7XG4gICAgdGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgIGFqYXguZ2V0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCJhcHAuc2VydmljZSgnY2F0ZWdvcnlTZXJ2aWNlJywgWydhamF4JywgJyRxJywgZnVuY3Rpb24gKGFqYXgsICRxKSB7XG4gICAgdGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgIGFqYXguZ2V0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5nZXQoe1xuICAgICAgICAgICAgdXJsOiAnL2NhdGVnb3J5J1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTYvMi80LlxuICovXG5hcHAuc2VydmljZSgncmVjb21tZW5kU2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LmdldCh7XG4gICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCJhcHAuY29udHJvbGxlcignYWRkQXJ0aWNsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICdTRVJWRVJfVVJMJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSwgU0VSVkVSX1VSTCkge1xuICAgICRzY29wZS5hcnRpY2xlID0ge307XG5cbiAgICAkc2NvcGUudXBsb2FkSW1nID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgYWpheC51cGxvYWQoZmlsZSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUuYXJ0aWNsZS5maWxlSWQgPSByZXN1bHQuZmlsZUlkO1xuICAgICAgICAgICAgJHNjb3BlLmltZ1BhdGggPSByZXN1bHQuZmlsZVVybDtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZighJHNjb3BlLmFydGljbGUuZmlsZUlkKXtcbiAgICAgICAgICAgIGFsZXJ0KCfor7fkuIrkvKDlm77niYchJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2FydGljbGUnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmFydGljbGUsXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5hcnRpY2xlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH07XG5cblxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhcnRpY2xlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnYXJ0aWNsZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgYXJ0aWNsZVNlcnZpY2UpIHtcblxuICAgIGFydGljbGVTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCxmaWxlSWQpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL2RlbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0SWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAvL+WQjOaXtuWIoOmZpOWbvueJh1xuICAgICAgICAgICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy91cGxvYWQvZGVsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0SWQ6ZmlsZUlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgICAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3VwZGF0ZUFydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCAnU0VSVkVSX1VSTCcsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCBTRVJWRVJfVVJMLCAkc3RhdGVQYXJhbXMpIHtcbiAgICBhamF4LnBvc3Qoe1xuICAgICAgICB1cmw6ICcvYXJ0aWNsZS9xdWVyeScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG9iamVjdElkOiAkc3RhdGVQYXJhbXMuaWRcbiAgICAgICAgfSxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5pWw5o2uLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfIScpO1xuICAgICAgICAkc2NvcGUuYXJ0aWNsZSA9IHJlc3VsdFswXTtcbiAgICAgICAgJHNjb3BlLmFydGljbGUuY2F0ZWdvcnkgPSAkc2NvcGUuYXJ0aWNsZS5jYXRlZ29yeS50b1N0cmluZygpO1xuICAgICAgICB2YXIgZmlsZUlkID0gcmVzdWx0WzBdLmZpbGVJZDtcbiAgICAgICAgaWYoZmlsZUlkKXtcbiAgICAgICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3VwbG9hZC9xdWVyeScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RJZDogZmlsZUlkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b2FzdDogXCLojrflj5bmlbDmja4uLi5cIlxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gcmVzdWx0WzBdLnVybDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuYXJ0aWNsZSA9IHt9O1xuXG4gICAgJHNjb3BlLnVwbG9hZEltZyA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGFqYXgudXBsb2FkKGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLmFydGljbGUuZmlsZUlkID0gcmVzdWx0LmZpbGVJZDtcbiAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gcmVzdWx0LmZpbGVVcmw7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoISRzY29wZS5hcnRpY2xlLmZpbGVJZCl7XG4gICAgICAgICAgICBhbGVydCgn6K+35LiK5Lyg5Zu+54mHIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL3VwZGF0ZScsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuYXJ0aWNsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmFydGljbGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfTtcbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkRnJpZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvbGlua2ZyaWVuZCcsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuZGF0YSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuZnJpZW5kJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBneHggb24gMTYvMy8yOS5cbiAqL1xuYXBwLmNvbnRyb2xsZXIoJ2ZyaWVuZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICdjQWxlcnQnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCBjQWxlcnQpIHtcbiAgICBhamF4LnBvc3Qoe1xuICAgICAgICB1cmw6ICcvbGlua2ZyaWVuZC9xdWVyeScsXG4gICAgICAgIHRvYXN0OiBcImRvLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgJHNjb3BlLnJlc3VsdERhdGEgPSByZXN1bHQ7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ2VuZC4uIScpO1xuICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5mcmllbmQnKTtcbiAgICB9KVxuXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgIG1lczogJ+aYr+WQpuehruiupOWIoOmZpCEnLFxuICAgICAgICAgICAgY29tZmlybTogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvbGlua2ZyaWVuZC9kZWwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgICAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0RGF0YS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG59XSk7XG4iLCJhcHAuY29udHJvbGxlcignYWRkVXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICRzY29wZS5kYXRhID0ge1xuICAgICAgICB1c2VybmFtZTogJHN0YXRlUGFyYW1zLnVzZXJuYW1lLFxuICAgICAgICBvYmplY3RJZDogJHN0YXRlUGFyYW1zLm9iamVjdElkXG4gICAgfTtcblxuICAgICRzY29wZS5pc0Rpc2FibGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJHN0YXRlUGFyYW1zLm9iamVjdElkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH07XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciB1cmwgPSAkc3RhdGVQYXJhbXMub2JqZWN0SWQgPyAnL3VzZXIvdXBkYXRhJyA6ICcvdXNlci8nO1xuICAgICAgICB2YXIgZGF0YSA9ICRzdGF0ZVBhcmFtcy5vYmplY3RJZCA/IHtcbiAgICAgICAgICAgIG9iamVjdElkOiAkc3RhdGVQYXJhbXMub2JqZWN0SWQsXG4gICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgIH0gOiB7XG4gICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLmRhdGEudXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgIH07XG4gICAgICAgIHZhciBfdG9hc3QgPSAkc3RhdGVQYXJhbXMub2JqZWN0SWQgPyAn5L+u5pS55LitLi4uJyA6ICfmt7vliqDkuK0uLi4nO1xuICAgICAgICB2YXIgX2Rpc21pc3MgPSAkc3RhdGVQYXJhbXMub2JqZWN0SWQgPyAn5L+u5pS55oiQ5YqfIScgOiAn5re75Yqg5oiQ5YqfISc7XG5cbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHRvYXN0OiBfdG9hc3RcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKF9kaXNtaXNzKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LnVzZXInKVxuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigndXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QpIHtcbiAgICAvL+afpeivoueuoeeQhuWRmFxuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL3VzZXInLFxuICAgICAgICB0b2FzdDogXCLojrflj5bkuK0uLi5cIlxuICAgIH0pLnRoZW4oXG4gICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgICAgICB9XG4gICAgKTtcbiAgICAvL+WIoOmZpOeuoeeQhuWRmFxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpZCxpbmRleCl7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvdXNlci9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH07XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignaW5mb3JtYXRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICdjQWxlcnQnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCBjQWxlcnQsIHRvYXN0KSB7XG4gICAgJHNjb3BlLmlzVXBkYXRhID0gZmFsc2U7XG4gICAgLy/mn6Xor6LkuKrkurrkv6Hmga9cbiAgICBhamF4LmdldCh7XG4gICAgICAgIHVybDogJy9pbmZvcm1hdGlvbicsXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluS4rS4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgJHNjb3BlLmlzVXBkYXRhID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaW5mbyA9IHJlc3VsdFswXTtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfJyk7XG4gICAgfSk7XG5cblxuICAgIC8v6K6+572u5Liq5Lq65L+h5oGvXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9ICcnO1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoJHNjb3BlLmlzVXBkYXRhKSB7XG4gICAgICAgICAgICB1cmwgPSAnL2luZm9ybWF0aW9uJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVybCA9ICcvaW5mb3JtYXRpb24vdXBkYXRhJztcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuaW5mbyxcbiAgICAgICAgICAgIHRvYXN0OiBcIuiuvue9ruS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn6K6+572u5oiQ5YqfJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCd3ZWJJbmZvQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAnY0FsZXJ0JywndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCBjQWxlcnQsdG9hc3QpIHtcbiAgICAkc2NvcGUuaXNVcGRhdGEgPSBmYWxzZTtcbiAgICAvL+afpeivouS4quS6uuS/oeaBr1xuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL3dlYmluZm8nLFxuICAgICAgICB0b2FzdDogXCLojrflj5bkuK0uLi5cIlxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICRzY29wZS5pc1VwZGF0YSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmluZm8gPSByZXN1bHRbMF07XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ+iOt+WPluaIkOWKnycpO1xuICAgIH0pO1xuXG5cbiAgICAvL+iuvue9ruS4quS6uuS/oeaBr1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSAnJztcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKCRzY29wZS5pc1VwZGF0YSkge1xuICAgICAgICAgICAgdXJsID0gJy93ZWJpbmZvJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVybCA9ICcvd2ViaW5mby91cGRhdGEnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pbmZvLFxuICAgICAgICAgICAgdG9hc3Q6IFwi6K6+572u5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCforr7nva7miJDlip8nKTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGd4eCBvbiAyMDE2LzEvMjguXG4gKi9cbmFwcC5jb250cm9sbGVyKCdtYW5hZ2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG59XSk7XG4iLCJhcHAuY29udHJvbGxlcignYWRkUmVjb21tZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgICAgICBuaWNrbmFtZTogJHNjb3BlLm5pY2tuYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQucmVjb21tZW5kJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdyZWNvbW1lbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICdyZWNvbW1lbmRTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsIHJlY29tbWVuZFNlcnZpY2UpIHtcbiAgICByZWNvbW1lbmRTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZC9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkQ2F0ZWdvcnlDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeScsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJHNjb3BlLm5hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuY2F0ZWdvcnknKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdsaXN0Q2F0ZWdvcnlDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsJ2NhdGVnb3J5U2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LGNhdGVnb3J5U2VydmljZSkge1xuICAgIGNhdGVnb3J5U2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeS9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
