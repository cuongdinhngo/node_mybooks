const pug = require('pug');
const helpers = require('../libs/Helpers');
const {User, beautyErrors} = require('../models/User');
const fs = require('fs');
const config = require('config');
const {logger} = require('../libs/Logger.js');

exports.list_users = async (req, res, next) => {
    logger.info(req.originalUrl);
    let templatePath = "views/admin/users/list.pug";
    let users = await User.find({deleted_at: {$exists: false}}).limit(20)
    res.send(pug.renderFile(templatePath, {users}));
}

exports.get_form_add_user = async (req, res, next) => {
    let templatePath = "views/admin/users/add.pug";
    const compiledFunction = pug.compileFile(templatePath);
    res.send(compiledFunction());
}

exports.get_form_edit_user = async (req, res, next) => {
    try {
        let templatePath = "views/admin/users/edit.pug";
        User.findById(req.params._id).exec((err, user) => {
            if (err) {
                user = {_id: req.params._id};
            }
            processUser(undefined, templatePath, err, user, req, res)
        });
    } catch (e) {
        res.send(e);
    }
}

exports.add_user = async (req, res, next) => {
    try {
        let templatePath = "views/admin/users/add.pug";
        let resMsg = undefined;
        User.create(req.body, (err, user) => {
            if (err) {
                user = {_id: req.params._id, ...req.body};
            }
            if (user) {
                resMsg = 'Inserted Successfully!';
            }
            processUser(resMsg, templatePath, err, user, req, res);
        })
    } catch (e) {
        res.send(e);
    }
}

exports.edit_user = async (req, res, next) => {
    try {
        let templatePath = "views/admin/users/edit.pug";
        User.findByIdAndUpdate(req.params._id, req.body, {new: true}).exec((err, user) => {
            if (err) {
                user = {_id: req.params._id, ...req.body};
            }
            processUser('Updated Successfully!', templatePath, err, user, req, res);
        });
    } catch (e) {
        res.send(e);
    }
}

exports.delete_user = async (req, res, next) => {
    try {
        let resMsg = undefined;
        let templatePath = "views/admin/users/list.pug";
        User.findByIdAndDelete(req.params._id).exec(async (err, user) => {
            let resData = undefined;
            let users = await User.find({deleted_at: {$exists: false}});
            if (err) {
                resData = {users, err: beautyErrors(err)};
            }
            if (user) {
                resData = {users, msg: 'Deleted Successfully!'};
            }
            res.send(pug.renderFile(templatePath, resData));
        });
    } catch (e) {
        res.send(e);
    }
}

function processUser(resMsg, templatePath, err, user, req, res){
    let errMsg = undefined;
    if (err) {
        errMsg = beautyErrors(err);
        res.send(pug.renderFile(templatePath, {user, err: errMsg}));
        return;
    }
    if (user) {
        res.send(pug.renderFile(templatePath, {user, msg: resMsg}));
    }
}
