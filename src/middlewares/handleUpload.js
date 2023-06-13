const multer = require('multer')
const fs = require('fs')
const Path = require('path')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const {root} = req.vars
        const path = Path.join(root, 'public', 'img', 'room')
        return cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

let upload = multer({ storage: storage })

module.exports = {
    upload
}