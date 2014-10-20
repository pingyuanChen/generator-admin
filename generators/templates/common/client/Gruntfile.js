module.exports = function(grunt) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  /**
   * Load in our build configuration file.
   */
  var userConfig = {
    buildDir: './build',
    srcDir: './www',
    vendorFiles: {
      js: [
        "lib/headjs/dist/1.0.0/head.load.min.js",
        "lib/jquery/dist/jquery.min.js",
        "lib/angular/angular.min.js",
        "lib/angular-sanitize/angular-sanitize.min.js",
        "lib/angular-ui-router/release/angular-ui-router.min.js",
        "lib/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "lib/ng-table/ng-table.min.js",
        "lib/toastr/toastr.min.js",
        "lib/requirejs/require.js",
        "lib/underscore/underscore.js",
        "lib/highcharts-release/highcharts.js",
        "lib/requirejs-domready/domReady.js",
        "lib/requirejs-text/text.js"
      ],
      css: [
        "lib/toastr/toastr.min.css",
        "lib/bootstrap/dist/css/bootstrap.min.css",
        'lib/bootstrap/dist/fonts/**/*.*',
        "lib/font-awesome/css/font-awesome.min.css",
        'lib/font-awesome/fonts/**/*.*'
      ]
    }
  };
  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and version. It's already there, so
     * we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),
    /**
     * The banner is the comment that is placed at the top of our compiled source files. It is first processed
     * as a Grunt template, where the `<%=` pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' + ' * @appName    <%= pkg.name %>\n' + ' * @version    <%= pkg.version %>\n' + ' * @date       <%= grunt.template.today("yyyy-mm-dd") %>\n' + ' * @homepage   <%= pkg.homepage %>\n' + ' * @copyright  <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' + ' */\n'
    },
    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      src: ['<%= distDir %>'],
      options: {
        force: true
      }
    },
    /**
     * The `copy` task just copies files from A to B. We use it here to copy our project assets
     * (images, fonts, etc.) and javascripts into `distDir`, and then to copy the assets to `compileDir`.
     */
    copy: {
      html: {
        files: [{
          src: ['**/*.html'],
          cwd: '<%= srcDir %>/',
          dest: '<%= distDir %>/',
          expand: true
        }]
      },
      build_assets: {
        files: [{
          src: ['css/**', 'assets/**'],
          cwd: '<%= srcDir %>/',
          dest: '<%= distDir %>/',
          expand: true
        }]
      },
      boot: {
        src: '<%= srcDir %>/boot.js',
        dest: '<%= buildDir %>/boot.js'
      },
      build_vendors: {
        files: [{
          src: userConfig.vendorFiles.js.concat(userConfig.vendorFiles.css),
          cwd: '<%= srcDir %>',
          dest: '<%= buildDir %>',
          expand: true
        }]
      },
      build_dev_config: {
        src: '<%= srcDir %>/app.config.js',
        dest: '<%= distDir %>/app.config.js'
      },
      build_release_config: {
        src: '<%= srcDir %>/app.config.js',
        dest: '<%= distDir %>/app.config.js',
        options: {
          process: function(content, srcpath){
            return content.replace(/\'ENV\'*\'development\'/i, '"ENV"\, "release"');
          }
        }
      },
    },
    sass: { // Task
      dev: { // Target
        options: { // Target options
          // style: 'compressed'
          "line-comments": true,
          "line-numbers":  true,
          style: 'expended'
        },
        files: { // Dictionary of files
          'src/css/app.css': 'src/scss/app.scss', // 'destination': 'source'
        }
      },
      release: { // Target
        options: { // Target options
          style: 'compressed'
        },
        files: { // Dictionary of files
          'src/css/app.css': 'src/scss/app.scss', // 'destination': 'source'
        }
      }
    },
    watch: {
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass:dev'],
        options: {
          spawn: false,
        },
      },
    },
    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    /**
     * `jshint` defines the rules of our linter as well as which files we should check. This file, all javascript
     * sources, and all our unit tests are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation point (!); this is useful when code comes
     * from a third party but is nonetheless inside `src/`.
     */
    // jshint: {
    //     src: [
    //         '<%= appFiles.js %>'
    //     ],
    //     test: [
    //         '<%= appFiles.jsunit %>'
    //     ],
    //     scenario: [
    //         '<%= appFiles.jsscenario %>'
    //     ],
    //     gruntfile: [
    //         'Gruntfile.js'
    //     ],
    //     options: {
    //         curly: true,
    //         immed: true,
    //         newcap: true,
    //         noarg: true,
    //         sub: true,
    //         boss: true,
    //         eqnull: true
    //     },
    //     globals: {}
    // },
    /**
     * Minifies RJS files and makes it production ready
     * Build files are minified and encapsulated using RJS Optimizer plugin
     */
    requirejs: {
      compile: {
        options: {
          baseUrl: "<%= srcDir %>/app",
          paths: {
            'domReady': '../vendor/requirejs-domready/domReady',
            'text': '../vendor/requirejs-text/text'
          },
          out: '<%= distDir %>/app/bootstrap.js',
          name: 'bootstrap'
        },
        preserveLicenseComments: false,
        optimize: "uglify"
      }
    }
  };
  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Register Tasks
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  grunt.registerTask("dev", ['clean:src', 'sass:release','copy:build_assets', 'copy:build_vendors', 'copy:build_dev_config', 'copy:html', 'copy:boot', "requirejs"]);

  grunt.registerTask("release", ['clean:src', 'sass:release','copy:build_assets', 'copy:build_vendors', 'copy:build_release_config', 'copy:html', 'copy:boot', "requirejs"]);
};