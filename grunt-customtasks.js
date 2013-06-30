module.exports = function (grunt) {

    var requirejs_config;

    grunt.registerTask('noop', 'A no-operation task -> useful in testing situations', function() {
        console.log('noop run');
    });

    grunt.registerTask('get-components', 'Parse each HTML file for components', function() {
        var pages = grunt.file.expand('./*.html');

        pages = pages.map(function(page) {
            var content = grunt.file.read(page),
                pattern = /data-component="([^"]+)"/gmi;

            content = content.match(pattern).map(function(module) {
                return 'components/' + module.split('"')[1] + '/component';
            });

            return {
                name: 'bootstrap-' + /\.\/([^.]+)/.exec(page)[1],
                include: content
            };
        });

        // For full list of options see:
        // https://github.com/jrburke/r.js/blob/master/build/example.build.js
        requirejs_config = {
            baseUrl: './',
            dir: './release/',
            paths: {
                jquery: 'libs/jquery'
            },
            fileExclusionRegExp: /^\.|node_modules|Gruntfile|\.md|package.json/,
            optimize: 'none',
            removeCombined: true,
            modules: pages
        };

        grunt.task.run('requirejs');
    });

    grunt.registerTask('requirejs', 'build our application using r.js', function(){
        var requirejs = require('requirejs');

        requirejs.optimize(requirejs_config, function (details) {
            console.log(details);
        }, function(err) {
            console.warn(err);
        });
    });

};