const pug = require('pug');
const helpers = require('../libs/Helpers');
const {Publisher, beautyErrors} = require('../models/Publisher');
const fs = require('fs');
const config = require('config');
const {logger} = require('../libs/Logger.js');

const categories = helpers.loadJsonData('books.categories');

exports.list_publishers = async (req, res, next) => {
    logger.info(req.originalUrl);
    let templatePath = "views/admin/publishers/list.pug";
    let publishers = await Publisher.find({deleted_at: {$exists: false}})
    res.send(pug.renderFile(templatePath, {publishers}));
}

exports.get_form_add_publishers = async (req, res, next) => {
    let templatePath = "views/admin/publishers/add.pug";
    const compiledFunction = pug.compileFile(templatePath);
    res.send(compiledFunction({categories}));
}

exports.get_form_edit_publisher = async (req, res, next) => {
    try {
        let templatePath = "views/admin/publishers/edit.pug";
        Publisher.findById(req.params._id).exec((err, publisher) => {
            if (err) {
                publisher = {_id: req.params._id};
            }
            processPublisher(undefined, templatePath, err, publisher, req, res)
        });
    } catch (e) {
        res.send(e);
    }
}

exports.add_publisher = async (req, res, next) => {
    try {
        if (req.body.images.length > 0) {
            req.body.icon = req.body.images.map(image => "" + image + "").join("");
        }
        let templatePath = "views/admin/publishers/add.pug";
        Publisher.create(req.body, (err, publisher) => {
            processPublisher('Inserted Successfully!', templatePath, err, publisher, req, res);
        });
    } catch (e) {
        res.send(e);
    }
}

exports.edit_publisher = async (req, res, next) => {
    try {
        if (req.body.images.length > 0) {
            req.body.icon = req.body.images.map(image => "" + image + "").join("");
        }
        let templatePath = "views/admin/publishers/edit.pug";
        Publisher.findByIdAndUpdate(req.params._id, req.body, {new: true}).exec((err, publisher) => {
            if (err) {
                publisher = req.body;
            }
            processPublisher('Updated Successfully!', templatePath, err, publisher, req, res);
        });
    } catch (e) {
        res.send(e);
    }
}

exports.delete_publisher = async (req, res, next) => {
    try {
        Publisher.findByIdAndDelete(req.params._id).exec((err, data) => {
            if (err) throw new Error("Deleted FAILED!");
            res.redirect('/api/publishers'); 
        });
    } catch (e) {
        res.send(e);
    }
}

function processPublisher(resMsg, templatePath, err, publisher, req, res){
    let errMsg = undefined;
    if (err) {
        if (req.body.icon) {
            fs.unlinkSync(config.get("upload_images.publishers.dest") + req.body.icon);
        }
        errMsg = beautyErrors(err);
        res.send(pug.renderFile(templatePath, {categories, publisher, err: errMsg}));
        return;
    }
    if (publisher) {
        res.send(pug.renderFile(templatePath, {categories , publisher, msg: resMsg}));
    }
}
