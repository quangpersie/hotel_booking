const userServices = require('../services/userServices')
const utilStorage = require('../utils/storage');
const emailValidator = require('email-validator');
const Account = require('../models/Account');
const mailerUtil = require('../utils/mailer')
const bcrypt = require('bcrypt');
const { comparePassword, hashPassword } = require('../utils/password');

class UserController {
    login(req, res) {
        let role = utilStorage.getItem('role')
        if (role) {
            return res.redirect('/')
        }
        let { tokenErrorMsg } = req.session
        if (tokenErrorMsg === 'You have changed password successfully, please log in again!') {
            req.session.destroy()
        } else {
            delete req.session.tokenErrorMsg
        }
        res.render('Signin', { title: 'Sign In', tokenErrorMsg });
    }

    async signin(req, res) {
        // console.log('from signin:', req.body);
        let { email, password } = req.body
        let msg = ''
        if (!email) {
            msg = 'Missing email parameter!'
        } else if (!emailValidator.validate(email)) {
            msg = 'Wrong format of email!'
        } else if (!password) {
            msg = 'Missing password parameter!'
        } else if (password.length < 6) {
            msg = 'Password must be at least 6 characters'
        }

        if (msg.length > 0) {
            res.render('SignIn', { title: 'Sign In', email, password, alert: msg })
        } else {
            req.session.destroy()
            utilStorage.clearItem()

            let response = await userServices.login(req.body)
            if (response.success) {
                utilStorage.setItem('curCustomer', JSON.stringify(response.result))
                res.redirect('/')
            } else {
                msg = response.error
                res.render('SignIn', { title: 'Sign In', email, password, alert: msg })
            }
        }
    }

    register(req, res) {
        let role = utilStorage.getItem('role')
        if (role) {
            return res.redirect('/')
        }
        res.render('SignUp', { title: 'Sign Up' })
    }

    async signup(req, res) {
        // console.log('from signup', req.body);
        let { name, phone, password, email, address, confirm_password, idCard } = req.body

        let msg = ''

        if (!name) {
            msg = 'Missing name parameter!'
        } else if (!phone) {
            msg = 'Missing phone number parameter!'
        } else if (isNaN(phone)) {
            msg = 'Invalid phone number!'
        } else if (!idCard) {
            msg = 'Missing ID card number parameter!'
        } else if (isNaN(idCard)) {
            msg = 'Invalid phone id card number!'
        } else if (!email) {
            msg = 'Missing email parameter!'
        } else if (!emailValidator.validate(email)) {
            msg = 'Wrong format of email!'
        } else if (!address) {
            msg = 'Missing address parameter!'
        } else if (!password) {
            msg = 'Missing password parameter!'
        } else if (password.length < 6) {
            msg = 'Password must be at least 6 characters'
        } else if (password !== confirm_password) {
            msg = 'Confirm password not match'
        }

        if (msg.length > 0) {
            res.render('SignUp', { title: 'Sign Up', alert: msg, dataOld: req.body })
        } else {
            let response = await userServices.signUp(req.body)
            if (response.success) {
                req.session.tokenErrorMsg = 'Sign up successfully, you can log in now !'
                res.redirect('/user/login')
            } else {
                msg = response.error
                res.render('SignUp', { title: 'Sign Up', alert: msg, dataOld: req.body })
            }
        }
    }

    logout(req, res) {
        req.session.destroy()
        utilStorage.clearItem()
        return res.redirect('/user/login')
    }

    editProfile(req, res) {
        let role = utilStorage.getItem('role')
        if (role === 'admin') {
            return res.redirect('/admin/user')
        }
        let {alertProfile} = req.session
        let alert = alertProfile
        delete req.session.alertProfile
        let curCus = JSON.parse(utilStorage.getItem('curCustomer'))
        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        if(alert) {
            res.render('EditProfile', { title: 'Edit Profile', nameUser, mailUser, curCus, alert })
        } else {
            res.render('EditProfile', { title: 'Edit Profile', nameUser, mailUser, curCus })
        }
    }

    forgotPassword(req, res) {
        let data = utilStorage.getItem('idUser')
        if (data) {
            return res.redirect('/')
        }
        res.render('PasswordForgot', { title: 'Forgot Password' });
    }

