require('dotenv').config({silent: true})
import co from 'co'
import {getAuthData, addChecksToValidate, checksValidate} from './checksValidate'
import {CronJob} from 'cron'

let getChecks = function() {
    co(function*() {
        let jar = yield getAuthData()
        yield addChecksToValidate(jar)
        yield checksValidate(jar)
    }).catch(e=>(console.error(e)))
}

getChecks()

new CronJob({
    cronTime: '0 */2 * * * *',
    onTick: getChecks,
    start: true
})
