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
  yeoman.generators.NamedBase.apply(this, arguments);

  this.modelName = this.name;
};

util.inherits(Generator, yeoman.generators.NamedBase);


Generator.prototype.askForAppConfig = function askForAppConfig() {
  var done = this.async();
  // Have Yeoman greet the user.
  this.log(yosay('Welcome to the AngularAdmin generator!'));

  var prompts = [{
    name: 'configFile',
    message: 'Configuration file',
    default: 'generators/config.json'
  }];

  this.prompt(prompts, function(props) {
    this.configFile = props.configFile;

    done();
  }.bind(this));
};

Generator.prototype.createModel = function createModel() {
  debugger;
  var _this = this,
    appDir,
    modelConfigPath = path.join(__dirname, '../config'),
    templatesDir = path.join(__dirname, '../templates');

    this.config = JSON.parse(this.readFileAsString(path.join(this.configFile)));
    //全局app相关配置
    _.extend(this, this.config);
    this.capitalAppName = _.capitalize(_.humanize(this.appName));
    appDir = path.join(__dirname, '../../'+this.appName);

  //配置模板路径
  _this.sourceRoot(path.join(__dirname, '../templates'));

  //读取当前model的配置文件，并生成相应的view、controller...
  var modelConfig = JSON.parse(_this.readFileAsString(path.join(modelConfigPath, this.modelName+'.json')));

  _.extend(_this, angularUtil.updateModelConfig(modelConfig));
  angularUtil.createModel(_this, appDir, templatesDir);
};

Generator.prototype.injectToModule = function injectToModule() {
  var _this = this,
    modelConfigPath = path.join(__dirname, '../config'),
    templatesDir = path.join(__dirname, '../templates'),
    appDir = path.join(__dirname, '../../'+this.appName);

  this.conflicter.resolve(function (err) {
    var modelConfig = JSON.parse(_this.readFileAsString(path.join(modelConfigPath, _this.modelName+'.json')));

    _.extend(_this, angularUtil.updateModelConfig(modelConfig));
    angularUtil.injectToModule(_this, appDir, templatesDir);

    angularUtil.beautifyJS([
      appDir+'/**/*.js',
      '!'+appDir+'/client/src/app/common/**/*.js',
      '!'+appDir+'/client/src/app/server/**/*.js',
      '!'+appDir+'/client/node_modules/**/*.js'
    ]);
  });

};