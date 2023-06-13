const jwt = require("jsonwebtoken");

const createAccessToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN, {
        expiresIn: '15m'
    });
}

const createRefreshToken = (data) => {
    return jwt.sign(data, process.env.REFRESH_TOKEN, {
        expiresIn: '30d'
    });
}

module.exports = {
    createAccessToken,
    createRefreshToken
}