    goToLinkResetPwd(req, res) {
        let { email } = req.body
        if (!email) {
            res.render('PasswordForgot', { title: 'Forgot Password', msg: 'Missing email parameter!' })
        } else if (!emailValidator.validate(email)) {
            res.render('PasswordForgot', { title: 'Forgot Password', msg: 'Invalid format of email!' })
        } else {
            Account.findOne({ email }).then(acc => {
                if (acc) {
                    console.log(acc);
                    bcrypt.hash(acc.email, 10).then(hashedEmail => {
                        mailerUtil.sendMail(acc.email, "[Hotel-App] Reset password Link",
                            `<p>Click the link to reset your password:</p><a href="http://localhost:${process.env.PORT || 3000}/user/reset-password/${acc.email}?token=${hashedEmail}"> Reset Password </a>`)
                        console.log(`http://localhost:${process.env.PORT || 3000}/user/reset-password/${acc.email}?token=${hashedEmail}`);
                    })
                    res.render('PasswordForgot', { title: 'Forgot Password', email, sent: 'We sent a reset link, check your email!' })
                } else {
                    res.render('PasswordForgot', { title: 'Forgot Password', msg: 'Your provided email have not registered with our app!' })
                }
            })
        }
    }

    passwordReset(req, res) {
        let role = utilStorage.getItem('role')
        if (role === 'user') {
            return res.redirect('/')
        } else if(role === 'admin') {
            return res.redirect('/admin/user')
        }
        const { email } = req.params
        const { token } = req.query
        if (!email || !token) {
            res.redirect('/user/forgot-password')
        } else {
            res.render('PasswordReset', { title: 'Reset Password', email, token })
        }
    }

    execReset(req, res) {
        let role = utilStorage.getItem('role')
        if(role === 'admin') {
            return res.redirect('/admin/user')
        }
        const { email, token, password } = req.body;
        if (!email || !token || !password) {
            res.redirect('/user/forgot-password');
        } else {
            bcrypt.compare(email, token, (err, result) => {
                if (result === true) {
                    bcrypt.hash(password, 10).then(async (hashedPassword) => {
                        await Account.findOneAndUpdate({ email: email }, { password: hashedPassword })
                        res.redirect('/user/login')
                    })
                } else {
                    res.redirect('/user/forgot-password');
                }
            })
        }
    }

    changePass(req, res) {
        let role = utilStorage.getItem('role')
        if(role === 'admin') {
            return res.redirect('/admin/user')
        }
        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        res.render('ChangePassword', {title: 'Change Password', nameUser, mailUser})
    }

    async changePassExec(req, res) {
        let role = utilStorage.getItem('role')
        if(role === 'admin') {
            return res.redirect('/admin/user')
        }
        const {pwd, pwd1, pwd2} = req.body
        let msg = ''
        if(!pwd || !pwd1 || !pwd2) {
            msg = 'Missing password parameter'
        } else if(pwd1 !== pwd2) {
            msg = 'Confirm password not match'
        }

        let idUser = utilStorage.getItem('idUser')
        let nameUser = utilStorage.getItem('nameUser');
        let mailUser = utilStorage.getItem('mailUser');
        let acc = await Account.findById(idUser).lean()
        if(msg.length > 0) {
            return res.render('ChangePassword', {title: 'Change Password', nameUser, mailUser, alert: msg})
        } else {
            console.log('>>check acc:',acc)
            let check = comparePassword(pwd, acc.password)
            console.log('>>check:',check)
            if(check === true) {
                let response = await userServices.changePassword(idUser, hashPassword(pwd1))
                console.log(response)
                if(response.success) {
                    req.session.tokenErrorMsg = 'You have changed password successfully, please log in again!'
                    utilStorage.clearItem()
                    return res.redirect('/user/login')
                } else {
                    return res.render('ChangePassword', {title: 'Change Password', nameUser, mailUser, alert: 'Error occur, try again!'})
                }
            } else {
                return res.render('ChangePassword', {title: 'Change Password', nameUser, mailUser, alert: 'Old password not correct!'})
            }
        }
    }

    async editProfileExec(req, res) {
        let id = utilStorage.getItem('idUser')
        const { name, address, phone, idCard } = req.body
        if(!id || !name || !address || !phone || !idCard) {
            req.session.alertProfile = 'Missing paramter!'
            res.redirect('/user/edit-profile')
        } else if(isNaN(phone)) {
            req.session.alertProfile = 'Phone is not a number!'
            res.redirect('/user/edit-profile')
        } else if(isNaN(idCard)) {
            req.session.alertProfile = 'Id Card is not a number!'
            res.redirect('/user/edit-profile')
        } else {
            req.body.id = id
            let response = await userServices.updateCustomer(req.body)
            if(response.success) {
                utilStorage.setItem('curCustomer', JSON.stringify(response.result))
                utilStorage.setItem('nameUser', response.result.name);
                req.session.alertProfile = 'Edit profile success!'
                res.redirect('/user/edit-profile')
            } else {
                req.session.alertProfile = 'Edit profile fail, try again!'
                res.redirect('/user/edit-profile')
            }
        }
    }
}

module.exports = new UserController();