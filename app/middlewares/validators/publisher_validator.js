const {Publisher} = require('../../models/Publisher');
const pug = require('pug');
const helpers = require('../../libs/Helpers');
const categories = helpers.loadJsonData('books.categories');

exports.validate = async (req, res, next) => {
    const publisher = new Publisher({
        name: req.body.name,
        is_overseas: req.body.is_overseas,
        categories: req.body.categories,
        description: req.body.description
    });
    let error = publisher.validateSync();
    if (error) {
        let templatePath = req.originalUrl.indexOf('add') !== -1 ? "views/admin/publishers/add.pug" : "views/admin/publishers/edit.pug";
        res.send(pug.renderFile(templatePath, {categories , publisher: req.body, err: error.errors}));
        return;
    }
    next();
}
