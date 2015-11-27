import fs from 'fs'
import { Converter } from 'csvtojson'
import parse from 'csv-parse'
const excludes = [
    '.DS_Store'
]
let total = 0
let errors = 0
export default (Maillist) => {
    const files = fs.readdirSync(__dirname + '/csv/')
        .filter(file => { return !excludes.includes(file) })
    for (let i = 0; i < files.length; i++) {
        let converter = new Converter({})
        let file = files[i]
        converter.on('end_parsed', (jsonArray) => {
            total += jsonArray.length
            for (let x = 0; x < jsonArray.length; x++) {
                let row = jsonArray[x]
                let user
                switch (file) {
                case 'rh_ru_signup_data_2.csv':
                case 'rem_ru_signup_data.csv':
                    user = {
                        name: row.firstname + ' ' + row.lastname,
                        email: row.email
                    }
                    break
                case 'rem_ru_mailing_list.csv':
                case 'rh_ru_mailing_list.csv':
                    user = {
                        name: row['Customers Full Name'],
                        email: row['Customers Email']
                    }
                    break
                case 'rem_ru_product_reg.csv':
                case 'rh_ru_product_reg.csv':
                    user = {
                        name: row.first_name + ' ' + row.last_name,
                        email: row.email
                    }
                    break
                case 'rh_ru_ilovehome_entries_1.csv':
                case 'rh_ru_ilovehome_entries.csv':
                    user = {
                        name: row.firstname + ' ' + row.lastname,
                        email: row.email_address
                    }
                    break
                default:
                    console.log(file)
                }
                try {
                    if (user.email.length > 0) {
                        Maillist.create(user, (err) => {
                            if (err) errors++
                            console.log(total, errors)
                        })
                    } else errors++
                } catch (e) {
                    console.log(e)
                }
            }

        })

        fs.createReadStream(__dirname + '/csv/' + files[i]).pipe(converter)
    }
}
