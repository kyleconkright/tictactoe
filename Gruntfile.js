module.exports = function(grunt) {

  // Project configuration.
  	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

	    sass: {
	    	dist: {
		      	options: {
		        	style: 'compressed'
		      	},
		      	files: {
		        	'tmp/style.css': 'scss/style.scss'
		      	}
		    }
		},
		cssmin: {
		  	combine: {
		    	files: {
		      		'tmp/style.min.css': ['tmp/style.css']
		    	}
		  	}
		},
		autoprefixer: {
            dist: {
                files: {
                    'css/style.min.css':['tmp/style.min.css']
                }
            }
        },
	    watch: {
	     	css: {
	        	files: 'scss/*.scss',
	        	tasks: ['sass','cssmin','autoprefixer'],
	        	options: {
	          		livereload: true,
	        	},
	      	}
	    }

  	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-autoprefixer');
  
  

  // Default task(s).
  grunt.registerTask('default', ['watch','sass','cssmin','autoprefixer']);

};
