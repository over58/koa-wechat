/*
  微信公众号网页权限
  1 第一步：用户同意授权，获取code
  2 第二步：通过code换取网页授权access_token
  3 第三步：刷新access_token（如果需要）
  4 第四步：拉取用户信息(需scope为 snsapi_userinfo)
  5 附：检验授权凭证（access_token）是否有效
*/
// 引入路由
const router = require('koa-router')()
// 异步请求
const axios = require('axios')
// 引入默认配置
const config = require('../config/index')

// 首页
router.get('/home', async (ctx, next) => {
  await ctx.render('home')
})

router.get('/login', async (ctx) => {
  // 获取code的值
  const { code } = ctx.query
  // 接收获取到用户信息
  const data = await getAccessToken(code)
  // 返回数据给前端
  ctx.status = 200;
  ctx.body = data
})

// 2.使用code获取openid和access_token
getAccessToken = (code) => {
  return new Promise((resolve, reject) => {
    const url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + config.appId + "&secret=" + config.appSecret + "&code=" + code + "&grant_type=authorization_code"
    axios.get(url)
      .then(async res => {
        // 接收获取到用户信息
        const obj = await getUserInfo(res.data)
        resolve(obj)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// 4.使用access_token和openid
getUserInfo = (data) => {
  return new Promise((resolve, reject) => {
    const url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + data.access_token + "&openid=" + data.openid + "&lang=zh_CN"
    axios.get(url)
      .then(async res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
module.exports = router