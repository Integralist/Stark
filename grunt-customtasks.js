module.exports = function (grunt) {

    grunt.registerTask('noop', 'A no-operation task -> useful in testing situations', function() {
        console.log('noop run');
    });

    grunt.registerTask('get-components', 'Parse each HTML file for components', function() {
        var pages = grunt.file.expand('./*.html'),
            config = {
                compile: {
                    /*
                        For full list of options see:
                        https://github.com/jrburke/r.js/blob/master/build/example.build.js 
                     */
                    options: {
                        baseUrl: './',
                        dir: './release/',
                        paths: {
                            jquery: 'libs/jquery'
                        },
                        fileExclusionRegExp: /^\.|node_modules|Gruntfile|\.md|package.json/,
                        optimize: 'none',
                        removeCombined: true,
                        onBuildRead: function (moduleName, path, contents) {
                            // console.log(moduleName, path, contents);
                            return contents;
                        }
                    }
                }
            };

        pages = pages.map(function(page) {
            var content = grunt.file.read(page),
                pattern = /data-component="([^"]+)"/gmi;

            content = content.match(pattern).map(function(module) {
                return 'libs/' + module.split('"')[1] + '/component';
            });

            return {
                name: 'bootstrap-' + /\.\/([^.]+)/.exec(page)[1],
                include: content
            };
        });

        config.compile.options.modules = pages;

        console.log(config.compile.options.paths);

        grunt.config.set('requirejs', config);
        grunt.task.run('requirejs');
    });

};