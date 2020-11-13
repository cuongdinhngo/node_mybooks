const {Publisher, beautyErrors} = require('../../models/Publisher');
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
        let templatePath = "views/admin/publishers/add.pug";
        res.send(pug.renderFile(templatePath, {categories , publisher: req.body, err: error.errors}));
        return;
    }
    next();
}