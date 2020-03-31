# koa-wechat
#### 介绍
微信公众号简单开发demo

### 运行
```
npm install
npm start
访问http://localhost:3000/home
```

#### 测试的功能
- access_token获取，更新问题
- 获取用户列表问题
- 自动回复问题
- xml数据解析问题
- 日志记录

### 开发要点
1. 配置接口地址提交时，会提交一个?signature=472eb8611f9b18f4702789071cfd68b4b20c4d94&echostr=8836840155922294767&timestamp=1585653226&nonce=985738026 , 要进行校验
2. 关于access_token的获取，更新问题
3. 对于用户发送的xml信息，利用xml2js中间件进行处理为json个事， ctx.body = '', 通过调接口发送json数据来回复信息
4. log4js存储日志，便于查询问题