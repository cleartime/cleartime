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
        };
        $rootScope.canverImageClose = function(){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsInJvdXRlci5qcyIsImNvbnRyb2xsZXIvaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sYXlvdXRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9sb2dpbkNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL2NBbGVydC5qcyIsIm1vZHVsZXMvY2FudmVySW1hZ2UuanMiLCJzZXJ2aWNlL1Rvb2xTZXJ2aWNlLmpzIiwic2VydmljZS9hamF4U2VydmljZS5qcyIsInNlcnZpY2UvYXJ0aWNsZS5qcyIsInNlcnZpY2UvY2F0ZWdvcnkuanMiLCJzZXJ2aWNlL3JlY29tbWVuZC5qcyIsImRpcmVjdGl2ZS9jYXRlZ29yeUxpc3QuanMiLCJkaXJlY3RpdmUvcmVjb21tZW5kTGlzdC5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hZGRBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS9hcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvYXJ0Y2lsZS91cGRhdGVBcnRpY2xlQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvY2F0ZWdvcnkvYWRkQ2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9jYXRlZ29yeS9saXN0Q2F0ZWdvcnlDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9mcmllbmQvYWRkLmpzIiwiY29udHJvbGxlci9mcmllbmQvZnJpZW5kLmpzIiwiY29udHJvbGxlci9tYW5hZ2VyL21hbmFnZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlci9yZWNvbW1lbmQvYWRkUmVjb21tZW5kQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXIvcmVjb21tZW5kL3JlY29tbWVuZENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3VzZXIvYWRkVXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3VzZXIvdXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyL3dlYmluZm8vaW5mb3JtYXRpb25Db250cm9sbGVyLmpzIiwiY29udHJvbGxlci93ZWJpbmZvL3dlYmluZm9Db250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNC8xNS5cbiAqL1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlcicsICduZ1N0b3JhZ2UnLCduZ0FuaW1hdGUnLCdjQWxlcnQnLCduZ0ZpbGVVcGxvYWQnXSk7XG5hcHAucnVuKFsnJHJvb3RTY29wZScsICckd2luZG93JywgJyRodHRwJywgJ2FqYXgnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHdpbmRvdywgJGh0dHAsIGFqYXgpIHtcbiAgICAkaHR0cC5kZWZhdWx0cy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xufV0pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBMYWdnbyBvbiAxMS80LzE1LlxuICovXG52YXIgY29uZmlnID0ge1xuICAgICdTRVJWRVJfVVJMJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCdcbn07XG5mb3IoaXRlbSBpbiBjb25maWcpe1xuICAgIGFwcC5jb25zdGFudChpdGVtLGNvbmZpZ1tpdGVtXSlcbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9sb2dpblwiKTtcbiAgICAvLyBOb3cgc2V0IHVwIHRoZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAvL+eZu+W9lVxuICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvbG9naW4uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsb2dpbkNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+W4g+WxgFxuICAgICAgICAuc3RhdGUoJ2xheW91dCcsIHtcbiAgICAgICAgICAgIHVybDogXCIvbGF5b3V0XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9sYXlvdXQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJsYXlvdXRDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/moI/nm65cbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuY2F0ZWdvcnknLCB7XG4gICAgICAgICAgICB1cmw6IFwiL2NhdGVnb3J5XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9jYXRlZ29yeS9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdENhdGVnb3J5Q29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGNhdGVnb3J5Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGRjYXRlZ29yeVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvY2F0ZWdvcnkvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkQ2F0ZWdvcnlDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/nrqHnkIblkZjnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQudXNlcicsIHtcbiAgICAgICAgICAgIHVybDogXCIvdXNlclwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvdXNlci9saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidXNlckNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGR1c2VyJywge1xuICAgICAgICAgICAgdXJsOiBcIi9hZGR1c2VyXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC91c2VyL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFVzZXJDb250cm9sbGVyXCJcbiAgICAgICAgfSlcbiAgICAgICAgLy/mlofnq6DnrqHnkIZcbiAgICAgICAgLnN0YXRlKCdsYXlvdXQuYXJ0aWNsZScse1xuICAgICAgICAgICAgdXJsOiBcIi9hcnRpY2xlXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9hcnRpY2xlL2FydGljbGUuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGFydGljbGUnLHtcbiAgICAgICAgICAgIHVybDogXCIvYWRkYXJ0aWNsZVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvYXJ0aWNsZS9hZGQuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRBcnRpY2xlQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LnVwZGF0ZWFydGljbGUnLHtcbiAgICAgICAgICAgIHVybDogXCIvdXBkYXRlYXJ0aWNsZS86aWRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInd3dy9odG1sL2FydGljbGUvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidXBkYXRlQXJ0aWNsZUNvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+aOqOiNkOS9jee9rueuoeeQhlxuICAgICAgICAuc3RhdGUoJ2xheW91dC5yZWNvbW1lbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvcmVjb21tZW5kL3JlY29tbWVuZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInJlY29tbWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2xheW91dC5hZGRyZWNvbW1lbmQnLHtcbiAgICAgICAgICAgIHVybDogJy9hZGRyZWNvbW1lbmQnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvcmVjb21tZW5kL2FkZC5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFJlY29tbWVuZENvbnRyb2xsZXJcIlxuICAgICAgICB9KVxuICAgICAgICAvL+e9keermeS/oeaBr+iuvue9rlxuICAgICAgICAuc3RhdGUoJ2xheW91dC53ZWJpbmZvJyx7XG4gICAgICAgICAgICB1cmw6ICcvd2ViaW5mbycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC93ZWJpbmZvL3dlYmluZm8uaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJ3ZWJJbmZvQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5Liq5Lq65L+h5oGv6K6+572uXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmluZm9ybWF0aW9uJyx7XG4gICAgICAgICAgICB1cmw6ICcvaW5mb3JtYXRpb24nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwid3d3L2h0bWwvd2ViaW5mby9pbmZvcm1hdGlvbi5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImluZm9ybWF0aW9uQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC8v5Y+L5oOF6ZO+5o6lXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmZyaWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2ZyaWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9mcmllbmQvZnJpZW5kLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiZnJpZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnbGF5b3V0LmFkZGZyaWVuZCcse1xuICAgICAgICAgICAgdXJsOiAnL2FkZGZyaWVuZCcsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ3d3cvaHRtbC9mcmllbmQvYWRkLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkRnJpZW5kQ29udHJvbGxlclwiXG4gICAgICAgIH0pXG59XSk7XG4iLCIiLCJhcHAuY29udHJvbGxlcignbGF5b3V0Q29udHJvbGxlcicsIFsnJHNjb3BlJywnJHdpbmRvdycsZnVuY3Rpb24gKCRzY29wZSwkd2luZG93KSB7XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICckc3RhdGUnLCAnYWpheCcsICd0b2FzdCcsICckaHR0cCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgYWpheCwgdG9hc3QsICRodHRwKSB7XG5cbiAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogJHNjb3BlLm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIueZu+W9leS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG59XSk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdjQWxlcnQnLCBbXSk7XG4gICAgYXBwLnJ1bihbJyRyb290U2NvcGUnLCAnY0FsZXJ0JywgJ3RvYXN0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsIGNBbGVydCwgdG9hc3QpIHtcbiAgICAgICAgJHJvb3RTY29wZS50b2FzdCA9IHt9O1xuICAgICAgICBjQWxlcnQuZGlzbWlzcygpO1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCdkZW1vJyk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8Y2FsZXJ0PjwvY2FsZXJ0Pjx0b2FzdD48L3RvYXN0PjxjY29uZmlybT48L2Njb25maXJtPlwiKTtcbiAgICB9XSk7XG4gICAgYXBwLmRpcmVjdGl2ZSgnY2FsZXJ0JywgWyckcm9vdFNjb3BlJywgJ2NBbGVydCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBjQWxlcnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz0nY0FsZXJ0IGNBbGVydC17e2NBbGVydC5oYXN9fSc+PGRpdiBjbGFzcz0nY0FsZXJ0LWJveCc+PGRpdiBjbGFzcz0nY0FsZXJ0LWlubmVyYm94Jz48ZGl2IGNsYXNzPSdjQWxlcnQtY29udGVudCc+PHAgY2xhc3M9J2NBbGVydC10aXRsZSc+5o+Q56S6PC9wPjxwIGNsYXNzPSdjQWxlcnQtZm9udCc+e3tjQWxlcnQudGV4dH19PC9wPjxkaXYgY2xhc3M9J2NBbGVydC1idG4tYm94Jz48cCBjbGFzcz0nY0FsZXJ0LWJ0biBjQWxlcnQtYnRuLWZhaWxkJyBuZy1jbGljaz0nZGlzbWlzcygpJyBuZy1pZj0nY0FsZXJ0LmNvbWZpcm0nPuWFs+mXrTwvcD48cCBjbGFzcz0nY0FsZXJ0LWJ0biBjQWxlcnQtYnRuLXRydWUnIG5nLWNsaWNrPSdkbygpJz7noa7orqQ8L3A+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZSwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5kaXNtaXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjQWxlcnQuZGlzbWlzcygpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2NvcGUuZG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLmNBbGVydC5iYWNrKSAkcm9vdFNjb3BlLmNBbGVydC5iYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIGNBbGVydC5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuICAgIGFwcC5kaXJlY3RpdmUoJ3RvYXN0JywgWyckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiBjbGFzcz0ndG9hc3QnIG5nLWlmPSd0b2FzdC5oYXMnPnt7dG9hc3QubWVzfX08L2Rpdj5cIixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlLCBhdHRycykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuICAgIGFwcC5zZXJ2aWNlKCdjQWxlcnQnLCBbJyRyb290U2NvcGUnLCAndG9hc3QnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgdG9hc3QpIHtcbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICBpZihvYmouY29tZmlybSl7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQuY29tZmlybSA9IHRydWU7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5jb21maXJtID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5oYXMgPSB0cnVlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQudGV4dCA9IG9iai5tZXM7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNBbGVydC5iYWNrID0gb2JqLmJhY2s7XG5cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kaXNtaXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jQWxlcnQgPSB7fTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LnRleHQgPSAnJztcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmJhY2sgPSAnJztcbiAgICAgICAgICAgICRyb290U2NvcGUuY0FsZXJ0LmhhcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIGFwcC5zZXJ2aWNlKCd0b2FzdCcsIFsnJHJvb3RTY29wZScsICckdGltZW91dCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChtZXMpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QubWVzID0gbWVzO1xuICAgICAgICAgICAgJHJvb3RTY29wZS50b2FzdC5oYXMgPSB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRpc21pc3MgPSBmdW5jdGlvbiAobWVzKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlO1xuICAgICAgICAgICAgaWYgKG1lcykge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9hc3QubWVzID0gbWVzO1xuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS50b2FzdC5oYXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LCA1MDApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS50b2FzdC5oYXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pXG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdjYW52ZXJJbWFnZScsIFtdKTtcbiAgICBhcHAucnVuKFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2UgPSB7XG4gICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgICAgc2hvdzogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZVNob3cgPSBmdW5jdGlvbih1cmwpe1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS51cmwgPSB1cmw7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlLnNob3cgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgICRyb290U2NvcGUuY2FudmVySW1hZ2VDbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNhbnZlckltYWdlLnVybCA9ICcnO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jYW52ZXJJbWFnZS5zaG93ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxjYW52ZXJpbWFnZT48L2NhbnZlcmltYWdlPlwiKTtcbiAgICB9XSk7XG4gICAgYXBwLmRpcmVjdGl2ZSgnY2FudmVyaW1hZ2UnLCBbJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXCI8ZGl2IGNsYXNzPSdjYW52ZXJJbWFnZSBjYW52ZXJJbWFnZS17e2NhbnZlckltYWdlLnNob3d9fScgbmctY2xpY2s9J2NhbnZlckltYWdlQ2xvc2UoKSc+PGRpdj48aW1nIG5nLXNyYz0ne3tjYW52ZXJJbWFnZS51cmx9fScgYWx0PScnPjwvZGl2PjwvZGl2PlwiLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHJzKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbn0pKCk7IiwiYXBwLnNlcnZpY2UoJ3Rvb2xTZXJ2aWNlJywgZnVuY3Rpb24gKCkge1xuXG59KTtcbiIsImFwcC5zZXJ2aWNlKCdhamF4JywgWyckcScsICckaHR0cCcsICckcm9vdFNjb3BlJywgJ1NFUlZFUl9VUkwnLCAnJHN0YXRlJywgJ2NBbGVydCcsICd0b2FzdCcsICdVcGxvYWQnLCBmdW5jdGlvbiAoJHEsICRodHRwLCAkcm9vdFNjb3BlLCBTRVJWRVJfVVJMLCAkc3RhdGUsIGNBbGVydCwgdG9hc3QsIFVwbG9hZCkge1xuICAgIHRoaXMucG9zdCA9IGZ1bmN0aW9uIChwb3N0RGF0YSkge1xuICAgICAgICB2YXIgcmVxID0ge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6IFNFUlZFUl9VUkwgKyBwb3N0RGF0YS51cmwsXG4gICAgICAgICAgICBoZWFkZXJzIDoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnIDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiBwb3N0RGF0YS5kYXRhXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYWpheChyZXEsIHBvc3REYXRhKTtcbiAgICB9O1xuICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKHBvc3REYXRhKSB7XG4gICAgICAgIHZhciByZXEgPSB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgcG9zdERhdGEudXJsLFxuICAgICAgICAgICAgcGFyYW1zOiBwb3N0RGF0YS5kYXRhXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYWpheChyZXEsIHBvc3REYXRhKTtcbiAgICB9XG4gICAgdGhpcy5hamF4ID0gZnVuY3Rpb24gKHJlcSwgcG9zdERhdGEpIHtcbiAgICAgICAgLy9pZihwb3N0RGF0YS50b2FzdCYmJHJvb3RTY29wZS50b2FzdC5oYXMpe1xuICAgICAgICAvLyAgICBhbGVydCgn5LiN6KaB6YeN5aSN5pON5L2cIScpO1xuICAgICAgICAvLyAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgLy99XG4gICAgICAgIGlmIChwb3N0RGF0YS50b2FzdCkge1xuICAgICAgICAgICAgdG9hc3QuY3JlYXRlKHBvc3REYXRhLnRvYXN0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgcHJvbWlzZSA9IGRlZmVyLnByb21pc2U7XG4gICAgICAgICRodHRwKHJlcSkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5jb2RlID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3BvbnNlLmRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5kYXRhLmNvZGUgPT0gMjAyKSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzOiByZXNwb25zZS5kYXRhLm1lc1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiBmYWlsZWQocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbWVzOiAn5pyN5Yqh56uv6ZSZ6K+v77yBJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxuICAgIHRoaXMudXBsb2FkID0gZnVuY3Rpb24gKGZpbGUsIGRhdGEpIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICAvL+acjeWKoeerr+aOpeaUtlxuICAgICAgICAgICAgdXJsOiBTRVJWRVJfVVJMICsgJy91cGxvYWQnLFxuICAgICAgICAgICAgLy/kuIrkvKDnmoTlkIzml7bluKbnmoTlj4LmlbBcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBmaWxlOiBmaWxlXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcC5kYXRhKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBzdGF0dXM6ICcgKyByZXNwLnN0YXR1cyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgICAgICAvLyB2YXIgcHJvZ3Jlc3NQZXJjZW50YWdlID0gcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKTtcbiAgICAgICAgICAgIC8vIGRlZmVycmVkLnJlc29sdmUocHJvZ3Jlc3NQZXJjZW50YWdlKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Byb2dyZXNzOiAnICsgcHJvZ3Jlc3NQZXJjZW50YWdlICsgJyUgJyArIGV2dC5jb25maWcuZGF0YS5maWxlLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn1cbl0pXG47XG4iLCJhcHAuc2VydmljZSgnYXJ0aWNsZVNlcnZpY2UnLCBbJ2FqYXgnLCAnJHEnLCBmdW5jdGlvbiAoYWpheCwgJHEpIHtcbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlJ1xuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICB9XG59XSk7XG5cbiIsImFwcC5zZXJ2aWNlKCdjYXRlZ29yeVNlcnZpY2UnLCBbJ2FqYXgnLCAnJHEnLCBmdW5jdGlvbiAoYWpheCwgJHEpIHtcbiAgICB0aGlzLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBwcm9taXNlID0gZGVmZXIucHJvbWlzZTtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9jYXRlZ29yeSdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTYvMi80LlxuICovXG5hcHAuc2VydmljZSgncmVjb21tZW5kU2VydmljZScsIFsnYWpheCcsICckcScsIGZ1bmN0aW9uIChhamF4LCAkcSkge1xuICAgIHRoaXMubGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHByb21pc2UgPSBkZWZlci5wcm9taXNlO1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3JlY29tbWVuZCdcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufV0pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmRpcmVjdGl2ZShcImNhdGVnb3J5bGlzdFwiLCBbJ2NhdGVnb3J5U2VydmljZScsZnVuY3Rpb24gKGNhdGVnb3J5U2VydmljZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnd3d3L2h0bWwvZGlyZWN0aXZlL2NhdGVnb3J5TGlzdC5odG1sJyxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHIpIHtcbiAgICAgICAgICAgIGNhdGVnb3J5U2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgICAgIHNjb3BlLmxpc3QgPSByZXN1bHRcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSxcbiAgICB9XG59XSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgTGFnZ28gb24gMTEvNS8xNS5cbiAqL1xuYXBwLmRpcmVjdGl2ZShcInJlY29tbWVuZGxpc3RcIiwgWydyZWNvbW1lbmRTZXJ2aWNlJyxmdW5jdGlvbiAocmVjb21tZW5kU2VydmljZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnd3d3L2h0bWwvZGlyZWN0aXZlL3JlY29tbWVuZExpc3QuaHRtbCcsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgIHNjb3BlOiB7XG5cbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGUsIGF0dHIpIHtcbiAgICAgICAgICAgIHJlY29tbWVuZFNlcnZpY2UubGlzdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBzY29wZS5saXN0ID0gcmVzdWx0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0sXG4gICAgfVxufV0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ2FkZEFydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCdTRVJWRVJfVVJMJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSxTRVJWRVJfVVJMKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL2FkZCcsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuYXJ0aWNsZSxcbiAgICAgICAgICAgIHRvYXN0OiBcIua3u+WKoOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygn5re75Yqg5oiQ5YqfIScpO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LmFydGljbGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgJHNjb3BlLnVwbG9hZEltZyA9IGZ1bmN0aW9uKGZpbGUpe1xuICAgICAgICBhamF4LnVwbG9hZChmaWxlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAkc2NvcGUuaW1nUGF0aCA9IFNFUlZFUl9VUkwrXCIvdXBsb2FkL1wiK3Jlc3VsdC5maWxlbmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIH0pXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhcnRpY2xlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCdhcnRpY2xlU2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LGFydGljbGVTZXJ2aWNlKSB7XG5cbiAgICBhcnRpY2xlU2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uKGlkLGluZGV4KXtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9hcnRpY2xlL2RlbCcsXG4gICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgX2lkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3VwZGF0ZUFydGljbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCAnU0VSVkVSX1VSTCcsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlLCBTRVJWRVJfVVJMLCAkc3RhdGVQYXJhbXMpIHtcbiAgICBhamF4LnBvc3Qoe1xuICAgICAgICB1cmw6ICcvYXJ0aWNsZS9xdWVyeScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiAkc3RhdGVQYXJhbXMuaWRcbiAgICAgICAgfSxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5pWw5o2uLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfIScpO1xuICAgICAgICAkc2NvcGUuYXJ0aWNsZSA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmFydGljbGUudXBkYXRlVGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvYXJ0aWNsZS91cGRhdGUnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmFydGljbGUsXG4gICAgICAgICAgICB0b2FzdDogXCLkv67mlLnkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfkv67mlLnmiJDlip8hJyk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuYXJ0aWNsZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9O1xuICAgICRzY29wZS51cGxvYWRJbWcgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBhamF4LnVwbG9hZChmaWxlKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICRzY29wZS5pbWdQYXRoID0gU0VSVkVSX1VSTCArIFwiL3VwbG9hZC9cIiArIHJlc3VsdC5maWxlbmFtZTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FkZENhdGVnb3J5Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsICRzdGF0ZSkge1xuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvY2F0ZWdvcnkvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5jYXRlZ29yeScpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2xpc3RDYXRlZ29yeUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywnY2F0ZWdvcnlTZXJ2aWNlJywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QsY2F0ZWdvcnlTZXJ2aWNlKSB7XG4gICAgY2F0ZWdvcnlTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5saXN0ID0gcmVzdWx0O1xuICAgIH0pXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24gKGlkLCBpbmRleCkge1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2NhdGVnb3J5L2RlbCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgX2lkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufV0pOyIsImFwcC5jb250cm9sbGVyKCdhZGRGcmllbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9mcmllbmQvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5kYXRhLFxuICAgICAgICAgICAgdG9hc3Q6IFwi5re75Yqg5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB0b2FzdC5kaXNtaXNzKCfmt7vliqDmiJDlip8hJyk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xheW91dC5mcmllbmQnKTtcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEhvdSBvbiAxNi8zLzI5LlxuICovXG5hcHAuY29udHJvbGxlcignZnJpZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAnJHN0YXRlJywgJ2NBbGVydCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCAkc3RhdGUsIGNBbGVydCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy9mcmllbmQvcXVlcnknLFxuICAgICAgICB0b2FzdDogXCJkby4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICRzY29wZS5yZXN1bHREYXRhID0gcmVzdWx0O1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCdlbmQuLiEnKTtcbiAgICAgICAgJHN0YXRlLmdvKCdsYXlvdXQuZnJpZW5kJyk7XG4gICAgfSlcblxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbiAgICAgICAgY0FsZXJ0LmNyZWF0ZSh7XG4gICAgICAgICAgICBtZXM6ICfmmK/lkKbnoa7orqTliKDpmaQhJyxcbiAgICAgICAgICAgIGNvbWZpcm06IHRydWUsXG4gICAgICAgICAgICBiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2ZyaWVuZC9kZWwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgICAgICAgICAgfSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0RGF0YS5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG59XSk7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgZ3h4IG9uIDIwMTYvMS8yOC5cbiAqL1xuYXBwLmNvbnRyb2xsZXIoJ21hbmFnZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbn1dKTtcbiIsImFwcC5jb250cm9sbGVyKCdhZGRSZWNvbW1lbmRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQvYWRkJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAkc2NvcGUubmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LnJlY29tbWVuZCcpO1xuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigncmVjb21tZW5kQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ2FqYXgnLCAndG9hc3QnLCAncmVjb21tZW5kU2VydmljZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIHRvYXN0LCByZWNvbW1lbmRTZXJ2aWNlKSB7XG4gICAgcmVjb21tZW5kU2VydmljZS5saXN0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAkc2NvcGUubGlzdCA9IHJlc3VsdDtcbiAgICB9KVxuXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uIChpZCwgaW5kZXgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmQvZGVsJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9hc3Q6IFwi5Yig6Zmk5LitLi4uXCJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ2FkZFVzZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICd0b2FzdCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhamF4LCB0b2FzdCwgJHN0YXRlKSB7XG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy91c2Vycy9hZGQnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6ICRzY29wZS5uYW1lLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2FzdDogXCLmt7vliqDkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRvYXN0LmRpc21pc3MoJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbGF5b3V0LnVzZXInKVxuICAgICAgICB9KVxuICAgIH1cbn1dKTsiLCJhcHAuY29udHJvbGxlcigndXNlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICdhamF4JywgJ3RvYXN0JywgZnVuY3Rpb24gKCRzY29wZSwgYWpheCwgdG9hc3QpIHtcbiAgICBhamF4LnBvc3Qoe1xuICAgICAgICB1cmw6ICcvdXNlcnMnXG4gICAgfSkudGhlbihcbiAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgJHNjb3BlLmxpc3QgPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICApXG5cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaWQsaW5kZXgpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL3VzZXJzL2RlbCcsXG4gICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgX2lkOiBpZFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvYXN0OiBcIuWIoOmZpOS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdG9hc3QuZGlzbWlzcygnT0shJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3Quc3BsaWNlKGluZGV4LDEpXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbn1dKTsiLCJhcHAuY29udHJvbGxlcignaW5mb3JtYXRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICdjQWxlcnQnLCd0b2FzdCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIGNBbGVydCx0b2FzdCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy9pbmZvcm1hdGlvbi9xdWVyeScsXG4gICAgICAgIHRvYXN0OiBcIuiOt+WPluS4rS4uLlwiXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAkc2NvcGUuaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgdG9hc3QuZGlzbWlzcygn6I635Y+W5oiQ5YqfJyk7XG4gICAgfSlcblxuICAgICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBhamF4LnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnL2luZm9ybWF0aW9uL3NldCcsXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuaW5mbyxcbiAgICAgICAgICAgIHRvYXN0OiBcIuS/ruaUueS4rS4uLlwiXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgIGNBbGVydC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgIG1lczon5L+u5pS55oiQ5YqfJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59XSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3dlYkluZm9Db250cm9sbGVyJywgWyckc2NvcGUnLCAnYWpheCcsICdjQWxlcnQnLCd0b2FzdCcsIGZ1bmN0aW9uICgkc2NvcGUsIGFqYXgsIGNBbGVydCx0b2FzdCkge1xuICAgIGFqYXgucG9zdCh7XG4gICAgICAgIHVybDogJy93ZWJpbmZvL3F1ZXJ5JyxcbiAgICAgICAgdG9hc3Q6IFwi6I635Y+W5LitLi4uXCJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICRzY29wZS5pbmZvID0gcmVzdWx0O1xuICAgICAgICB0b2FzdC5kaXNtaXNzKCfojrflj5bmiJDlip8nKTtcbiAgICB9KVxuXG4gICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICB1cmw6ICcvd2ViaW5mby9zZXQnLFxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLmluZm8sXG4gICAgICAgICAgICB0b2FzdDogXCLkv67mlLnkuK0uLi5cIlxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICBjQWxlcnQuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICBtZXM6J+S/ruaUueaIkOWKnydcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
