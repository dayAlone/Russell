import { getCheckStatus, addCheck, getAuth} from '../libs/getCheckStatus'
import '../libs/mongoose'
import { check as Check } from '../models/check'

export const getAuthData = getAuth

export const addChecksToValidate = function* (jar) {
    let checks
    try {
        checks = yield Check.find({
            status: 'added'
        })
        for (let i = 0; i < checks.length; i++) {
            let check = checks[i]
            let data = yield addCheck(jar, check)
            if (data.error) {
                yield Check.findOneAndUpdate(
                    { _id: check._id },
                    { $set: { status: 'canceled', status_comment: data.message } },
                    { safe: true, upsert: true }
                )
            } else if (data.id) {
                yield Check.findOneAndUpdate(
                    { _id: check._id },
                    { $set: { kpk_id: data.id, status: data.result.status, status_comment: data.result.message } },
                    { safe: true, upsert: true }
                )
            }
        }
    } catch (e) {
        console.error(e)
    }
}

export const checksValidate = function* (jar) {
    let checks
    try {
        checks = yield Check.find({
            status: 'processing'
        })
        for (let i = 0; i < checks.length; i++) {
            let check = checks[i]
            let data = yield getCheckStatus(jar, check.kpk_id.substr(1))
            if (data) {
                yield Check.findOneAndUpdate(
                    { _id: check._id },
                    { $set: {
                        status: data.status, status_comment: data.message
                    } },
                    { safe: true, upsert: true }
                )
            }
        }
    } catch (e) {
        console.error(e)
    }
}
