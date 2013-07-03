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
        function processScriptContent(script) {
            return grunt.file.read(script).replace(/require\(\[(.+)\]\);/gi, function(match, cg) {
                var modules = cg.split(','),
                    numberOfModules = modules.length,
                    indexOfFirstComponent = 0, 
                    temp = modules.forEach(function(value, index) {
                        if (/components\/[a-z-.]+\/component/i.test(value) && indexOfFirstComponent === 0) {
                            indexOfFirstComponent = index;
                        }
                    }), 
                    alphabet = 'abcdefghijklmnopqrstuvwxyz', 
                    components = '(', 
                    i = 0;

                // Construct our arguments...
                while (i < numberOfModules) { components += alphabet[i] + ','; i++; }
                components = components.substring(0, components.length-1);
                components += '){';

                // Construct our components...
                i = indexOfFirstComponent;
                while (i < numberOfModules) { components += alphabet[i] + '.init();'; i++; }
                components += '}';

                return 'require([' + cg + '], function' + components + ');';
            });
        }

        function initialiseComponents() {
            var scripts = grunt.file.expand('./release/bootstrap-*.js');

            scripts.forEach(function(script) {
                grunt.file.write(script, processScriptContent(script));
            });
        }

        function cleanUp() {
            grunt.file.delete('./release/app.js');
            grunt.file.delete('./release/build.txt');
        }

        var done = this.async(),
            requirejs = require('requirejs');

        // console.log('\n', requirejs_config);

        requirejs.optimize(requirejs_config, function (details) {
            console.log('\nBUILD SUCCESSFUL...');
            console.log(details);
            initialiseComponents();
            cleanUp();
            done();
        }, function(err) {
            console.log('\nBUILD FAILED...');
            console.log(err);
            done();
        });
    });

};