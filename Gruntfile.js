module.exports = function(grunt) {

  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON("package.json"),

    // Banner definitions
    meta: {
      banner: "/*\n" +
        " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
        " *  <%= pkg.description %>\n" +
        " *  <%= pkg.homepage %>\n" +
        " *\n" +
        " *  Made by <%= pkg.author.name %>\n" +
        " *  Under <%= pkg.licenses[0].type %> License\n" +
        " */\n"
    },

    // Concat definitions
    concat: {
      dist: {
        src: ["src/**/*.js"],
        dest: "dist/<%= pkg.name %>.js"
      },
      options: {
        banner: "<%= meta.banner %>"
      }
    },

    // Lint definitions
    jshint: {
      files: ["Gruntfile.js", "src/**/*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    // Minify definitions
    uglify: {
      options: {
        banner: "<%= meta.banner %>"
      },
      my_target: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    includereplace: {
      jquery: {
        options: {
          globals: {
            jquerySrc: '/node_modules/jquery/dist/jquery.js',//<<<
          },
        },
        files: [
          {src: '**/*.html', dest: 'dist/', expand: true, cwd: 'demo'},
        ],
      }
    },

    'gh-pages': {
      options: {
        base: 'dist',
        push: false,
        tag: 'v<%= pkg.version %>',
        message: 'Commiting version v<%= pkg.version %>'
      },
      src: ['**', '.gitignore']
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dist',
          livereload: true,
          open: {
            callback: function() {
              var baseUrl = grunt.config.process('http://localhost:<%= connect.server.options.port%>');
              var demoUrl = baseUrl;
              console.log("Server started! View demo at " + demoUrl);
            }
          }
        }
      }
    },

    watch: {
      files: ['src/**', 'demo/**'],
      tasks: ['jshint', 'default'],
      options: {
        livereload: true,
      }
    },

  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask("default", ["jshint", "concat", "uglify", "includereplace"]);
  grunt.registerTask("travis", ["jshint"]);

  grunt.registerTask("serve", ["default", "connect", "watch"]);
  grunt.registerTask("publish", ["default", "gh-pages"]);

};
