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

    connect: {
      server: {
        options: {
          port: 9001,
          base: '.',
          livereload: true,
          open: {
            callback: function() {
              var baseUrl = grunt.config.process('http://localhost:<%= connect.server.options.port%>');
              var demoUrl = baseUrl + "/demo/";
              console.log("Server started! View demo at " + demoUrl);
            }
          }
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>', 'demo/**'],
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

	grunt.registerTask("default", ["jshint", "concat", "uglify"]);
	grunt.registerTask("travis", ["jshint"]);

	grunt.registerTask("serve", ["default", "connect", "watch"]);

};
