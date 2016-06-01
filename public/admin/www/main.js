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
                console.log(result)
            }
        )
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
            template: "<div class='toast' ng-if='toast.has'>{{toast.mes}}</div>",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInJvdXRlci5qcyIsImNvbnRyb2xsZXIvaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sYXlvdXRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sb2dpbkNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlL1Rvb2xTZXJ2aWNlLmpzIiwic2VydmljZS9hamF4U2VydmljZS5qcyIsInNlcnZpY2UvYXJ0aWNsZS5qcyIsInNlcnZpY2UvY2F0ZWdvcnkuanMiLCJzZXJ2aWNlL3JlY29tbWVuZC5qcyIsIm1vZHVsZXMvY0FsZXJ0LmpzIiwibW9kdWxlcy9jYW52ZXJJbWFnZS5qcyIsImRpcmVjdGl2ZS9jYXRlZ29yeUxpc3QuanMiLCJkaXJlY3RpdmUvcmVjb21tZW5kTGlzdC5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hZGRBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS91cGRhdGVBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvY2F0ZWdvcnkvYWRkQ2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9jYXRlZ29yeS9saXN0Q2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9mcmllbmQvYWRkLmpzIiwiY29udHJvbGxlci9mcmllbmQvZnJpZW5kLmpzIiwiY29udHJvbGxlci9tYW5hZ2VyL21hbmFnZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9yZWNvbW1lbmQvYWRkUmVjb21tZW5kQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcmVjb21tZW5kL3JlY29tbWVuZENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3VzZXIvYWRkVXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3VzZXIvdXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3dlYmluZm8vaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci93ZWJpbmZvL3dlYmluZm9Db250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNC8xNS5cbiAqL1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCduZ0FuaW1hdGUnLCdjQWxlcnQnLCduZ0ZpbGVVcGxvYWQnXSk7XG5hcHAucnVuKFsnJHJvb3RTY29wZScsICckd2luZG93JywgJyRodHRwJywgJ2FqYXgnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHdpbmRvdywgJGh0dHAsIGFqYXgpIHtcbiAgICAkaHR0cC5kZWZhdWx0cy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xufV0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS80LzE1LlxuICovXG52YXIgY29uZmlnID0ge1xuICAgICdTRVJWRVJfVVJMJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCdcbn07XG5mb3IoaXRlbSBpbiBjb25maWcpe1xuICAgIGFwcC5jb25zdGFudChpdGVtLGNvbmZpZ1tpdGVtXSlcbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9sb2dpblwiKTtcbiAgICAvLyBOb3cgc2V0IHVwIHRoZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAvL+eZu+W9lVxuICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvbG9naW4uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsb2dpbkNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+W4g+WxgFxuICAgICAgICAuc3RhdGUoJ2xheW91dCcsIHtcbiAgICAgICAgICAgIHVybDogXCIvbGF5b3V0XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9sYXlvdXQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsYXlvdXRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/moI/nm65cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuY2F0ZWdvcnknLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2NhdGVnb3J5XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9jYXRlZ29yeS9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdENhdGVnb3J5Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGNhdGVnb3J5Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGRjYXRlZ29yeVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvY2F0ZWdvcnkvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkQ2F0ZWdvcnlDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/nrqHnkIblkZjnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQudXNlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvdXNlclwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvdXNlci9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidXNlckNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGR1c2VyJywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGR1c2VyXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC91c2VyL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFVzZXJDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/mlofnq6DnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi9hcnRpY2xlXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9hcnRpY2xlL2FydGljbGUuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGFydGljbGUnLHtcbiAgICAgICAgICAgIHVybDogXCIvYWRkYXJ0aWNsZVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvYXJ0aWNsZS9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRBcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnVwZGF0ZWFydGljbGUnLHtcbiAgICAgICAgICAgIHVybDogXCIvdXBkYXRlYXJ0aWNsZS86aWRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2FydGljbGUvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidXBkYXRlQXJ0aWNsZUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+aOqOiNkOS9jee9rueuoeeQhlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5yZWNvbW1lbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvcmVjb21tZW5kL3JlY29tbWVuZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInJlY29tbWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGRyZWNvbW1lbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9hZGRyZWNvbW1lbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvcmVjb21tZW5kL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFJlY29tbWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+e9keermeS/oeaBr+iuvue9rlxuICAgICAgICAuc3RhdGUoJ2xheW91dC53ZWJpbmZvJyx7XG4gICAgICAgICAgICB1cmw6ICcvd2ViaW5mbycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC93ZWJpbmZvL3dlYmluZm8uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJ3ZWJJbmZvQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5Liq5Lq65L+h5oGv6K6+572uXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmluZm9ybWF0aW9uJyx7XG4gICAgICAgICAgICB1cmw6ICcvaW5mb3JtYXRpb24nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvd2ViaW5mby9pbmZvcm1hdGlvbi5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImluZm9ybWF0aW9uQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5Y+L5oOF6ZO+5o6lXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmZyaWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2ZyaWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9mcmllbmQvZnJpZW5kLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiZnJpZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGZyaWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2FkZGZyaWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9mcmllbmQvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkRnJpZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG59XSk7XG4iLCIiLCJhcHAuY29udHJvbGxlcignbGF5b3V0Q29udHJvbGxlcicsIFsnJHNjb3BlJywnJHdpbmRvdycsZnVuY3Rpb24gKCRzY29wZSwkd2luZG93KSB7XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckc3RhdGUnLCAnYWpheCcsICd0b2FzdCcsICckaHR0cCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgYWpheCwgdG9hc3QsICRodHRwKSB7XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIueZu+W9leS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG59XSk7IiwiYXBwLnNlcnZpY2UoJ3Rvb2xTZXJ2aWNlJywgZnVuY3Rpb24gKCkge1xuXG59KTtcbiIsImFwcC5zZXJ2aWNlKCdhamF4JywgWyckcScsICckaHR0cCcsICckcm9vdFNjb3BlJywgJ1NFUlZFUl9VUkwnLCAnJHN0YXRlJywgJ2NBbGVydCcsICd0b2FzdCcsICdVcGxvYWQnLCBmdW5jdGlvbiAoJHEsICRodHRwLCAkcm9vdFNjb3BlLCBTRVJWRVJfVVJMLCAkc3RhdGUsIGNBbGVydCwgdG9hc3QsIFVwbG9hZCkge1xuICAgIHRoaXMucG9zdCA9IGZ1bmN0aW9uIChwb3N0RGF0YSkge1xuICAgICAgICB2YXIgcmVxID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyBwb3N0RGF0YS51cmwsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YTogcG9zdERhdGEuZGF0YVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5hamF4KHJlcSwgcG9zdERhdGEpO1xuICAgIH07XG4gICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAocG9zdERhdGEpIHtcbiAgICAgICAgdmFyIHJlcSA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyBwb3N0RGF0YS51cmwsXG4gICAgICAgICAgICBwYXJhbXM6IHBvc3REYXRhLmRhdGFcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWpheChyZXEsIHBvc3REYXRhKTtcbiAgICB9O1xuICAgIHRoaXMuYWpheCA9IGZ1bmN0aW9uIChyZXEsIHBvc3REYXRhKSB7XG4gICAgICAgIC8vaWYocG9zdERhdGEudG9hc3QmJiRyb290U2NvcGUudG9hc3QuaGFzKXtcbiAgICAgICAgLy8gICAgYWxlcnQoJ+S4jeimgemHjeWkjeaTjeS9nCEnKTtcbiAgICAgICAgLy8gICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vfVxuICAgICAgICBpZiAocG9zdERhdGEudG9hc3QpIHtcbiAgICAgICAgICAgIHRvYXN0LmNyZWF0ZShwb3N0RGF0YS50b2FzdCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICAkaHR0cChyZXEpLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuY29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXNwb25zZS5kYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuZGF0YS5jb2RlID09IDIwMikge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lczogcmVzcG9uc2UuZGF0YS5tZXNcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gZmFpbGVkKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG1lczogJ+acjeWKoeerr+mUmeivr++8gSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH07XG4gICAgdGhpcy51cGxvYWQgPSBmdW5jdGlvbiAoZmlsZSwgZGF0YSkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgIC8v5pyN5Yqh56uv5o6l5pS2XG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyAnL3VwbG9hZCcsXG4gICAgICAgICAgICAvL+S4iuS8oOeahOWQjOaXtuW4pueahOWPguaVsFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwLmRhdGEpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHN0YXR1czogJyArIHJlc3Auc3RhdHVzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXZ0KTtcbiAgICAgICAgICAgIC8vIHZhciBwcm9ncmVzc1BlcmNlbnRhZ2UgPSBwYXJzZUludCgxMDAuMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWwpO1xuICAgICAgICAgICAgLy8gZGVmZXJyZWQucmVzb2x2ZShwcm9ncmVzc1BlcmNlbnRhZ2UpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygncHJvZ3Jlc3M6ICcgKyBwcm9ncmVzc1BlcmNlbnRhZ2UgKyAnJSAnICsgZXZ0LmNvbmZpZy5kYXRhLmZpbGUubmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufVxuXSlcbjtcbiIsImFwcC5zZXJ2aWNlKCdhcnRpY2xlU2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2FydGljbGUnXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcHJvbWlzZVxuICAgIH1cbn1dKTtcblxuIiwiYXBwLnNlcnZpY2UoJ2NhdGVnb3J5U2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2NhdGVnb3J5J1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG59XSk7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxNi8yLzQuXG4gKi9cbmFwcC5zZXJ2aWNlKCdyZWNvbW1lbmRTZXJ2aWNlJywgWydhamF4JywgJyRxJywgZnVuY3Rpb24gKGFqYXgsICRxKSB7XG4gICAgdGhpcy5saXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG59XSk7XG5cbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY0FsZXJ0JywgW10pO1xuICAgIGFwcC5ydW4oWyckcm9vdFNjb3BlJywgJ2NBbGVydCcsICd0b2FzdCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBjQWxlcnQsIHRvYXN0KSB7XG4gICAgICAgICRyb290U2NvcGUudG9hc3QgPSB7fTtcbiAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygnZGVtbycpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGNhbGVydD48L2NhbGVydD48dG9hc3Q+PC90b2FzdD48Y2NvbmZpcm0+PC9jY29uZmlybT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbGVydCcsIFsnJHJvb3RTY29wZScsICdjQWxlcnQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgY0FsZXJ0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J2NBbGVydCBjQWxlcnQte3tjQWxlcnQuaGFzfX0nPjxkaXYgY2xhc3M9J2NBbGVydC1ib3gnPjxkaXYgY2xhc3M9J2NBbGVydC1pbm5lcmJveCc+PGRpdiBjbGFzcz0nY0FsZXJ0LWNvbnRlbnQnPjxwIGNsYXNzPSdjQWxlcnQtdGl0bGUnPuaPkOekujwvcD48cCBjbGFzcz0nY0FsZXJ0LWZvbnQnPnt7Y0FsZXJ0LnRleHR9fTwvcD48ZGl2IGNsYXNzPSdjQWxlcnQtYnRuLWJveCc+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi1mYWlsZCcgbmctY2xpY2s9J2Rpc21pc3MoKScgbmctaWY9J2NBbGVydC5jb21maXJtJz7lhbPpl608L3A+PHAgY2xhc3M9J2NBbGVydC1idG4gY0FsZXJ0LWJ0bi10cnVlJyBuZy1jbGljaz0nZG8oKSc+56Gu6K6kPC9wPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY0FsZXJ0LmRpc21pc3MoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNjb3BlLmRvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS5jQWxlcnQuYmFjaykgJHJvb3RTY29wZS5jQWxlcnQuYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuZGlzbWlzcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuZGlyZWN0aXZlKCd0b2FzdCcsIFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9J3RvYXN0JyBuZy1pZj0ndG9hc3QuaGFzJz57e3RvYXN0Lm1lc319PC9kaXY+XCIsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cnMpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgnY0FsZXJ0JywgWyckcm9vdFNjb3BlJywgJ3RvYXN0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsIHRvYXN0KSB7XG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgaWYob2JqLmNvbWZpcm0pe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmNvbWZpcm0gPSB0cnVlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuY29tZmlybSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuaGFzID0gdHJ1ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LnRleHQgPSBvYmoubWVzO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuYmFjayA9IG9iai5iYWNrO1xuXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGlzbWlzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0ID0ge307XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC50ZXh0ID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5iYWNrID0gJyc7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5oYXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICBhcHAuc2VydmljZSgndG9hc3QnLCBbJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAobWVzKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1lcyA9IG1lcztcbiAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kaXNtaXNzID0gZnVuY3Rpb24gKG1lcykge1xuICAgICAgICAgICAgJHJvb3RTY29wZTtcbiAgICAgICAgICAgIGlmIChtZXMpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRvYXN0Lm1lcyA9IG1lcztcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgNTAwKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QuaGFzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKVxuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY2FudmVySW1hZ2UnLCBbXSk7XG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlID0ge1xuICAgICAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2VTaG93ID0gZnVuY3Rpb24odXJsKXtcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2UudXJsID0gdXJsO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS5zaG93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlQ2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS51cmwgPSAnJztcbiAgICAgICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2Uuc2hvdyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8Y2FudmVyaW1hZ2U+PC9jYW52ZXJpbWFnZT5cIik7XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ2NhbnZlcmltYWdlJywgWyckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz0nY2FudmVySW1hZ2UgY2FudmVySW1hZ2Ute3tjYW52ZXJJbWFnZS5zaG93fX0nIG5nLWNsaWNrPSdjYW52ZXJJbWFnZUNsb3NlKCknPjxkaXY+PGltZyBuZy1zcmM9J3t7Y2FudmVySW1hZ2UudXJsfX0nIGFsdD0nJz48L2Rpdj48L2Rpdj5cIixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRycykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG59KSgpOyIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS81LzE1LlxuICovXG5hcHAuZGlyZWN0aXZlKFwiY2F0ZWdvcnlsaXN0XCIsIFsnY2F0ZWdvcnlTZXJ2aWNlJyxmdW5jdGlvbiAoY2F0ZWdvcnlTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd3d3cvaHRtbC9kaXJlY3RpdmUvY2F0ZWdvcnlMaXN0Lmh0bWwnLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cikge1xuICAgICAgICAgICAgY2F0ZWdvcnlTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgc2NvcGUubGlzdCA9IHJlc3VsdFxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9LFxuICAgIH1cbn1dKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS81LzE1LlxuICovXG5hcHAuZGlyZWN0aXZlKFwicmVjb21tZW5kbGlzdFwiLCBbJ3JlY29tbWVuZFNlcnZpY2UnLGZ1bmN0aW9uIChyZWNvbW1lbmRTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd3d3cvaHRtbC9kaXJlY3RpdmUvcmVjb21tZW5kTGlzdC5odG1sJyxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgc2NvcGU6IHtcblxuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cikge1xuICAgICAgICAgICAgcmVjb21tZW5kU2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHNjb3BlLmxpc3QgPSByZXN1bHRcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSxcbiAgICB9XG59XSk7XG4iLCJhcHAuY29udHJvbGxlcignYWRkQXJ0aWNsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsJ1NFUlZFUl9VUkwnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLFNFUlZFUl9VUkwpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2FydGljbGUvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5hcnRpY2xlLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuYXJ0aWNsZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICAkc2NvcGUudXBsb2FkSW1nID0gZnVuY3Rpb24oZmlsZSl7XG4gICAgICAgIGFqYXgudXBsb2FkKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gU0VSVkVSX1VSTCtcIi91cGxvYWQvXCIrcmVzdWx0LmZpbGVuYW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsJ2FydGljbGVTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsYXJ0aWNsZVNlcnZpY2UpIHtcblxuICAgIGFydGljbGVTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaWQsaW5kZXgpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2FydGljbGUvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigndXBkYXRlQXJ0aWNsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsICdTRVJWRVJfVVJMJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIFNFUlZFUl9VUkwsICRzdGF0ZVBhcmFtcykge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy9hcnRpY2xlL3F1ZXJ5JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6ICRzdGF0ZVBhcmFtcy5pZFxuICAgICAgICB9LFxuICAgICAgICB0b2FzdDogXCLojrflj5bmlbDmja4uLi5cIlxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCfojrflj5bmiJDlip8hJyk7XG4gICAgICAgICRzY29wZS5hcnRpY2xlID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuYXJ0aWNsZS51cGRhdGVUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL3VwZGF0ZScsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuYXJ0aWNsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuS/ruaUueS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+S/ruaUueaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5hcnRpY2xlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH07XG4gICAgJHNjb3BlLnVwbG9hZEltZyA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGFqYXgudXBsb2FkKGZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLmltZ1BhdGggPSBTRVJWRVJfVVJMICsgXCIvdXBsb2FkL1wiICsgcmVzdWx0LmZpbGVuYW1lO1xuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkQ2F0ZWdvcnlDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeS9hZGQnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmNhdGVnb3J5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignbGlzdENhdGVnb3J5Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCdjYXRlZ29yeVNlcnZpY2UnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCxjYXRlZ29yeVNlcnZpY2UpIHtcbiAgICBjYXRlZ29yeVNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgfSlcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbiAoaWQsIGluZGV4KSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnkvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FkZEZyaWVuZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2ZyaWVuZC9hZGQnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmRhdGEsXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmZyaWVuZCcpO1xuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgSG91IG9uIDE2LzMvMjkuXG4gKi9cbmFwcC5jb250cm9sbGVyKCdmcmllbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCAnY0FsZXJ0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSwgY0FsZXJ0KSB7XG4gICAgYWpheC5wb3N0KHtcbiAgICAgICAgdXJsOiAnL2ZyaWVuZC9xdWVyeScsXG4gICAgICAgIHRvYXN0OiBcImRvLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgJHNjb3BlLnJlc3VsdERhdGEgPSByZXN1bHQ7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ2VuZC4uIScpO1xuICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5mcmllbmQnKTtcbiAgICB9KVxuXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgIG1lczogJ+aYr+WQpuehruiupOWIoOmZpCEnLFxuICAgICAgICAgICAgY29tZmlybTogdHJ1ZSxcbiAgICAgICAgICAgIGJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvZnJpZW5kL2RlbCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHREYXRhLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbn1dKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBneHggb24gMjAxNi8xLzI4LlxuICovXG5hcHAuY29udHJvbGxlcignbWFuYWdlckNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxufV0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ2FkZFJlY29tbWVuZENvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZC9hZGQnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQucmVjb21tZW5kJyk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdyZWNvbW1lbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICdyZWNvbW1lbmRTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsIHJlY29tbWVuZFNlcnZpY2UpIHtcbiAgICByZWNvbW1lbmRTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZC9kZWwnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIF9pZDogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLliKDpmaTkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignYWRkVXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUpIHtcbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3VzZXJzL2FkZCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJHNjb3BlLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQudXNlcicpXG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCd1c2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy91c2VycydcbiAgICB9KS50aGVuKFxuICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICAgICAgfVxuICAgIClcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpZCxpbmRleCl7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvdXNlcnMvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCdPSyEnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdC5zcGxpY2UoaW5kZXgsMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxufV0pOyIsImFwcC5jb250cm9sbGVyKCdpbmZvcm1hdGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ2NBbGVydCcsJ3RvYXN0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgY0FsZXJ0LHRvYXN0KSB7XG4gICAgYWpheC5wb3N0KHtcbiAgICAgICAgdXJsOiAnL2luZm9ybWF0aW9uL3F1ZXJ5JyxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5LitLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5pbmZvID0gcmVzdWx0O1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCfojrflj5bmiJDlip8nKTtcbiAgICB9KVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvaW5mb3JtYXRpb24vc2V0JyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pbmZvLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5L+u5pS55LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgbWVzOifkv67mlLnmiJDlip8nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcignd2ViSW5mb0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ2NBbGVydCcsJ3RvYXN0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgY0FsZXJ0LHRvYXN0KSB7XG4gICAgYWpheC5wb3N0KHtcbiAgICAgICAgdXJsOiAnL3dlYmluZm8vcXVlcnknLFxuICAgICAgICB0b2FzdDogXCLojrflj5bkuK0uLi5cIlxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgJHNjb3BlLmluZm8gPSByZXN1bHQ7XG4gICAgICAgIHRvYXN0LmRpc21pc3MoJ+iOt+WPluaIkOWKnycpO1xuICAgIH0pXG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy93ZWJpbmZvL3NldCcsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuaW5mbyxcbiAgICAgICAgICAgIHRvYXN0OiBcIuS/ruaUueS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIG1lczon5L+u5pS55oiQ5YqfJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
