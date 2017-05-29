const P = require('bluebird')
const _ = require('lodash')
const Influx = require('influx')
const ProgressBar = require('progress')

const INFLUX_HOST = 'http://127.0.0.1'
const INFLUX_DB = 'test'

let _influx = null

const getClient = () => P.coroutine(function* () {
  try {
    if (_influx) {
      return _influx
    }
    _influx = P.promisifyAll(Influx({
      hosts: [INFLUX_HOST],
      timePrecision: 's'
    }))
    yield _influx.createDatabaseAsync(INFLUX_DB)
    return _influx
  }
  catch (err) {
    console.log('Cannot conect to influxdb:', err.message)
    _influx = null
    return null
  }
})()

const writeInfluxPoints = (measurementName, points) => {
  return P.coroutine(function * () {
    // const bar = new ProgressBar('Sending :bar :percent :current/:total (:rate req/sec)', { total: points.length, width: 40 })
    const client = yield getClient()
    for (const chunk of _.chunk(points, 10000)) {
      const points = chunk.map(p => [ p.point, p.options ])
      yield client.writePointsAsync(measurementName,
        points,
        { db: INFLUX_DB, precision: 's' }
      )
      // bar.tick(chunk.length)
    }
  })()
}

module.exports = {
  INFLUX_HOST,
  INFLUX_DB,
  getClient,
  writeInfluxPoints
}
