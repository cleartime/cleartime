/**
 * Created by gxx on 16/5/27.
 */
var express = require('express');
var app = express();
var todos = require('./todos');
console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++',todos)

app.use('/todos', todos);
