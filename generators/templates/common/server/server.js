var path         = require('path');
    express      = require('express'),
    bodyParser   = require('body-parser'),
    compression  = require('compression'),
    cors         = require('cors'),
    logger       = require('morgan'),
    errorHandler = require('errorhandler');

var app = express(),
  router = express.Router(),
  login = require('./app/login'),
  resource = require('./app/resource');

//all environments
app.set('port', process.env.PORT || 8008);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(logger('dev'));
app.use('/', express.static(path.join(__dirname, '../client/src')));

router.use(function(req, res, next){
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

app.use(resource);
app.use(login);


app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
})