﻿module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            build: {
                src: ['src/main/ts/**/*.ts', 'src/main/d.ts/**/*.d.ts'],
                dest: 'build/<%= pkg.name %>.js',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es3', //or es3
                    base_path: 'src/main/ts',
                    sourcemap: true,
                    declaration: true
                }
            }
        },
        clean: {
            all:["build", "dist", "dist.zip"]
        },
        uglify: {
            dist: {
                files: {
                    'dist/out.min.js': ['build/<%= pkg.name %>.js'],
                    // compress handlebars
                    'dist/lib/handlebars-v1.1.2.min.js': ['lib/handlebars-v1.1.2.js']
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {expand: true, src: ['lib/*.min.js'], dest: 'dist/'},
                    {expand: true, src: ['*.css'], dest: 'dist/'},
                    {expand: true, src: ['*.html'], dest: 'dist/'}
                ]
            }
        },
        replace: {
            dist: {
                src: ['dist/*.html'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: /build\/out/g,
                    to: "out"
                },{
                    from: /.js/g,
                    to: ".min.js"
                }]
            }
        },
        zip: {
            dist: {
                router: function (filepath) {
                    // Route each file to all/{{filename}}
                    var s = 'dist/';
                    var index = filepath.indexOf(s);
                    var result;
                    if( index == 0 ) {
                        result = filepath.substring(s.length + index);
                    } else {
                        result = filepath;
                    }
                    return result;
                },
                src: ['dist/**'],
                dest: 'dist.zip'
            }
        }
    });

    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that provides the "TS" task.
    grunt.loadNpmTasks('grunt-typescript');
    // zip
    grunt.loadNpmTasks('grunt-zip');
    // copy
    grunt.loadNpmTasks('grunt-contrib-copy');
    // replace text in file
    grunt.loadNpmTasks('grunt-text-replace');

    // Default task(s).
    grunt.registerTask('reset', ['clean']);
    grunt.registerTask('dist', ['typescript', 'uglify', 'copy', 'replace', 'zip']);
    grunt.registerTask('default', ['typescript']);

};