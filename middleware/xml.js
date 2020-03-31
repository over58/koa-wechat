var parseString = require('xml2js').parseString;

module.exports = async function handleXmlData (ctx, next) {
  return new Promise((resolve, reject) => {
    let chuunks = []
    ctx.req.on('data', function(chunk){
      chuunks.push(chunk)
    })
    ctx.req.on('end', function() {
      let str = chuunks.join('')
      parseString(str, function(err, data) {
        if(err) {
          return
        }
        ctx.request.body= data.xml
        next()
        ctx.body = ''
      })
      resolve()
    })
    ctx.req.on('error', function(err){
      reject(err)
    })
  })
}
