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
