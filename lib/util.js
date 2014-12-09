'use strict';
var path = require('path');
var fs = require('fs');
var grunt = require('grunt');
var _ = require('yeoman-generator/node_modules/lodash');
var fileUtil = require('./file');


module.exports = {
  rewrite: rewrite,
  rewriteFile: rewriteFile,
  createModel: createModel,
  injectToModule: injectToModule,
  gruntTask: gruntTask,
  updateModelConfig: updateModelConfig,
  checkAddedModule: checkAddedModule
};

function rewriteFile (args) {
  args.path = args.path || process.cwd();
  var fullPath = path.resolve(args.path, args.file);

  args.spliceWithinLine = args.spliceWithinLine || false;

  args.haystack = fs.readFileSync(fullPath, 'utf8');
  var body = rewrite(args);

  fs.writeFileSync(fullPath, body);
}

function rewrite (args) {

  var lines = args.haystack.split('\n');

  var otherwiseLineIndex = 0;
  lines.forEach(function (line, i) {
    if (line.indexOf(args.needle) !== -1) {
      otherwiseLineIndex = i;
    }
  });

  if ((otherwiseLineIndex > 0) && (args.spliceWithinLine)) {
    var line = lines[otherwiseLineIndex];
    var indexToSpliceAt = line.indexOf(args.needle);

    if(args.before){
      lines[otherwiseLineIndex] = line.substr(0, indexToSpliceAt) + args.before + args.splicable[0] + line.substr(indexToSpliceAt);
    }else if(line.substr(0, indexToSpliceAt) == '  rtm('){
      //正对module的进行特殊处理，如果是rtm, 则去除前面的逗号
      lines[otherwiseLineIndex] = line.substr(0, indexToSpliceAt) + args.splicable[0].substr(2) + line.substr(indexToSpliceAt);
    }else{
      lines[otherwiseLineIndex] = line.substr(0, indexToSpliceAt) + args.splicable[0] + line.substr(indexToSpliceAt);
    }
    return lines.join('\n');
  }

  var spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  var spaceStr = '';
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  if(args.before){
    lines[otherwiseLineIndex-1] += args.before;
  }
  lines.splice(otherwiseLineIndex, 0, args.splicable.map(function (line) {
    return spaceStr + line;
  }).join('\n'));

  return lines.join('\n');
}


function gruntTask(beautifySrc, sassSrc){
  grunt.task.init = function(){};

  var sassFiles = {};
  sassFiles[sassSrc[0]] = sassSrc[1];

  grunt.initConfig({
    jsbeautifier : {
        files : beautifySrc,
        options : {
          js:{
            indentSize: 2,
            spaceBeforeConditional: false
          }
        }
    },
    sass: {
      dev: {
        options: { // Target options
          // style: 'compressed'
          noCache: true,
          spawn: false,
          'line-comments': true,
          'line-numbers':  true,
          'style': 'expended'
        },
        files: sassFiles
        // files: { // Dictionary of files
        //   sassSrc[0]: sassSrc[1], // 'destination': 'source'
        // }
      }
    }
  });

  var cwd = process.cwd();
  process.chdir(path.join(__dirname, '../'));//because the loadNpmTasks'root path is based on the process.cwd()
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-sass');
  process.chdir(cwd);

  grunt.tasks(['jsbeautifier', 'sass:dev'], {}, function(){
    grunt.log.ok('grunt task done');
  });
}




function updateModelConfig(modelConfig){
  var config = {};
  modelConfig = _.extend({
    ordering: undefined,
    list_filter_type: undefined,
    list_display_link: undefined,
    list_editable: undefined,
    list_datepicker: undefined,
    search_field: undefined,
    list_actions: undefined,
    list_table_actions: undefined
  }, modelConfig);

  config.moduleName = modelConfig.moduleName;
  config.camelModuleName = _.camelize(modelConfig.moduleName);
  config.sluggyModuleName = _.slugify(_.humanize(modelConfig.moduleName)); //un-ele-a-e

  config.modelName = modelConfig.modelName;
  config.camelModelName = _.camelize(modelConfig.modelName);
  config.sluggyModelName = _.slugify(_.humanize(modelConfig.modelName)); //un-ele-a-e
  config.capitalModelName = _.capitalize(_.camelize(modelConfig.modelName));
  config.lcaseModelName = modelConfig.modelName.toLowerCase();

  config.modelColumnObj = _.indexBy(modelConfig.items, 'name');
  config.modelColumn = _.filter(modelConfig.items, function(item){//list页面所有的column
    return _.indexOf(modelConfig.list_display, item.name) > -1;
  });
  config.modelEditList = _.filter(modelConfig.list_editable, function(item){//filter editable column that display type is input
    return config.modelColumnObj[item].display_as == 'input';
  });
  _.extend(config, modelConfig);
  return config;
}

function createModel(_this, appDir, templatesDir){
  var curModuleDir, curConfigDir;

  _this.template('view.list.html', appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModelName+'.list.html');//list page
  _this.template('controller.list.js', appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModelName+'.list.js');//list page controller

  _this.template('view.edit.html', appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModelName+'.edit.html');
  _this.template('controller.edit.js', appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModelName+'.edit.js');


  _this.template(templatesDir+'/ds.js', appDir+'/client/src/app/ds/'+_this.camelModelName+'.js');//ds

  curConfigDir = appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModuleName+'.config.js';
  curModuleDir = appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModuleName+'.module.js';

  if(!fileUtil.exists(curModuleDir)){
    _this.template('router.js', curConfigDir);
    _this.template('module.js', curModuleDir);
  }
}

