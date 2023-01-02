var express = require('express');
var router = express.Router();
var Users = require('../models/users');
/* GET users listing. */
const redis = require('../utils/redis');
// 引入 nodemailer
var nodemailer = require('nodemailer');
const Transporter = require('../utils/email');
const GraceInfos = require("../models/graceInfos");
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
//     var users = await Admin.findOne(param);
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
            msg:'注册成功！',
            email:req.body.email,
            name:req.body.name
        })
    })

})
// router.get('/email',function(req,res,next){
//     console.log('hhhh')
//     var config = {
//         host: 'smtp.qq.com',
//         port: 465,
//         auth: {
//             user: '729850713@qq.com', //刚才注册的邮箱账号
//             pass: 'qyvqxkvtmgnqbgaj' //邮箱的授权码，不是注册时的密码
//         }
//     };
// // 创建一个SMTP客户端对象
//     var transporter = nodemailer.createTransport(config);
// // 发送邮件
//     let options = {
//         from:'729850713@qq.com',
//         to:'1584302686@qq.com',
//         subject:'欢迎！',
//         html:`<div><h1>欢迎注册后台管理系统</h1></div>`
//
//     }
//     transporter.sendMail(options,function(err,msg){
//         if(err){
//             console.log(err)
//         }else{
//             res.send(msg)
//             transporter.close()
//         }
//     })
// })
router.post('/sendemail',function(req,res,next){
    Transporter(req.body.email,req.body.name)
})
//获取数据
router.post('/getadmins',function(req,res,next){
    let param = {}
    let param1 = {limit:req.body.limit*16}
    //console.log(param1)
    Users.find({},{id:1,name:1,email:1,telephone:1},param1,function(err,result){
        //console.log(result)
        if(err){
            res.json({
                code:104,
                msg:'数据获取失败！',
                data:''
            })
        }
        res.json({
            code: 200,
            msg:'数据获取成功！',
            data:result
        })

    })
})
//删除数据
router.post('/deleteadmins',function(req,res,next){
    let param = req.body;
    console.log(param)
    Users.remove(param,function(err,doc){
        if(err){
            return res.json({
                code:-1,
                msg:'数据删除失败！'+err
            })
        }
        if(doc){
            res.json({
                code:0,
                msg:'数据删除成功！'
            })
        }
    })


})
//添加管理员
router.post('/addadmins',function(req,res,next){
    console.log(req.body)
    const users = req.body
    const user = new Users(users)
    user.save().then((result)=>{
        console.log("存储数据成功!")
        res.json({
            code: 200,
            msg:'添加成功！',
            email:req.body.email,
            name:req.body.name
        })
        //添加id

        Users.findOneAndUpdate(user)
    })

})

module.exports = router;
