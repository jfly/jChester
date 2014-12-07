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

    symlink: {
      node_modules: {
        // dest -> src
        dest: 'dist/node_modules',
        src: 'node_modules'
      },
      gitignore: {
        // dest -> src
        dest: 'dist/.gitignore',
        src: '.gitignore'
      },
    },

    includereplace: {
      jqueryLocal: {
        options: {
          globals: {
            jquerySrc: '/node_modules/jquery/dist/jquery.js',
            extraHead: '',
          },
        },
        files: [
          {src: '**/*.html', dest: 'dist/', expand: true, cwd: 'demo'},
        ],
      },
      jqueryRemote: {
        options: {
          globals: {
            jquerySrc: '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
            extraHead: "<!-- Google Analytics --> <script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-54067213-1', 'auto'); ga('send', 'pageview'); </script>",
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
      tasks: ['default'],
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
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.registerTask("everythingButHtml", ["symlink", "jshint", "concat", "uglify"]);
  grunt.registerTask("default", ["everythingButHtml", "includereplace:jqueryLocal"]);
  grunt.registerTask("travis", ["jshint"]);

  grunt.registerTask("serve", ["default", "connect", "watch"]);
  grunt.registerTask("publish", ["everythingButHtml", "includereplace:jqueryRemote", "gh-pages"]);

};