function injectToModule(_this, appDir, templatesDir) {
  var curConfigDir,
    curModuleDir,
    appConfigDir,
    dsModuleDir;

  curConfigDir = appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModuleName+'.config.js';
  curModuleDir = appDir+'/client/src/app/'+_this.camelModuleName+'/'+_this.camelModuleName+'.module.js';
  appConfigDir = appDir+'/client/src/app/app.js';
  dsModuleDir = appDir+'/client/src/app/ds/ds.module.js';

  //update config.js: update model state
  rewriteFile({//add list router
  file: curConfigDir,
  needle: '/*add state to here*/',
  splicable: [
    '.state(\'' + _this.sluggyModuleName + '.' + _this.sluggyModelName + '\', {',
    '  url: \'/' + _this.sluggyModelName + '\',',
    '  templateUrl: \'app/' + _this.camelModuleName + '/' + _this.camelModelName + '.list.html\',',
    '  data: {',
    '    model: \'' + _this.modelName + '\',',
    '    action: [\'list\']',
    '  },',
    '  controller: \'' + _this.capitalModelName + 'ListCtrl\'',
    '})'
  ]
  });

  rewriteFile({//add add router
  file: curConfigDir,
  needle: '/*add state to here*/',
  splicable: [
    '.state(\'' + _this.sluggyModuleName + '.add-' + _this.sluggyModelName + '\', {',
    '  url: \'/' + _this.sluggyModelName + '/add\',',
    '  templateUrl: \'app/' + _this.camelModuleName + '/' + _this.camelModelName + '.edit.html\',',
    '  data: {',
    '    model: \'' + _this.modelName + '\',',
    '    action: [\'add\']',
    '  },',
    '  controller: \'' + _this.capitalModelName + 'EditCtrl\'',
    '})'
  ]
  });

  rewriteFile({//add edit router
  file: curConfigDir,
  needle: '/*add state to here*/',
  splicable: [
    '.state(\'' + _this.sluggyModuleName + '.edit-' + _this.sluggyModelName + '\', {',
    '  url: \'/' + _this.sluggyModelName + '/:id\',',
    '  templateUrl: \'app/' + _this.camelModuleName + '/' + _this.camelModelName + '.edit.html\',',
    '  data: {',
    '    model: \'' + _this.modelName + '\',',
    '    action: [\'edit\']',
    '  },',
    '  controller: \'' + _this.capitalModelName + 'EditCtrl\'',
    '})'
  ]
  });

  //update module.js
  rewriteFile({
    file: curModuleDir,
    needle: '], function(',
    splicable: [
      '  \'./' + _this.camelModelName+'.list\',',
      '  \'./' + _this.camelModelName+'.edit\''
    ],
    before: ','
  });

  rewriteFile({
    file: curModuleDir,
    needle: ') /*invoke*/',
    splicable: [
      ', '+ _this.capitalModelName+'ListCtrl, ' + _this.capitalModelName+'EditCtrl'
    ],
    spliceWithinLine: true
  });

  rewriteFile({
    file: curModuleDir,
    needle: ')(mod)',
    splicable: [
      ', ' + _this.capitalModelName+'ListCtrl, ' + _this.capitalModelName+'EditCtrl'
    ],
    spliceWithinLine: true
  });

  if(!checkAddedModule(appConfigDir, _this.camelModuleName+'/'+_this.camelModuleName+'.module')){
  //update app.js: add current module to the app.js if the module is not exist
  rewriteFile({
      file: appConfigDir,
      needle: '], function(',
      splicable: [
        '  \'' + _this.camelModuleName+'/'+_this.camelModuleName+'.module\''
      ],
      before: ','
    });

  rewriteFile({
      file: appConfigDir,
      needle: ') /*invoke*/',
      splicable: [
        ', '+_this.camelModuleName
      ],
      spliceWithinLine: true
    });

  rewriteFile({
      file: appConfigDir,
      needle: ']); /*ngDeps*/',
      splicable: [
        '  '+_this.camelModuleName
      ],
      before: ','
    });
  }

  //update ds.module.js
  rewriteFile({
    file: dsModuleDir,
    needle: '], function(',
    splicable: [
      '  \'./' + _this.camelModelName+'\''
    ],
    before: ','
  });

  rewriteFile({
    file: dsModuleDir,
    needle: ') /*invoke*/',
    splicable: [
      ', ' + _this.camelModelName
    ],
    spliceWithinLine: true
  });

  rewriteFile({
    file: dsModuleDir,
    needle: ')(mod)',
    splicable: [
      ', ' + _this.camelModelName
    ],
    spliceWithinLine: true
  });
}

/*check whether the module has been added to the app.js*/
function checkAddedModule(appPath, module){
  var content = fs.readFileSync(appPath, 'utf8'),
    lines = content.split('\n'), line;

  for(var i=0,l=lines.length; i<l; i++){
    line = lines[i];
    if (line.indexOf(module) !== -1) {
      return true;
    }
  }
  return false;
}