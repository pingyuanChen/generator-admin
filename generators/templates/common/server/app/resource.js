var express = require('express'),
  router = express.Router(),
  jsonfileservice = require('./jsonfileservice.js'),
  apiPath = '/admin',
  resourcePath = './data/';

router.post(apiPath + '/:resouce/add', function(req, res, next) {
  res.status(200)
    .send({
      "status": 0,
      "msg": "",
      "data": {}
    });
});

router.get(apiPath + '/:resouce/:action', function(req, res, next) {
  var resourceName = req.params.resouce,
    action = req.params.action,
    json;
  console.log(resourceName);
  try {
    json = jsonfileservice.getJsonFromFile(resourcePath + resourceName + '.' + action + '.json');
  } catch(e) {
    console.log(e);
    res.status(500)
      .send({
        'error': 'Server Error'
      });
  }

  res.status(200)
    .send(json);
});


module.exports = router;
