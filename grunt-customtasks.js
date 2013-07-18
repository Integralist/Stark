module.exports = function (grunt) {

    var requirejs_config;

    grunt.registerTask('noop', 'A no-operation task -> useful in testing situations', function() {
        console.log('noop run');
    });

    grunt.registerTask('get-components', 'Parse each HTML file for components', function() {
        var _ = require('lodash'),
            storedModules = [];

        function parsePageName(page) {
            return /\.\/([\w-]+)\.html/.exec(page)[1];
        }

        function getModules(page) {
            var pattern = /data-component="([^"]+)"/gmi,
                content = grunt.file.read(page),
                match   = content.match(pattern);

            if (!match) {
                return;
            }

            return match.map(function(module) {
                return 'components/' + module.split('"')[1] + '/component';
            });
        }

        function getExtensions(page) {
            var i                        = -1,
                extensionPattern         = /app.use\((?:'[a-z-.]+'(?:,\s*)?)+\);/gmi,
                extensionCapturedPattern = /app.use\('([a-z-.]+)'(?:\s*,\s*'([a-z-.]+)')*\);/gmi,
                fileContent              = grunt.file.read('./bootstrap-' + parsePageName(page) + '.js'),
                match                    = fileContent.match(extensionPattern),
                extensions               = [],
                capturedExtensions       = extensionCapturedPattern.exec(fileContent).splice(1).filter(function(item){
                    // filter out an undefined values
                    if (item) {
                        return true;
                    }
                });

            if (match) {
                while (++i < capturedExtensions.length) {
                    extensions.push('extensions/' + capturedExtensions[i] + '/extension');
                }

                return extensions;
            }
        }

        function buildComponentsList() {
            var app_start = 'window.app={',
                app_end = '};',
                components_start = 'components:{',
                components_end = '}',
                globalProperty;
            
            storedModules = _.uniq(storedModules); // remove duplicate items

            storedModules = storedModules.map(function(item) {
                var componentName = /components\/(.+)\/component/.exec(item);
                return '"' + componentName[1] + '": document.getElementById("js-component-' + componentName[1] + '")';
            });

            globalProperty = app_start + components_start + storedModules.join(',') + components_end + app_end;

            return globalProperty;
        }

        function buildConfig() {
            var pages = grunt.file.expand('./*.html'),
                setWindowApp = false;

            pages = _.compact(pages.map(function(page) {
                var modules = getModules(page);

                if (!modules) {
                    return;
                }

                var extensions = getExtensions(page),
                    toBeLoaded = modules;

                if (extensions) {
                    toBeLoaded = extensions.concat(modules);
                }

                storedModules = storedModules.concat(modules);

                return {
                    name: 'bootstrap-' + /\.\/([^.]+)/.exec(page)[1],
                    exclude: ['app'],
                    include: toBeLoaded,
                    insertRequire: toBeLoaded
                };
            }));

            // For full list of options see:
            // https://github.com/jrburke/r.js/blob/master/build/example.build.js
            requirejs_config = {
                baseUrl: './',
                dir: 'release',
                paths: {
                    jquery: 'libs/jquery'
                },
                fileExclusionRegExp: /^\.|node_modules|Gruntfile|grunt-|\.md|package.json/,
                optimize: 'none',
                removeCombined: true,
                modules: pages,
                wrap: {
                    start: buildComponentsList()
                },
                onBuildRead: function (moduleName, path, contents) {
                    if (path.indexOf('bootstrap-') !== -1 || path.indexOf('/app.js') !== -1) { // we purposely want to avoid including any modules that match this condition
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
            var modulesCapturedPattern = /require\(\[(.+)\]\);/gi,
                componentPattern       = /components\/[a-z-.]+\/component/i;

            return grunt.file.read(script).replace(modulesCapturedPattern, function(match, cg) {
                var modules = cg.split(','),
                    numberOfModules = modules.length,
                    indexOfFirstComponent = 0, 
                    alphabet = 'abcdefghijklmnopqrstuvwxyz', 
                    components = '(', 
                    i = 0;

                // Find Array index of our first component module...
                modules.forEach(function(value, index) {
                    if (componentPattern.test(value) && indexOfFirstComponent === 0) {
                        indexOfFirstComponent = index;
                    }
                });

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
            grunt.file.delete('./release/configuration.js');
        }

        function optimisationSuccess(details) {
            console.log('\nBUILD SUCCESSFUL...');
            console.log(details);
            initialiseComponents();
            cleanUp();
            done();
        }

        function optimisationError(err) {
            console.log('\nBUILD FAILED...');
            console.log(err);
            done();
        }

        var done = this.async(),
            requirejs = require('requirejs');

        // console.log('\n', requirejs_config);

        requirejs.optimize(requirejs_config, optimisationSuccess, optimisationError);
    });

};