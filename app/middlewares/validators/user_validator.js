const Joi = require('joi');
const pug = require('pug');

let userSchema = Joi.object({
    first_name: Joi.string()
        .label('First Name')
        .alphanum()
        .min(1)
        .required()
        .messages({
            'string.base': `{#label} should be a type of 'text'`,
            'string.empty': `Please enter the {#label}!`,
            'string.min': `{#label} should have a minimum length of {#limit}`,
            'any.required': `{#label} is a required field`
            }),
    last_name: Joi.string()
        .label('Last name')
        .alphanum()
        .min(1)
        .required()
        .messages({
            'string.base': `{#label} should be a type of 'text'`,
            'string.empty': `Please enter the {#label}!`,
            'string.min': `{#label} should have a minimum length of {#limit}`,
            'any.required': `{#label} is a required field`
            }),
    email: Joi.string()
        .label('Email')
        .email()
        .required()
        .messages({
            'string.base': `{#label} should be a type of 'text'`,
            'string.empty': `Please enter the {#label}!`,
            'string.email': `{#label} must be right format of email`,
            'any.required': `{#label} is a required field`
            }),
    phone: Joi.any().optional(),
    address: Joi.any().optional(),
});

exports.validate = async (req, res, next) => {
    let userData = templatePath = undefined;
    if (req.originalUrl.indexOf('add') !== -1) {
        templatePath = "views/admin/users/add.pug";
        userSchema = userSchema.append({
            password: Joi.string()
                .label('Password')
                .min(6)
                .required()
                .messages({
                    'string.base': `{#label} should be a type of 'text'`,
                    'string.empty': `Please enter the {#label}!`,
                    'string.min': `{#label} should have a minimum length of {#limit}`,
                    'any.required': `{#label} is a required field`
                })
        });
        userData = req.body;
    }
    if (req.originalUrl.indexOf('edit') !== -1) {
        templatePath = "views/admin/users/edit.pug";
        userSchema = userSchema.append({
            _id: Joi.string()
                .label('User ID')
                .required()
                .messages({
                    'string.empty': `{#label} is not existed`,
                    'any.required': `{#label} is not existed`
                })
        });
        userData = {_id: req.params._id, ...req.body};
    }
    console.log(userData);
    const {error} = userSchema.validate(userData, {abortEarly: false});
    if (error) {
        res.send(pug.renderFile(templatePath, {user: userData, err: error.details}));
        return;
    }
    next();
}