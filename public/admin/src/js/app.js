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