const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller.js');
const userValidator = require('../middlewares/validators/user_validator.js');

router.get('/', userController.list_users);

router.get('/add', userController.get_form_add_user);

router.post('/add', userValidator.validate, userController.add_user);

router.get('/edit/:_id', userController.get_form_edit_user);

router.post('/edit/:_id', userValidator.validate, userController.edit_user);

router.delete('/:_id', userController.delete_user);

module.exports = router;
