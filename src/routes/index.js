const siteRouter = require('./site');
const adminRouter = require('./admin');
const userRouter = require('./user');
const serviceRouter = require('./service');

// khai bao cac sub route voi app
const route = (app) => {
    app.use('/admin', adminRouter);
    app.use('/service', serviceRouter);
    app.use('/user', userRouter);
    app.use('/', siteRouter)
};

module.exports = route;