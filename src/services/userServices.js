const utilPassword = require('../utils/password');
const utilStorage = require('../utils/storage');
const utilToken = require('../utils/token');
const Account = require('../models/Account');
const Customer = require('../models/Customer');
const { singleMoongoseToObject } = require('../utils/moongose');

const signUp = async (data) => {
    try {
        const userExist = await Account.findOne({ email: data.email });
        if (userExist) {
            return {
                success: false,
                error: 'User is already exist',
                result: []
            }
        }

    } catch (error) {
        console.log('signUp error: ', error);
        return {
            success: false,
            error: '',
            result: []
        }
    }

    const { password, ...resData } = data;
    const hashPass = await utilPassword.hashPassword(password);
    try {
        const newAccount = new Account({ email: data.email, password: hashPass, role: 'user' });
        const newCustomer = new Customer({ ...resData, _id: newAccount._id });
        await Promise.all([await newAccount.save(), await newCustomer.save()]);
        return {
            success: true,
            error: '',
            result: []
        }
    } catch (error) {
        console.log('signUp error: ', error);
        return {
            success: false,
            error: 'Request time out',
            result: []
        }
    }
}

const login = async ({ email, password }) => {
    try {
        const user = await Account.findOne({ email });
        const cus = await Customer.findOne({ email });
        if (user && cus) {
            const result = utilPassword.comparePassword(password, user.password);
            if (result) {
                const { email, password, role } = singleMoongoseToObject(user);
                const accessToken = utilToken.createAccessToken({ email, password });
                const refreshToken = utilToken.createRefreshToken({ email, password });
                user.refreshToken = refreshToken;
                await user.save();
                utilStorage.setItem('accessToken', accessToken);
                utilStorage.setItem('idUser', user._id);
                utilStorage.setItem('nameUser', cus.name);
                utilStorage.setItem('mailUser', cus.email);
                utilStorage.setItem('role', role);
                let u = {
                    name: cus.name,
                    email: cus.email,
                    phone: cus.phone,
                    idCard: cus.idCard,
                    address: cus.address,
                }
                return {
                    success: true,
                    error: '',
                    result: u
                }
            } else {
                return {
                    success: false,
                    error: 'Password is incorrect !',
                    result: []
                }
            }
        }

        return {
            success: false,
            error: 'Not found user !',
            result: []
        }
    } catch (error) {
        console.log('error:', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

const getUserById = async (id) => {
    try {
        const user = await Customer.findById(id);
        return {
            success: true,
            error: '',
            result: singleMoongoseToObject(user)
        }
    } catch (error) {
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

const changePassword = async (id, newPassword) => {
    try {
        const status = await Account.findByIdAndUpdate(id, { password: newPassword })
        return {
            success: true,
            error: '',
            result: singleMoongoseToObject(status)
        }
    } catch (error) {
        console.log('updateCustomer: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

const updateCustomer = async (data) => {
    try {
        const { name, address, phone, image, idCard, id } = data;
        const customerToUpdate = await Customer.findById(id);
        if (!customerToUpdate) {
            return {
                success: false,
                error: 'Not found customer !',
                result: []
            }
        }
        customerToUpdate.name = name;
        customerToUpdate.address = address;
        customerToUpdate.phone = phone;
        customerToUpdate.idCard = idCard;

        await customerToUpdate.save();
        return {
            success: true,
            error: '',
            result: singleMoongoseToObject(customerToUpdate)
        }
    } catch (error) {
        console.log('updateCustomer: ', error);
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
}

module.exports = {
    signUp,
    login,
    getUserById,
    changePassword,
    updateCustomer,
}