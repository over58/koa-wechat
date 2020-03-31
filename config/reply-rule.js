const rules = {
  "天王盖地虎": "宝塔镇河妖",
  "上知天文": "下知地理",
  "hello": "kitty",
  "姣姣": "姣姣是个小仙女，哈哈",
  "减肥": "你一定能减肥成功的",
  "漂亮": "你是世界上最漂亮的女人"
}

const ruleList = Object.keys(rules).map(key => {
  return {
    key: key,
    value: rules[key]
  }
})


module.exports = ruleList
