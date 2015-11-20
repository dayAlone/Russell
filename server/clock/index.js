require('dotenv').config({silent: true})
import co from 'co'
import {getAuthData, addChecksToValidate, checksValidate} from './checksValidate'
import checkGamesRaffles from './checkGamesRaffle'
import {CronJob} from 'cron'

let getChecks = function() {
    co(function*() {
        let jar = yield getAuthData()
        yield addChecksToValidate(jar)
        yield checksValidate(jar)
        console.log('getChecks complete')
    }).catch(e => (console.error(e.stack)))
}
//getChecks()
new CronJob({
    cronTime: '0 */2 * * * *',
    onTick: getChecks,
    start: true
})


let checkRaffles = function() {
    co(function*() {
        yield checkGamesRaffles()
    }).catch(e => (console.error(e.stack)))
}

checkRaffles()
