module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    run: {
      server: {
        args: ['./server/index.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server/index.js'
      }
    },

    // TODO: add all other file paths that should be linted
    eslint: {
      target: [
        'server/**/*.js'
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    watch: {
      scripts: {
        files: [
          // TODO: Client side file paths will go here
        ],
        tasks: [
          'eslint'
          // TODO: will we want to concat and minify??
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('server-dev', function(target) {
    grunt.task.run(['nodemon', 'watch']);
  });

  grunt.registerTask('start-prod', function(target) {
    grunt.task.run(['run']);
  });

  //TODO: FILL OUT THE REST OF THESE TASKS

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'eslint', 'test'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('dev')) {
      grunt.task.run([ 'server-dev' ]);
    } else {
      grunt.task.run([ 'start-prod' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    // if (grunt.option('prod')) {
    //   grunt.task.run(['gitpush']);
    // } else {
    //   grunt.task.run([ 'build', 'concat', 'uglify']);
    // }
  });


};