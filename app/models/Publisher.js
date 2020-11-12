const { set } = require('lodash');
const mongoose = require('mongoose');
const config = require('config');

const publisherSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Publisher name is required!'], 
        unique: [true, "This name is already used!"]
    },
    is_overseas: {
        type: Boolean,
        get: v => {
            return v ? 'Yes' : 'No';
        }
    },
    icon: {type: String},
    categories: {
        type: Array,
        set: v => {
            return v.map(item => item.replace(/\s/gi, '_'));
        },
        get: v => {
            return v.map(item => item.replace(/_/gi, ' '));
        }
    },
    description: {type: String},
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

module.exports = Publisher;