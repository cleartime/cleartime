/**
 * Created by gxx on 16/5/27.
 */
var express = require('express');
var app = express();
var todos = require('./todos');
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', 1)
app.use('/todos', todos);
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', 2)
