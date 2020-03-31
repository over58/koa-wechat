const router = require('koa-router')()
const axios = require('axios')
const xmlMiddle = require('../middleware/xml')
const replyRuleList = require('../config/reply-rule')

// 处理自动回复
router.post('/', xmlMiddle, async (ctx) => {
  const {Content: content = [], FromUserName = []} = ctx.request.body
  const msg = content[0] || ''
  const rule = replyRuleList.find(x => x.key.includes(msg.trim()))

  let replyMsg = msg

  if(rule) {
    replyMsg = rule.value
  } else {
    let str = msg.replace(/[\u4e00-\u9fa5]/gm, function(word){
      if(word === '我') {
        return '你'
      } else if(word === '你') {
        return '我'
      } else {
        return word
      }
    })
    // let str = msg.replace('你', ',^,').replace('我', '你').replace(',^,', '我')
    replyMsg = '暂时没有配置关键字，略略略: ' + str
  } 

  await axios.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${ctx.access_token}`, {
    touser: FromUserName[0] || "o1hUvuJlqSoFKjHAJ4lSzr-aa0SE",
    msgtype: "text",
    text: {
      content: replyMsg
    }
  })
})

module.exports = router