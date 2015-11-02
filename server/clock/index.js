require('dotenv').config({silent: true})
import co from 'co'
import {getAuthData, addChecksToValidate, checksValidate} from './checksValidate'
import {CronJob} from 'cron'

let getChecks = co(function*() {
    let jar = yield getAuthData()
    yield addChecksToValidate(jar)
    yield checksValidate(jar)
}).catch(e=>(console.error(e)))

new CronJob({
    cronTime: '0 */2 * * * *',//15 seconds after every minute
    onTick: getChecks,
    start: true
})
