module.exports = function (grunt) {

    var requirejs_config;

    grunt.registerTask('noop', 'A no-operation task -> useful in testing situations', function() {
        console.log('noop run');
    });

    grunt.registerTask('get-components', 'Parse each HTML file for components', function() {
        function parsePageName(page) {
            return /\.\/(\w+)\.html/.exec(page)[1];
        }

        function getModules(page) {
            var pattern = /data-component="([^"]+)"/gmi,
                content = grunt.file.read(page);

            return content.match(pattern).map(function(module) {
                return 'components/' + module.split('"')[1] + '/component';
            });
        }

        function getExtensions(page) {
            var extensions = grunt.file.read('./bootstrap-' + parsePageName(page) + '.js'),
                match = extensions.match(/app.use\('[a-z-.]+'\);/gmi);
            
            if (match) {
                return match.map(function(){
                    return 'extensions/' + /app.use\('([a-z-.]+)'\);/gmi.exec(extensions)[1] + '/extension';
                });
            }
        }

        function buildConfig() {
            var pages = grunt.file.expand('./*.html');

            pages = pages.map(function(page) {
                var modules    = getModules(page),
                    extensions = getExtensions(page),
                    toBeLoaded = modules;

                if (extensions) {
                    toBeLoaded = extensions.concat(modules);
                }

                return {
                    name: 'bootstrap-' + /\.\/([^.]+)/.exec(page)[1],
                    exclude: ['app'],
                    include: toBeLoaded,
                    insertRequire: toBeLoaded
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
                fileExclusionRegExp: /^\.|node_modules|Gruntfile|grunt-|libs|\.md|package.json/,
                optimize: 'none',
                removeCombined: true,
                modules: pages,
                onBuildRead: function (moduleName, path, contents) {
                    if (path.indexOf('bootstrap-') !== -1 || path.indexOf('/app.js') !== -1) {
                        return '';
                    } else {
                        return contents;
                    }
                }
            };
        }

        buildConfig();

        grunt.task.run('requirejs');
    });

    grunt.registerTask('requirejs', 'build our application using r.js', function(){
        var done = this.async(),
            requirejs = require('requirejs');

        // console.log('\n', requirejs_config);

        requirejs.optimize(requirejs_config, function (details) {
            console.log('\nBUILD SUCCESSFUL...');
            console.log(details);
            done();
        }, function(err) {
            console.log('\nBUILD FAILED...');
            console.log(err);
            done();
        });
    });

};