const { set } = require('lodash');
const mongoose = require('mongoose');
const config = require('config');

const publisherSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Publisher name is required!'], 
        unique: true
    },
    is_overseas: {
        type: Boolean,
        get: v => {
            return v ? 'Yes' : 'No';
        }
    },
    icon: {type: String},
    categories: {
        type: [String],
        set: v => {
            return v.map(item => item.replace(/\s/gi, '_'));
        },
        get: v => {
            return v.map(item => item.replace(/_/gi, ' '));
        },
        validate: {
            validator: function(v) {
                return v.length > 1;
            },
            message: function() {
                return 'Categories have at least one choice!';
            }
        }
    },
    description: {
        type: String,
        validate: {
            validator: function(v) {
                return v.length > 1;
            },
            message: function() {
                return 'Description has more detail!';
            }
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {type: Date},
});

publisherSchema.virtual('iconPath').get(function(){
    return config.get("upload_images.publishers.path") + this.icon;
});

const Publisher = mongoose.model('Publisher', publisherSchema);

exports.beautyErrors = (error) => {
    let errMsg = {};
    if (error.code == 11000) {
        errMsg["name"] = {message: `${error.keyValue.name} is already existed!`};
    }
    if (error.kind == "ObjectId" && error.path == "_id") {
        errMsg["_id"] = {message: "This publisher is not existed"};
    }
    return errMsg;
}

exports.Publisher = Publisher;