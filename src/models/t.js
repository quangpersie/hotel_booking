const Account = require('./Account')
const Service = require('./Service')
const bcrypt = require('bcrypt')

const addDb = () => {
    let data = {
        // name: 'Taxi (Drop off)',
        // price: 4,
        // description: 'Drop off'
        email: 'admin',
        password: bcrypt.hashSync('123456', 10),
        role: 'admin',
    }
    let s = new Account(data)
    s.save()
}

module.exports = {addDb}