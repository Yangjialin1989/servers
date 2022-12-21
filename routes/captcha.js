var express = require('express');
var router = express.Router();
const svgCaptcha = require('svg-captcha')
const cookieParase = require('cookie-parser')


/* GET users listing. */

router.get('/getInfo', (req, res) => {
    // 下面这行代码是随机生成验证码图片和文本并返回给客户端
    // const c = svgCaptcha.create({
    //     size: 6, // 验证码长度
    //     ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    //     color: true, // 验证码是否有彩色
    //     noise: 1, //干扰线
    //     background: '#666' // 背景颜色
    // })
    // res.send(c)
    let captcha = svgCaptcha.create({
        // 翻转颜色
        inverse: true,
        // 字体大小
        fontSize: 34,
        // 噪声线条数
        noise: 2,
        // 宽度
        width: 100,
        // 高度
        height: 38,
    })
    req.session = captcha.text.toLowerCase();
    //
    res.cookie('captcha',req.session)
    // //res.setHeader('Content-Type','image/svg+xml')
    // res.write(String(captcha.data))
    //  res.send({
    //         msg: 'string',
    //         img: captcha,
    //         code: 200,
    //         captchaEnabled: true,
    //         uuid: 'string'
    //     })
    let {text,data} = captcha
    //res.type('svg')
    res.send({
        msg:'sss',
        img:captcha.data,
        code:200,
        captchaEnabled:true,
        uuid:'12345'

    })

})





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
