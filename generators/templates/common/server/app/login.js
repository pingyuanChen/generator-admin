var express = require('express'),
  router = express.Router(),
  navData = {
    "status": 0,
    "msg": "get left navi menu",
    "data": {
      "menu": [
          {
            "items": [
              {
                "url": "videos/movie",
                "model": "movie",
                "display": "电影"
              },
              {
                "url": "videos/tv-play",
                "model": "tv-play",
                "display": "电视剧"
              }
            ],
            "display": "视频库",
            "module": "videos"
          },
          {
            "items": [
              {
                "url": "novels/novel",
                "model": "novel",
                "display": "小说"
              }
            ],
            "display": "小说库",
            "module": "novels"
          },
          {
            "items": [
              {
                "url": "musics/music",
                "model": "music",
                "display": "music"
              }
            ],
            "display": "音乐库",
            "module": "musics"
          },
          {
            "items": [
              {
                "url": "report-module/stability",
                "model": "stability",
                "display": "稳定性"
              }
            ],
            "display": "报表",
            "module": "report-module"
          }
      ],
      "features": [
        "build-project",
        "create-task"
      ],
      "permissions": [
        {
          "action": [
            "list"
          ],
          "model": "movie"
        },
        {
          "action": [
            "list",
            "delete"
          ],
          "model": "tv-play"
        },
        {
          "action": [
            "list",
            "delete"
          ],
          "model": "music"
        },
        {
          "action": [
            "add",
            "modify",
            "delete",
            "list"
          ],
          "model": "novel"
        }
      ]
    }
  };

router.post('/admin/login', function(req, res){
  console.log('login request handling...');
  var userInfo = {
    name: req.param('user_name'),
    password: req.param('password')
  };
  if(validateUser(userInfo)){
    res.send(200, navData)
  }else{
    navData.status = -1;
    navData.msg = 'login failed';
    res.send(200, navData);
  }
});

function validateUser(userInfo){
  return userInfo.name == 'admin' && userInfo.password == '123456';
}

module.exports = router;