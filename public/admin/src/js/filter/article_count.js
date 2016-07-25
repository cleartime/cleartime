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