module.exports = function (grunt) {

    /*
        Project Dependencies:
        ---------------------
            npm install grunt --save-dev
            npm install grunt-contrib-watch --save-dev
            npm install grunt-contrib-uglify --save-dev
            npm install grunt-contrib-sass --save-dev
            npm install requirejs --save-dev
            npm install lodash --save-dev
    */

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            compile: {
                options: {
                    style: 'expanded'
                },
                expand: true,
                cwd: './styles/sass/',
                src: ['*.scss'],
                dest: './styles/',
                ext: '.css'
            }
        },

        watch: {
            sass: {
                files: ['./styles/sass/**/*.scss'],
                tasks: ['sass']
            }
        }

    });

    // Load NPM Tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    require('./grunt-customtasks.js')(grunt);

    grunt.registerTask('build', ['get-components']);
    
};