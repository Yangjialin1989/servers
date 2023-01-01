var express = require('express');
var router = express.Router();
var Users = require('../models/users');
/* GET users listing. */
const redis = require('../utils/redis');

router.post('/validUsername', function(req, res, next) {
    let param = {
        name:req.body.username
    }
    console.log(param)
    Users.findOne(param,function(err,doc){
        if(!doc){
            res.json({
                code:300,
                msg:'该用户名可以注册!'
            })
        }
        if(doc){
            res.json({
                code:102,
                msg:'用户名已存在,请更换!'
            })
        }
    })
});
//
// router.post('/login',async (req,res,next)=> {
//
//
//     let param = {
//         name: req.body.name,
//         password: req.body.password
//     }
//     var users = await Users.findOne(param);
//     if(!users){
//         return res.json({
//             code: '1',
//             msg:'用户不存在，请注册'
//         })
//     }
//     return res.json({
//         code:'0',
//         msg:'登录成功'
//     })
//
//
// });




router.post('/login',async (req,res,next)=> {

    //interface LoginAPIReq{
    // 	username:string;
    // 	password:string;
    // 	code:string;
    // 	uuid:string;
    // }
    //登录响应类型约束
    // interface LoginAPIRes{
    //     msg:string;
    //     code:number;
    //     token:string;
    // }
    //登录具体流程
    let captchaValid = false
    //1.校验验证码
    await redis.connect()
    let result = await redis.get('loginInfo')

    let Res = JSON.parse(result)
    if(Res !== null){
        if(req.body.code === Res.captchaImgText){
            captchaValid = true

        }else{
            res.json({
                code:101,
                msg:'图片验证码输入错误或已经过期,请重新刷新输入！',
                token:null,
                remember:false
            })

        }
    }else{
        res.json({
            code:101,
            msg:'图片验证码输入错误或已经过期,请重新刷新输入！',
            token:null,
            remember:false
        })
    }


    redis.qiut()






    //2.校验用户名密码
    if(captchaValid){
        let param = {
            name: req.body.username,
            password: req.body.password
        }
        var users = await Users.findOne(param);
        if(!users){
            return res.json({
                code: 100,
                msg:'用户不存在，请注册',
                token:null,
                remember:false
            })
        }
        return res.json({
            code:200,
            msg:'登录成功',
            token:'22edsfsdfsdfd',
            remember:true
        })
    }

    //
    //

//3.返回token
    // console.log(req.body)
    //
    //

});
//注册
router.post('/register',function(req,res,next){
    console.log(req.body)
    const users = req.body
    const user = new Users(users)
     user.save().then((result)=>{
        console.log("存储数据成功!")
        res.json({
            code: 200,
            msg:'注册成功！'
        })
    })

})


module.exports = router;
