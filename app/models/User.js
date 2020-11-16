const mongoose = require('mongoose');
const config = require('config');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: [true, 'First name is required!']
    },
    last_name: {
        type: String, 
        required: [true, 'Publisher name is required!']
    },
    email: {
        type: String, 
        required: [true, 'Email is required!'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
            },
            message: function () {
                return 'Email is invalid format!';
            }
        }
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Password is required!']
    },
    token: {
        type: String,
        select: false
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

userSchema.virtual('fullname').get(function(){
    return `${this.first_name} ${this.last_name}`;
});

userSchema.methods.generateToken = function () {
    let jwtPrivateKey = config.get("secretKey");
    return jwt.sign({
        _id: this._id, email: this.email, phone: this.phone, 
        first_name: this.first_name, last_name: this.last_name
    }, jwtPrivateKey);
}


const User = mongoose.model('User', userSchema);

exports.beautyErrors = (error) => {
    let errMsg = {};
    if (error.code == 11000) {
        errMsg["email"] = {message: `${error.keyValue.email} is already existed!`};
    }
    if (error.kind == "ObjectId" && error.path == "_id") {
        errMsg["_id"] = {message: "This user is not existed"};
    }
    return errMsg;
}

exports.User = User;
