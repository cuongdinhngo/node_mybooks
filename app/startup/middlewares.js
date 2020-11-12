const express = require('express');
const path = require('path');
const morgan = require('morgan');
const moment = require('moment-timezone');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const {accessLogger} = require('../libs/Logger.js');

module.exports = function(app){

    //Express middlewares
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //Override Method
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
        }
    }))  

    //Setup logger: morgan + winston
    morgan.token('date', (req, res, tz) => {
        return moment().tz(tz).format();
    });
    morgan.format('myformat', ':remote-addr - :remote-user [:date[Asia/Ho_Chi_Minh]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');
    app.use(morgan('myformat', { stream: accessLogger.stream }));
    
    //Setup view
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
}