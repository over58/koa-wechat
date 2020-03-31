// 1.access_token它每两个小时(7200)失效，需要重新获取。
// 2.access_token只要更新了，之前的那个就不能用了。
/*
  设计思路：
    1.让系统每隔2小时自动去刷新一次票据，这样不管任何时候调用票据始终是最新的。
    2.为了方便频繁调用，需要把票据存在一个唯一的地方。
*/
// 异步请求
const axios = require('axios')
// 引入文件模块
const { writeFile, readFile } = require('fs')
// 引入默认配置
const config = require('../config/index')

// 创建构造函数
class Wechat {
  constructor(opts) {
    this.appId = opts.appId
    this.appSecret = opts.appSecret
    this.token = opts.token
    this.fileUrl = './config/accessToken.txt'
  }
  // 获取access_token方法
  getAccessToken () {
    return new Promise((resolve, reject) => {
      // 定义url地址
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`
      axios.get(url)
        .then(async res => {
          const data = res.data
          // 设置过期时间
          data.expires_in = new Date().getTime() + (data.expires_in - 300) * 1000;
          resolve(data)
        })
        .catch(err => {
          reject('票据请求失败' + err)
        });
    })
  }
  // 保存本地access_token方法
  saveAccessToken (data) {
    return new Promise((resolve, reject) => {
      const str = JSON.stringify(data)
      writeFile(this.fileUrl, str, err => {
        if (!err) {
          console.log('本地文件保存成功')
          resolve()
        } else {
          reject('本地文件保存失败')
        }
      })
    })
  }
  // 读取本地access_token方法
  async readAccessToken () {
    return new Promise((resolve, reject) => {
      readFile(this.fileUrl, (err, data) => {
        if (!err) {
          try{
            const obj = JSON.parse(data)            
            resolve(obj)

          }catch{
            reject('本地文件读取失败')
          }
        } else {
          reject('本地文件读取失败')
        }
      })
    })
  }
  // 判断access_token是否为有效
  isValidAccessToken (data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false;
    }
    // access_token时间大于当前时间为有效，否则无效
    return data.expires_in > new Date().getTime()
  }
  // 初始化
  async init(app) {
    return new Promise((resolve, reject) => {
      this.readAccessToken()
        .then(async res => {
          // 本地有文件, 判断access_token是否为有效
          if (this.isValidAccessToken(res)) {
            app.context.access_token = res.access_token
            // access_token有效
            resolve(res)
          } else {
            // access_token无效
            // 发送异步请求获取文件
            const data = await this.getAccessToken()
            app.context.access_token = data.access_token
            // 获取文件之后，保存到本地
            this.saveAccessToken(data)
          }
        })
        .catch(async err => {
          // 本地没有文件，发送异步请求获取文件
          const data = await this.getAccessToken()
          // 获取文件之后，保存到本地
          this.saveAccessToken(data)
          app.context.access_token = data.access_token
          reject(err)
        })
    })
  }
}
// 创建一个wx实例
const wx = new Wechat(config);

module.exports = wx
