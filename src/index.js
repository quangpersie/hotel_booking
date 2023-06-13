require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path');

const app = express();
const port = process.env.URL || 3000;
const route = require('./routes');
const db = require('./config/db');
const addTemp = require('./models/t');
const utilStorage = require('./utils/storage')

app.use(express.static(path.join(__dirname, 'public')));

// Set template engine
app.engine('handlebars',
    handlebars.engine({
        defaultLayout: 'main',
        helpers: {
            stringify: (obj) => {
                return JSON.stringify(obj)
            },
            welcome: (name) => {
                return `Hi, ${name} !`
            },
            checkObj: (obj) => {
                return obj.length > 0
            },
            emptyObj: (obj) => {
                return obj.length === 0
            },
            formatDate: (date) => {
                try {
                    let d = date.getDate()
                    let m = date.getMonth() + 1
                    let y = date.getFullYear()
                    return `${d}-${m}-${y}`
                } catch (e) {
                    console.log('error:', 'formatDate not type of date');
                }
            },
            getRoomName: (roomId) => {
                try {
                    let arr = JSON.parse(utilStorage.getItem('dataHbsRooms'))
                    let name = ''
                    arr.forEach(el => {
                        if (el._id === roomId.toString()) {
                            name = el.name
                        }
                    });
                    return name
                } catch (e) {
                    console.log('error:', e);
                }
            },
            getRoomType: (roomId) => {
                try {
                    let arr = JSON.parse(utilStorage.getItem('dataHbsRooms'))
                    let type = ''
                    arr.forEach(el => {
                        if (el._id === roomId.toString()) {
                            type = el.type
                        }
                    });
                    return type
                } catch (e) {
                    console.log('error:', e);
                }
            },
            getRoomPrice: (roomId) => {
                try {
                    let arr = JSON.parse(utilStorage.getItem('dataHbsRooms'))
                    let price = ''
                    arr.forEach(el => {
                        if (el._id === roomId.toString()) {
                            price = el.price
                        }
                    });
                    return price
                } catch (e) {
                    console.log('error:', e);
                }
            },
            getInfoService: (ser) => {
                try {
                    let arr = JSON.parse(utilStorage.getItem('dataHbsServices'))
                    let rs = ''
                    arr.forEach(el => {
                        if (el._id === ser.toString()) {
                            rs += `${el.name} (price: ${el.price})`
                        }
                    });
                    return rs
                } catch (e) {
                    console.log('error:', e);
                }
            },
            plusOne: (item) => {
                return item + 1
            },
            equalNum: (num1, num2) => {
                return num1 == num2
            }
        }
    }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser('ttnt'))
app.use(session({
    secret: 'ttnt',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

db.connect();
// addTemp.addDb()
app.use((req, res, next) => {
    req.vars = {
        root: __dirname
    }
    next()
})
route(app);
app.use((req, res) => {
    res.status(404)
    res.render('error', {title: 'Page Not Found'})
})

app.listen(port, () => {
    console.log(`App is listen at http://localhost:${port}`);
});