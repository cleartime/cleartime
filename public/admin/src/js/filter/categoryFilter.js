app.filter('categoryType', ['categoryService', function (categoryService) {
    return function categoryType(cod) {
        return cod
    }
}]);