// 引入koa
const koa = require('koa')
// 引入模板引擎
const views = require('koa-views')
// 解决跨域
var cors = require('koa2-cors')
// 创建一个koa实例
const app = new koa()
// 引入weacht方法验证微信服务器
const wechat = require('./wechat/wechat')
// 引入网页授权
const auth = require('./wechat/auth')
// 每次启动都会自动获取access_token
const wx = require('./wechat/accessToken')
// 初始化调用
wx.init()
// 执行跨域方法
app.use(cors())
// 指定网页目录
app.use(views(__dirname + '/views'))
// 启动路由
app.use(auth.routes(), auth.allowedMethods());
// 服务器有效验证
app.use(wechat())


// 监听端口
app.listen(3000, () => {
  // 成功后打印这句话
  console.log("本地服务器启动成功，端口号为3000~~~");
})
