const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publishers_controller.js');
const Image = require('../libs/Image.js');
const publisherValidator = require('../middlewares/validators/publisher_validator.js');

router.get('/', publisherController.list_publishers);

router.get('/add', publisherController.get_form_add_publishers);

router.post('/add', [Image.upload_image, Image.resize_image, publisherValidator.validate], publisherController.add_publisher);

router.get('/edit/:_id', publisherController.get_form_edit_publisher);

router.post('/edit/:_id', [Image.upload_image, Image.resize_image, publisherValidator.validate, ], publisherController.edit_publisher);

router.delete('/:_id', publisherController.delete_publisher);

module.exports = router;
