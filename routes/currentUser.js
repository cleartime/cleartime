/**
 * Created by gxx on 16/6/8.
 */
var AV = require('leanengine');

var currentUser = AV.User.current();


module.exports = currentUser;


