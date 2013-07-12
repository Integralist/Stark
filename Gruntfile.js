module.exports = function (grunt) {

    /*
        Project Dependencies:
        ---------------------
            npm install grunt --save-dev
            npm install grunt-contrib-watch --save-dev
            npm install grunt-contrib-uglify --save-dev
            npm install grunt-contrib-stylus --save-dev
            npm install requirejs --save-dev
    */

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        stylus: {
            compile: {
                options: {
                    // TODO: write custom task to update these two values before calling the task
                    // For now, to avoid code from being compressed, use the --debug flag like so: `grunt stylus --debug`
                    compress: true,
                    linenos: false,
                    urlfunc: 'embedurl' // use embedurl('test.png') in our code to trigger Data URI embedding
                },
                files: {
                    './styles/test/project.css': './styles/stylus/project.styl',
                    './styles/test/project-ie.css': './styles/stylus/project-ie.styl'
                }
            }
        },

        watch: {
            stylus: {
                files: ['./styles/stylus/**/*.styl'],
                tasks: ['stylus']
            }
        }

    });

    // Load NPM Tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    require('./grunt-customtasks.js')(grunt);

    grunt.registerTask('build', ['get-components']);
    
};