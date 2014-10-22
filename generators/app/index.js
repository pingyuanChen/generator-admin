'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('yeoman-generator/node_modules/lodash');


var fileUtil = require('../../lib/file');
var angularUtil = require('../../lib/util');

var Generator = module.exports = function Generator(){
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);


Generator.prototype.askForAppConfig = function askForAppConfig() {
  var done = this.async();
  // Have Yeoman greet the user.
  this.log(yosay('Welcome to the AngularAdmin generator!'));

  var prompts = [{
    name: 'configFile',
    message: 'Configuration file',
    default: 'config.json'
  }];

  this.prompt(prompts, function(props) {
    this.configFile = props.configFile;

    done();
  }.bind(this));
};

Generator.prototype.createCommon = function createCommon() {
  debugger;
  var _this = this,
    appDir,
    cmdDir = process.cwd();

  this.config = JSON.parse(this.readFileAsString(path.join(cmdDir, this.configFile)));

  //全局app相关配置
  _.extend(this, this.config);
  this.capitalAppName = _.capitalize(_.camelize(this.appName));
  appDir = path.join(cmdDir, './'+this.appName);

  this.mkdir(appDir);//生成项目目录
  fileUtil.copyDirectory(path.join(__dirname, '../templates/common'), appDir);//拷贝admin的核心框架
  //根据config.json配置项生成基础框架
  _this.template(appDir+'/client/_package.json', appDir+'/client/package.json');
  _this.template(appDir+'/client/src/app/_app.config.module.js', appDir+'/client/src/app/app.config.module.js');
  fs.unlinkSync(appDir+'/client/_package.json');
  fs.unlinkSync(appDir+'/client/src/app/_app.config.module.js');
};


Generator.prototype.createModel = function createModel() {
  debugger;
  var _this = this,
    cmdDir = process.cwd(),
    modelConfigPath = path.join(cmdDir, './config'),
    templatesDir = path.join(__dirname, '../templates'),
    appDir = path.join(cmdDir, './'+this.appName),
    modelList = fileUtil.getFilesInDirectory(modelConfigPath);//读取所有model的配置文件


  //配置模板路径
  _this.sourceRoot(path.join(__dirname, '../templates'));

  //读取所有model的配置文件，并生成相应的view、controller...
  modelList.forEach(function(model){
    var modelConfig = JSON.parse(_this.readFileAsString(path.join(model)));

    _.extend(_this, angularUtil.updateModelConfig(modelConfig));
    angularUtil.createModel(_this, appDir, templatesDir);
  });
};

Generator.prototype.injectToModule = function injectToModule() {
  var _this = this,
    cmdDir = process.cwd(),
    modelConfigPath = path.join(cmdDir, './config'),
    templatesDir = path.join(__dirname, '../templates'),
    appDir = path.join(cmdDir, './'+this.appName),
    modelList = fileUtil.getFilesInDirectory(modelConfigPath);//读取所有model的配置文件

  this.conflicter.resolve(function (err) {
    modelList.forEach(function(model){
      var modelConfig = JSON.parse(_this.readFileAsString(path.join(model)));

      _.extend(_this, angularUtil.updateModelConfig(modelConfig));
      angularUtil.injectToModule(_this, appDir, templatesDir);
    });
    
    angularUtil.gruntTask(
      [
        appDir+'/**/*.js',
        '!'+appDir+'/client/src/app/common/**/*.js',
        '!'+appDir+'/client/src/app/server/**/*.js',
        '!'+appDir+'/client/node_modules/**/*.js'
      ],
      [
        appDir+'/client/src/css/app.css',
        appDir+'/client/src/scss/app.scss',
      ]);
  });

};

