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

app.filter('categoryType', ['categoryService', '$http', function (categoryService, $http) {
    return function categoryType(cod) {
        return
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
        console.log(req);
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
        $scope.article = result;
        $scope.article.category = $scope.article.category.toString();
        $scope.article.content = decodeURIComponent($scope.article.content);
        var fileId = result.fileId;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInJvdXRlci5qcyIsImZpbHRlci9jYXRlZ29yeUZpbHRlci5qcyIsImRpcmVjdGl2ZS9jYXRlZ29yeUxpc3QuanMiLCJkaXJlY3RpdmUvcmVjb21tZW5kTGlzdC5qcyIsImNvbnRyb2xsZXIvbGF5b3V0Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvbG9naW5Db250cm9sbGVyLmpzIiwibW9kdWxlcy9jQWxlcnQuanMiLCJtb2R1bGVzL2NhbnZlckltYWdlLmpzIiwic2VydmljZS9Ub29sU2VydmljZS5qcyIsInNlcnZpY2UvYWpheFNlcnZpY2UuanMiLCJzZXJ2aWNlL2FydGljbGUuanMiLCJzZXJ2aWNlL2NhdGVnb3J5LmpzIiwic2VydmljZS9yZWNvbW1lbmQuanMiLCJjb250cm9sbGVyL2NhdGVnb3J5L2FkZENhdGVnb3J5Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvY2F0ZWdvcnkvbGlzdENhdGVnb3J5Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvZnJpZW5kL2FkZC5qcyIsImNvbnRyb2xsZXIvZnJpZW5kL2ZyaWVuZC5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hZGRBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS91cGRhdGVBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvbWFuYWdlci9tYW5hZ2VyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcmVjb21tZW5kL2FkZFJlY29tbWVuZENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3JlY29tbWVuZC9yZWNvbW1lbmRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci91c2VyL2FkZFVzZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci91c2VyL3VzZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci93ZWJpbmZvL2luZm9ybWF0aW9uQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvd2ViaW5mby93ZWJpbmZvQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzQvMTUuXG4gKi9cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInLCAnbmdTdG9yYWdlJywnbmdBbmltYXRlJywnY0FsZXJ0JywnbmdGaWxlVXBsb2FkJ10pO1xuYXBwLnJ1bihbJyRyb290U2NvcGUnLCAnJHdpbmRvdycsICckaHR0cCcsICdhamF4JywgZnVuY3Rpb24gKCRyb290U2NvcGUsICR3aW5kb3csICRodHRwLCBhamF4KSB7XG4gICAgJGh0dHAuZGVmYXVsdHMud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbn1dKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNC8xNS5cbiAqL1xudmFyIGNvbmZpZyA9IHtcbiAgICAnU0VSVkVSX1VSTCc6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnXG59O1xuZm9yKGl0ZW0gaW4gY29uZmlnKXtcbiAgICBhcHAuY29uc3RhbnQoaXRlbSxjb25maWdbaXRlbV0pXG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDExLzUvMTUuXG4gKi9cbmFwcC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvbG9naW5cIik7XG4gICAgLy8gTm93IHNldCB1cCB0aGUgc3RhdGVzXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLy/nmbvlvZVcbiAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2xvZ2luLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibG9naW5Db250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/luIPlsYBcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2xheW91dFwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvbGF5b3V0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGF5b3V0Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5qCP55uuXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmNhdGVnb3J5Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9jYXRlZ29yeVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvY2F0ZWdvcnkvbGlzdC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImxpc3RDYXRlZ29yeUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGRjYXRlZ29yeScsIHtcbiAgICAgICAgICAgIHVybDogXCIvYWRkY2F0ZWdvcnlcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2NhdGVnb3J5L2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZENhdGVnb3J5Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v566h55CG5ZGY566h55CGXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnVzZXInLCB7XG4gICAgICAgICAgICB1cmw6IFwiL3VzZXJcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL3VzZXIvbGlzdC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInVzZXJDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYWRkdXNlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvYWRkdXNlci86dXNlcm5hbWUvOm9iamVjdElkXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC91c2VyL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFVzZXJDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/mlofnq6DnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi9hcnRpY2xlXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9hcnRpY2xlL2FydGljbGUuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGFydGljbGUnLHtcbiAgICAgICAgICAgIHVybDogXCIvYWRkYXJ0aWNsZVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvYXJ0aWNsZS9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRBcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnVwZGF0ZWFydGljbGUnLHtcbiAgICAgICAgICAgIHVybDogXCIvdXBkYXRlYXJ0aWNsZS86aWRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2FydGljbGUvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidXBkYXRlQXJ0aWNsZUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+aOqOiNkOS9jee9rueuoeeQhlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5yZWNvbW1lbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvcmVjb21tZW5kL3JlY29tbWVuZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInJlY29tbWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGRyZWNvbW1lbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9hZGRyZWNvbW1lbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvcmVjb21tZW5kL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFJlY29tbWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+e9keermeS/oeaBr+iuvue9rlxuICAgICAgICAuc3RhdGUoJ2xheW91dC53ZWJpbmZvJyx7XG4gICAgICAgICAgICB1cmw6ICcvd2ViaW5mbycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC93ZWJpbmZvL3dlYmluZm8uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJ3ZWJJbmZvQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5Liq5Lq65L+h5oGv6K6+572uXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmluZm9ybWF0aW9uJyx7XG4gICAgICAgICAgICB1cmw6ICcvaW5mb3JtYXRpb24nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvd2ViaW5mby9pbmZvcm1hdGlvbi5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImluZm9ybWF0aW9uQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5Y+L5oOF6ZO+5o6lXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmZyaWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2ZyaWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9mcmllbmQvZnJpZW5kLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiZnJpZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGZyaWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2FkZGZyaWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9mcmllbmQvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkRnJpZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG59XSk7XG4iLCJhcHAuZmlsdGVyKCdjYXRlZ29yeVR5cGUnLCBbJ2NhdGVnb3J5U2VydmljZScsICckaHR0cCcsIGZ1bmN0aW9uIChjYXRlZ29yeVNlcnZpY2UsICRodHRwKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNhdGVnb3J5VHlwZShjb2QpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxufV0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS81LzE1LlxuICovXG5hcHAuZGlyZWN0aXZlKFwiY2F0ZWdvcnlsaXN0XCIsIFsnY2F0ZWdvcnlTZXJ2aWNlJyxmdW5jdGlvbiAoY2F0ZWdvcnlTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd3d3cvaHRtbC9kaXJlY3RpdmUvY2F0ZWdvcnlMaXN0Lmh0bWwnLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cikge1xuICAgICAgICAgICAgY2F0ZWdvcnlTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgc2NvcGUubGlzdCA9IHJlc3VsdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICB9XG59XSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmRpcmVjdGl2ZShcInJlY29tbWVuZGxpc3RcIiwgWydyZWNvbW1lbmRTZXJ2aWNlJyxmdW5jdGlvbiAocmVjb21tZW5kU2VydmljZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnd3d3L2h0bWwvZGlyZWN0aXZlL3JlY29tbWVuZExpc3QuaHRtbCcsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRyKSB7XG4gICAgICAgICAgICByZWNvbW1lbmRTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgc2NvcGUubGlzdCA9IHJlc3VsdFxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9LFxuICAgIH1cbn1dKTtcbiIsImFwcC5jb250cm9sbGVyKCdsYXlvdXRDb250cm9sbGVyJywgWyckc2NvcGUnLCckd2luZG93JyxmdW5jdGlvbiAoJHNjb3BlLCR3aW5kb3cpIHtcbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRzdGF0ZScsICdhamF4JywgJ3RvYXN0JywgJyRodHRwJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBhamF4LCB0b2FzdCwgJGh0dHApIHtcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi55m75b2V5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfnmbvlvZXmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dCcpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2NBbGVydCcsIFtdKTtcbiAgICBhcHAucnVuKFsnJHJvb3RTY29wZScsICdjQWxlcnQnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgY0FsZXJ0LCB0b2FzdCkge1xuICAgICAgICAkcm9vdFNjb3BlLnRvYXN0ID0ge307XG4gICAgICAgIGNBbGVydC5kaXNtaXNzKCk7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ2RlbW8nKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxjYWxlcnQ+PC9jYWxlcnQ+PHRvYXN0PjwvdG9hc3Q+PGNjb25maXJtPjwvY2NvbmZpcm0+XCIpO1xuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCdjYWxlcnQnLCBbJyRyb290U2NvcGUnLCAnY0FsZXJ0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsIGNBbGVydCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPSdjQWxlcnQgY0FsZXJ0LXt7Y0FsZXJ0Lmhhc319Jz48ZGl2IGNsYXNzPSdjQWxlcnQtYm94Jz48ZGl2IGNsYXNzPSdjQWxlcnQtaW5uZXJib3gnPjxkaXYgY2xhc3M9J2NBbGVydC1jb250ZW50Jz48cCBjbGFzcz0nY0FsZXJ0LXRpdGxlJz7mj5DnpLo8L3A+PHAgY2xhc3M9J2NBbGVydC1mb250Jz57e2NBbGVydC50ZXh0fX08L3A+PGRpdiBjbGFzcz0nY0FsZXJ0LWJ0bi1ib3gnPjxwIGNsYXNzPSdjQWxlcnQtYnRuIGNBbGVydC1idG4tZmFpbGQnIG5nLWNsaWNrPSdkaXNtaXNzKCknIG5nLWlmPSdjQWxlcnQuY29tZmlybSc+5YWz6ZetPC9wPjxwIGNsYXNzPSdjQWxlcnQtYnRuIGNBbGVydC1idG4tdHJ1ZScgbmctY2xpY2s9J2RvKCknPuehruiupDwvcD48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRycykge1xuICAgICAgICAgICAgICAgIHNjb3BlLmRpc21pc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNBbGVydC5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzY29wZS5kbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRyb290U2NvcGUuY0FsZXJ0LmJhY2spICRyb290U2NvcGUuY0FsZXJ0LmJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgYXBwLmRpcmVjdGl2ZSgndG9hc3QnLCBbJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPSd0b2FzdCcgbmctaWY9J3RvYXN0Lmhhcyc+e3t0b2FzdC5tc2d9fTwvZGl2PlwiLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHJzKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgYXBwLnNlcnZpY2UoJ2NBbGVydCcsIFsnJHJvb3RTY29wZScsICd0b2FzdCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCB0b2FzdCkge1xuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIGlmKG9iai5jb21maXJtKXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5jb21maXJtID0gdHJ1ZTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmNvbWZpcm0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmhhcyA9IHRydWU7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC50ZXh0ID0gb2JqLm1zZztcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmJhY2sgPSBvYmouYmFjaztcblxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRpc21pc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydCA9IHt9O1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQudGV4dCA9ICcnO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuYmFjayA9ICcnO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuaGFzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgYXBwLnNlcnZpY2UoJ3RvYXN0JywgWyckcm9vdFNjb3BlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsICR0aW1lb3V0KSB7XG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgJHJvb3RTY29wZS50b2FzdC5tc2cgPSBtc2c7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0LmhhcyA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGlzbWlzcyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICRyb290U2NvcGU7XG4gICAgICAgICAgICBpZiAobXNnKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS50b2FzdC5tc2cgPSBtc2c7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0LmhhcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDUwMClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0LmhhcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSlcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2NhbnZlckltYWdlJywgW10pO1xuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZSA9IHtcbiAgICAgICAgICAgIHVybDogJycsXG4gICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlU2hvdyA9IGZ1bmN0aW9uKHVybCl7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlLnVybCA9IHVybDtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2Uuc2hvdyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZUNsb3NlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2UudXJsID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlLnNob3cgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGNhbnZlcmltYWdlPjwvY2FudmVyaW1hZ2U+XCIpO1xuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCdjYW52ZXJpbWFnZScsIFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J2NhbnZlckltYWdlIGNhbnZlckltYWdlLXt7Y2FudmVySW1hZ2Uuc2hvd319JyBuZy1jbGljaz0nY2FudmVySW1hZ2VDbG9zZSgpJz48ZGl2PjxpbWcgbmctc3JjPSd7e2NhbnZlckltYWdlLnVybH19JyBhbHQ9Jyc+PC9kaXY+PC9kaXY+XCIsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cnMpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcblxufSkoKTsiLCJhcHAuc2VydmljZSgndG9vbFNlcnZpY2UnLCBmdW5jdGlvbiAoKSB7XG5cbn0pO1xuIiwiYXBwLnNlcnZpY2UoJ2FqYXgnLCBbJyRxJywgJyRodHRwJywgJyRyb290U2NvcGUnLCAnU0VSVkVSX1VSTCcsICckc3RhdGUnLCAnY0FsZXJ0JywgJ3RvYXN0JywgJ1VwbG9hZCcsIGZ1bmN0aW9uICgkcSwgJGh0dHAsICRyb290U2NvcGUsIFNFUlZFUl9VUkwsICRzdGF0ZSwgY0FsZXJ0LCB0b2FzdCwgVXBsb2FkKSB7XG4gICAgdGhpcy5wb3N0ID0gZnVuY3Rpb24gKHBvc3REYXRhKSB7XG4gICAgICAgIHZhciByZXEgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogU0VSVkVSX1VSTCArIHBvc3REYXRhLnVybCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0ciA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHAgaW4gb2JqKVxuICAgICAgICAgICAgICAgICAgICBzdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocCkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChvYmpbcF0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyLmpvaW4oXCImXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHBvc3REYXRhLmRhdGFcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWpheChyZXEsIHBvc3REYXRhKTtcbiAgICB9O1xuICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKHBvc3REYXRhKSB7XG4gICAgICAgIHZhciByZXEgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgcG9zdERhdGEudXJsLFxuICAgICAgICAgICAgcGFyYW1zOiBwb3N0RGF0YS5kYXRhXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLmFqYXgocmVxLCBwb3N0RGF0YSk7XG4gICAgfTtcbiAgICB0aGlzLmFqYXggPSBmdW5jdGlvbiAocmVxLCBwb3N0RGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXEpO1xuICAgICAgICAvL2lmKHBvc3REYXRhLnRvYXN0JiYkcm9vdFNjb3BlLnRvYXN0Lmhhcyl7XG4gICAgICAgIC8vICAgIGFsZXJ0KCfkuI3opoHph43lpI3mk43kvZwhJyk7XG4gICAgICAgIC8vICAgIHJldHVybiBmYWxzZVxuICAgICAgICAvL31cbiAgICAgICAgaWYgKHBvc3REYXRhLnRvYXN0KSB7XG4gICAgICAgICAgICB0b2FzdC5jcmVhdGUocG9zdERhdGEudG9hc3QpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgJGh0dHAocmVxKS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLmNvZGUgPT0gMjAwIHx8IDEwMSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3BvbnNlLmRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2c6IHJlc3BvbnNlLmRhdGEubXNnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyRzdGF0ZS5nbygnbG9naW4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiBmYWlsZWQocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbXNnOiAn5pyN5Yqh56uv6ZSZ6K+v77yBJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfTtcbiAgICB0aGlzLnVwbG9hZCA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuS4iuS8oOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXMuZGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZXZ0KTtcbiAgICAgICAgICAgIC8vIHZhciBwcm9ncmVzc1BlcmNlbnRhZ2UgPSBwYXJzZUludCgxMDAuMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWwpO1xuICAgICAgICAgICAgLy8gZGVmZXJyZWQucmVzb2x2ZShwcm9ncmVzc1BlcmNlbnRhZ2UpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncHJvZ3Jlc3M6ICcgKyBwcm9ncmVzc1BlcmNlbnRhZ2UgKyAnJSAnICsgZXZ0LmNvbmZpZy5kYXRhLmZpbGUubmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufVxuXSlcbjtcbiIsImFwcC5zZXJ2aWNlKCdhcnRpY2xlU2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LmdldCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiYXBwLnNlcnZpY2UoJ2NhdGVnb3J5U2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LmdldCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnknXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG4gICAgdGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgIGFqYXguZ2V0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExhZ2dvIG9uIDE2LzIvNC5cbiAqL1xuYXBwLnNlcnZpY2UoJ3JlY29tbWVuZFNlcnZpY2UnLCBbJ2FqYXgnLCAnJHEnLCBmdW5jdGlvbiAoYWpheCwgJHEpIHtcbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5nZXQoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZCdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiYXBwLmNvbnRyb2xsZXIoJ2FkZENhdGVnb3J5Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnknLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmNhdGVnb3J5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignbGlzdENhdGVnb3J5Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCdjYXRlZ29yeVNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCxjYXRlZ29yeVNlcnZpY2UpIHtcbiAgICBjYXRlZ29yeVNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgfSlcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbiAoaWQsIGluZGV4KSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnkvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvYmplY3RJZDogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ09LIScpO1xuICAgICAgICAgICAgICAgICRzY29wZS5saXN0LnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkRnJpZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvbGlua2ZyaWVuZCcsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuZGF0YSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuZnJpZW5kJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBneHggb24gMTYvMy8yOS5cbiAqL1xuYXBwLmNvbnRyb2xsZXIoJ2ZyaWVuZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICdjQWxlcnQnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCBjQWxlcnQpIHtcbiAgICBhamF4LmdldCh7XG4gICAgICAgIHVybDogJy9saW5rZnJpZW5kJyxcbiAgICAgICAgdG9hc3Q6IFwiZG8uLi5cIlxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAkc2NvcGUucmVzdWx0RGF0YSA9IHJlc3VsdDtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygnZW5kLi4hJyk7XG4gICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmZyaWVuZCcpO1xuICAgIH0pXG5cblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbiAoaWQsIGluZGV4KSB7XG4gICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgbWVzOiAn5piv5ZCm56Gu6K6k5Yig6ZmkIScsXG4gICAgICAgICAgICBjb21maXJtOiB0cnVlLFxuICAgICAgICAgICAgYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9saW5rZnJpZW5kL2RlbCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICAgICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ09LIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdERhdGEuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxufV0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ2FkZEFydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCAnU0VSVkVSX1VSTCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIFNFUlZFUl9VUkwpIHtcbiAgICAkc2NvcGUuYXJ0aWNsZSA9IHt9O1xuXG4gICAgJHNjb3BlLnVwbG9hZEltZyA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGFqYXgudXBsb2FkKGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLmFydGljbGUuZmlsZUlkID0gcmVzdWx0LmZpbGVJZDtcbiAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gcmVzdWx0LmZpbGVVcmw7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoISRzY29wZS5hcnRpY2xlLmZpbGVJZCl7XG4gICAgICAgICAgICBhbGVydCgn6K+35LiK5Lyg5Zu+54mHIScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlJyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5hcnRpY2xlLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuYXJ0aWNsZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9O1xuXG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYXJ0aWNsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJ2FydGljbGVTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsIGFydGljbGVTZXJ2aWNlKSB7XG5cbiAgICBhcnRpY2xlU2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgsZmlsZUlkKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZS9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgLy/lkIzml7bliKDpmaTlm77niYdcbiAgICAgICAgICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdXBsb2FkL2RlbCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdElkOmZpbGVJZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICAgICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ09LIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCd1cGRhdGVBcnRpY2xlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgJ1NFUlZFUl9VUkwnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSwgU0VSVkVSX1VSTCwgJHN0YXRlUGFyYW1zKSB7XG4gICAgYWpheC5wb3N0KHtcbiAgICAgICAgdXJsOiAnL2FydGljbGUvcXVlcnknLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBvYmplY3RJZDogJHN0YXRlUGFyYW1zLmlkXG4gICAgICAgIH0sXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluaVsOaNri4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ+iOt+WPluaIkOWKnyEnKTtcbiAgICAgICAgJHNjb3BlLmFydGljbGUgPSByZXN1bHQ7XG4gICAgICAgICRzY29wZS5hcnRpY2xlLmNhdGVnb3J5ID0gJHNjb3BlLmFydGljbGUuY2F0ZWdvcnkudG9TdHJpbmcoKTtcbiAgICAgICAgJHNjb3BlLmFydGljbGUuY29udGVudCA9IGRlY29kZVVSSUNvbXBvbmVudCgkc2NvcGUuYXJ0aWNsZS5jb250ZW50KTtcbiAgICAgICAgdmFyIGZpbGVJZCA9IHJlc3VsdC5maWxlSWQ7XG4gICAgICAgIGlmKGZpbGVJZCl7XG4gICAgICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogJy91cGxvYWQvcXVlcnknLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0SWQ6IGZpbGVJZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9hc3Q6IFwi6I635Y+W5pWw5o2uLi4uXCJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+iOt+WPluaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW1nUGF0aCA9IHJlc3VsdFswXS51cmw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHNjb3BlLmFydGljbGUgPSB7fTtcblxuICAgICRzY29wZS51cGxvYWRJbWcgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBhamF4LnVwbG9hZChmaWxlKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5hcnRpY2xlLmZpbGVJZCA9IHJlc3VsdC5maWxlSWQ7XG4gICAgICAgICAgICAkc2NvcGUuaW1nUGF0aCA9IHJlc3VsdC5maWxlVXJsO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKCEkc2NvcGUuYXJ0aWNsZS5maWxlSWQpe1xuICAgICAgICAgICAgYWxlcnQoJ+ivt+S4iuS8oOWbvueJhyEnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZS91cGRhdGUnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmFydGljbGUsXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5hcnRpY2xlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH07XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGd4eCBvbiAyMDE2LzEvMjguXG4gKi9cbmFwcC5jb250cm9sbGVyKCdtYW5hZ2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG59XSk7XG4iLCJhcHAuY29udHJvbGxlcignYWRkUmVjb21tZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgICAgICBuaWNrbmFtZTogJHNjb3BlLm5pY2tuYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQucmVjb21tZW5kJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdyZWNvbW1lbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICdyZWNvbW1lbmRTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsIHJlY29tbWVuZFNlcnZpY2UpIHtcbiAgICByZWNvbW1lbmRTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZC9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkVXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuICAgICRzY29wZS5kYXRhID0ge1xuICAgICAgICB1c2VybmFtZTogJHN0YXRlUGFyYW1zLnVzZXJuYW1lLFxuICAgICAgICBvYmplY3RJZDogJHN0YXRlUGFyYW1zLm9iamVjdElkXG4gICAgfTtcblxuICAgICRzY29wZS5pc0Rpc2FibGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJHN0YXRlUGFyYW1zLm9iamVjdElkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH07XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciB1cmwgPSAkc3RhdGVQYXJhbXMub2JqZWN0SWQgPyAnL3VzZXIvdXBkYXRhJyA6ICcvdXNlci8nO1xuICAgICAgICB2YXIgZGF0YSA9ICRzdGF0ZVBhcmFtcy5vYmplY3RJZCA/IHtcbiAgICAgICAgICAgIG9iamVjdElkOiAkc3RhdGVQYXJhbXMub2JqZWN0SWQsXG4gICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgIH0gOiB7XG4gICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLmRhdGEudXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICAgIH07XG4gICAgICAgIHZhciBfdG9hc3QgPSAkc3RhdGVQYXJhbXMub2JqZWN0SWQgPyAn5L+u5pS55LitLi4uJyA6ICfmt7vliqDkuK0uLi4nO1xuICAgICAgICB2YXIgX2Rpc21pc3MgPSAkc3RhdGVQYXJhbXMub2JqZWN0SWQgPyAn5L+u5pS55oiQ5YqfIScgOiAn5re75Yqg5oiQ5YqfISc7XG5cbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHRvYXN0OiBfdG9hc3RcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKF9kaXNtaXNzKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LnVzZXInKVxuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigndXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QpIHtcbiAgICAvL+afpeivoueuoeeQhuWRmFxuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL3VzZXInLFxuICAgICAgICB0b2FzdDogXCLojrflj5bkuK0uLi5cIlxuICAgIH0pLnRoZW4oXG4gICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgICAgICB9XG4gICAgKTtcbiAgICAvL+WIoOmZpOeuoeeQhuWRmFxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpZCxpbmRleCl7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvdXNlci9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG9iamVjdElkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH07XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignaW5mb3JtYXRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICdjQWxlcnQnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCBjQWxlcnQsIHRvYXN0KSB7XG4gICAgJHNjb3BlLmlzVXBkYXRhID0gZmFsc2U7XG4gICAgLy/mn6Xor6LkuKrkurrkv6Hmga9cbiAgICBhamF4LmdldCh7XG4gICAgICAgIHVybDogJy9pbmZvcm1hdGlvbicsXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluS4rS4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgJHNjb3BlLmlzVXBkYXRhID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaW5mbyA9IHJlc3VsdFswXTtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfJyk7XG4gICAgfSk7XG5cblxuICAgIC8v6K6+572u5Liq5Lq65L+h5oGvXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9ICcnO1xuICAgICAgICB2YXIgZGF0YSA9ICcnO1xuICAgICAgICBpZiAoJHNjb3BlLmlzVXBkYXRhKSB7XG4gICAgICAgICAgICB1cmwgPSAnL2luZm9ybWF0aW9uJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVybCA9ICcvaW5mb3JtYXRpb24vdXBkYXRhJztcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuaW5mbyxcbiAgICAgICAgICAgIHRvYXN0OiBcIuiuvue9ruS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn6K6+572u5oiQ5YqfJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCd3ZWJJbmZvQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAnY0FsZXJ0JywndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCBjQWxlcnQsdG9hc3QpIHtcbiAgICAkc2NvcGUuaXNVcGRhdGEgPSBmYWxzZTtcbiAgICAvL+afpeivouS4quS6uuS/oeaBr1xuICAgIGFqYXguZ2V0KHtcbiAgICAgICAgdXJsOiAnL3dlYmluZm8nLFxuICAgICAgICB0b2FzdDogXCLojrflj5bkuK0uLi5cIlxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICRzY29wZS5pc1VwZGF0YSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmluZm8gPSByZXN1bHRbMF07XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ+iOt+WPluaIkOWKnycpO1xuICAgIH0pO1xuXG5cbiAgICAvL+iuvue9ruS4quS6uuS/oeaBr1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSAnJztcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKCRzY29wZS5pc1VwZGF0YSkge1xuICAgICAgICAgICAgdXJsID0gJy93ZWJpbmZvJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVybCA9ICcvd2ViaW5mby91cGRhdGEnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pbmZvLFxuICAgICAgICAgICAgdG9hc3Q6IFwi6K6+572u5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCforr7nva7miJDlip8nKTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
