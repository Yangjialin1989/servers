var express = require('express');
var router = express.Router();
var Users = require('../models/users');
/* GET users listing. */

router.get('/', function(req, res, next) {

  res.send({
    result:{
        name:'hhh',
            password:'ssss'
    },
    code:0,
    msg:'成功'
  }
  );
});

router.post('/login',async (req,res,next)=> {


    let param = {
        name: req.body.name,
        password: req.body.password
    }
    var users = await Users.findOne(param);
    if(!users){
        return res.json({
            code: '1',
            msg:'用户不存在，请注册'
        })
    }
    return res.json({
        code:'0',
        msg:'登录成功'
    })


});



module.exports = router;
