/**
 * Created by Laggo on 11/4/15.
 */
var config = {
    'SERVER_URL' : 'http://192.168.1.110:3000'
};
for(item in config){
    app.constant(item,config[item])
}