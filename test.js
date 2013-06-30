#!/usr/bin/env node

var requirejs = require('requirejs');

/*
var config = {
    baseUrl: './',
    modules: [
        { name: 'testing-bootstrap' },
        { name: 'testing-bootstrap2', exclude: ['testing3'] }
    ],
    dir: './testing-min/',
    optimize: 'none',
    removeCombined: true
};
*/

var config = {
    paths: { jquery: 'libs/jquery' },
    fileExclusionRegExp: /^\.|node_modules|Gruntfile|grunt-|libs|\.md|package.json/,
    baseUrl: './',
    modules: [
        { 
            name: 'bootstrap-about', 
            exclude: ['app'], 
            include: ['components/world/component'], 
            insertRequire: ['components/world/component'] 
        },
        { 
            name: 'bootstrap-index', 
            exclude: ['app'], 
            include: ['components/hello/component', 'components/world/component'], 
            insertRequire: ['components/hello/component', 'components/world/component'] 
        }
    ],
    dir: './release/',
    optimize: 'none',
    removeCombined: true,
    onBuildRead: function (moduleName, path, contents) {
        if (path.indexOf('bootstrap-') !== -1 || path.indexOf('/app.js') !== -1) {
            return '';
        } else {
            return contents;
        }
    }
};

requirejs.optimize(config, function(details){
    console.log(details);
});