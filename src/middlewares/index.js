const utilStorage = require('../utils/storage');
const utilToken = require('../utils/token');
const jwt = require("jsonwebtoken");
const Account = require('../models/Account');

const verifyAccessToken = async (req, res, next) => {
    const token = utilStorage.getItem('accessToken');
    if (!token) {
        req.session.tokenErrorMsg = 'You have to login to use some functionalities !';
        res.redirect('/user/login');
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        next();
    } catch (e) {
        if (e.message === 'jwt expired') {
            const idUser = utilStorage.getItem('idUser');
            if (!idUser) {
                req.session.tokenErrorMsg = 'You have to login to use some functionalities !';
                return res.redirect('/user/login');
            }
            const user = await Account.findById(idUser);
            if (user) {
                const refreshToken = user.refreshToken;
                try {
                    const isValid = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
                    if (isValid) {
                        const { email, password } = isValid;
                        const accessToken = utilToken.createAccessToken({ email, password });
                        const refreshToken = utilToken.createRefreshToken({ email, password });
                        user.refreshToken = refreshToken;
                        await user.save();
                        utilStorage.setItem('accessToken', accessToken);
                        next();
                    }
                } catch (err) {
                    if (err.message === 'jwt expired') {
                        utilStorage.removeItem('accessToken');
                        utilStorage.removeItem('idUser');
                        req.session.tokenErrorMsg = 'Your session is expired ! Please login again !';
                        res.redirect('/user/login');
                    }
                }

            } else {
                req.session.tokenErrorMsg = 'Not found user ! Login again !';
                res.redirect('/user/login');
            }
        }
    }
}

module.exports = {
    verifyAccessToken
}