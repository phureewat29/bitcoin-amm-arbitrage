const request = require('request-promise')
const _ = require('lodash')
const Influx = require('./influx')

async function report ({ source, time, bid, ask }) {
  console.log(`${time.toISOString()}: ${source} ${bid} ${ask}`)
  await Influx.writeInfluxPoints('bid', [{
    point: { time: time.getTime()/1000, value: bid },
    options: { source }
  }])
  await Influx.writeInfluxPoints('ask', [{
    point: { time: time.getTime()/1000, value: ask },
    options: { source }
  }])
}

async function bx () {
  const res = JSON.parse(await request.get('https://bx.in.th/api/'))
  const b = res["1"].orderbook
  const source = 'bx'
  const time = new Date()
  const bid = b.bids.highbid
  const ask = b.asks.highbid
  await report({ source, time, bid, ask })
}

async function bitfinex () {
  const [bid,,ask] = JSON.parse(await request.get('https://api.bitfinex.com/v2/ticker/tBTCUSD'))
  const source = 'bitfinex'
  const time = new Date()
  await report({ source, time, bid, ask })
}

async function coinbase () {
  const { data } = JSON.parse(await request.get('https://api.coinbase.com/v2/prices/spot?currency=USD'))
  const source = 'coinbase'
  const time = new Date()
  await report({ source, time, bid: data.amount })
}

setInterval(bx, 1000)
setInterval(bitfinex, 1000)
setInterval(coinbase, 1000)
