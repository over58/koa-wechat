const router = require('koa-router')()
const axios = require('axios')

// 获取用户列表
router.get('/user', async ctx => {
 const {data = {}} = await axios.get(`https://api.weixin.qq.com/cgi-bin/user/get?access_token=${ctx.access_token}&next_openid=`)
  ctx.set('Content-Type','application/json')
  ctx.body = JSON.stringify(data)
})


// 获取用户信息
router.get('/userinfo', async ctx => {
  const { openid = ''} = ctx.query
  const {data = {}} = await axios.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ctx.access_token}&openid=${openid}`)
   ctx.set('Content-Type','application/json')
   ctx.body = JSON.stringify(data)
 })


//  分组接口
 router.get('/group', async ctx => {
  const {data = {}} = await axios.get(`https://api.weixin.qq.com/cgi-bin/groups/get?access_token=${ctx.access_token}`)
   ctx.set('Content-Type','application/json')
   ctx.body = JSON.stringify(data)
 })

//  新增分组
router.post('/group', async ctx => {
  const {data = {}} = await axios.post(`https://api.weixin.qq.com/shakearound/device/group/add?access_token=${ctx.access_token}`, {
    "group_name": "group_name"
  })
  console.log('----data', data)
   ctx.set('Content-Type','application/json')
   ctx.body = JSON.stringify(data)
 })
 

 //  发送消息
router.post('/message', async ctx => {
  const {content = ''}  = ctx.request.body
  const {data = {}} = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${ctx.access_token}`, {
    touser: "o1hUvuJlqSoFKjHAJ4lSzr-aa0SE",
    msgtype: "text",
    text: {
      content: content
    }
  })
   ctx.set('Content-Type','application/json')
   ctx.body = JSON.stringify(data)
 })
 

module.exports = router