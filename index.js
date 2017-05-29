const request = require('request-promise')
const _ = require('lodash')

async function bx () {
   const res = JSON.parse(await request.get('https://bx.in.th/api/'))
   const b = res["1"].orderbook
   console.log(`${new Date().toISOString()}: bx ${b.bids.highbid} ${b.asks.highbid}`)
}

async function bitfinex () {
    const [bid,,ask] = JSON.parse(await request.get('https://api.bitfinex.com/v2/ticker/tBTCUSD'))
    console.log(`${new Date().toISOString()}: bitfinex ${bid*35} ${ask*35}`)
    
}

setInterval(bx, 1000)
setInterval(bitfinex, 1000)