const { FSx } = require('aws-sdk');
const e = require('express');
const express = require('express');
const router = express.Router();
const pug = require('pug');
const helpers = require('../libs/Helpers');
const Publisher = require('../models/Publisher');
const fs = require('fs');
const config = require('config');
const { reject } = require('lodash');
const { resolve } = require('path');

const categories = helpers.loadJsonData('books.categories');

exports.list_publishers = async (req, res, next) => {
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
            let errMsg = undefined;
            if (err) {
                if (err.kind == "ObjectId" && err.path == "_id") {
                    errMsg = `This publisher is not existed`;
                    console.log(`[ERROR] === ${errMsg}`);
                }
                res.redirect('/api/publishers');
            }
            if (publisher) {
                const compiledFunction = pug.compileFile(templatePath);
                res.send(compiledFunction({categories, publisher}));
            }
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
        Publisher.create(req.body, (err, data) => {
            let errMsg = undefined;
            if (err) {
                console.log(err);
                if (req.body.icon) {
                    fs.unlinkSync(config.get("upload_images.publishers.dest") + req.body.icon);
                }
                if (err.errors && err.errors["name"] && err.errors["name"].message) {
                    errMsg = err.errors["name"].message;
                }
                if (err.name == "MongoError" && err.code == 11000) {
                    errMsg = "This name is already used!"
                }
                res.send(pug.renderFile(templatePath, {categories , err: errMsg}));
            }
            if (data) {
                res.send(pug.renderFile(templatePath, {categories , msg: "Inserted Successfully!"}));
            } 
        });
    } catch (e) {
        console.log('===============');
        res.send(e);
    }
}

exports.edit_publisher = async (req, res, next) => {
    try {
        let publisher = await Publisher.findByIdAndUpdate(req.params._id, req.body, {new: true});
        if (req.body.images.length > 0) {
            req.body.icon = req.body.images.map(image => "" + image + "").join("");
        }
        let templatePath = "views/admin/publishers/edit.pug";
        Publisher.findByIdAndUpdate(req.params._id, req.body, {new: true}).exec((err, publisher) => {
            let errMsg = undefined;
            if (err) {
                console.log(err);
                if (req.body.icon) {
                    fs.unlinkSync(config.get("upload_images.publishers.dest") + req.body.icon);
                }
                if (err.errors && err.errors["name"] && err.errors["name"].message) {
                    errMsg = err.errors["name"].message;
                }
                if (err.name == "MongoError" && err.code == 11000) {
                    errMsg = "This name is already used!"
                }
                res.send(pug.renderFile(templatePath, {categories , err: errMsg}));
            }
            if (publisher) {
                console.log(publisher);
                res.send(pug.renderFile(templatePath, {categories , publisher, msg: "Updated Successfully!"}));
            } 
        });
    } catch (e) {
        console.log('*********************');
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
