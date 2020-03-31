// sha1加密
const sha1 = require('sha1')
// 引入默认配置
const { token } = require('../config/index')
/*
  signature	微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
  timestamp	时间戳
  nonce	随机数
  echostr	随机字符串
*/

// 服务器有效验证
module.exports = () => {
  return ctx => {
    console.log('验证接口配置...')
    // 获取服务器传递的内容
    const { signature, timestamp, nonce, echostr } = ctx.query
    // 字典排序
    const str = [token, timestamp, nonce].sort().join('')
    // sha1加密
    const sha = sha1(str)
    if (sha === signature) {
      // 原样返回echostr参数内容
      return ctx.body = echostr
    }
    // 在页面执行会直接进行到这一步，因为没有上面的判断不相等
    ctx.status = 401
    ctx.body = '服务器签名无效'
  }
}