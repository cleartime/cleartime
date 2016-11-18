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