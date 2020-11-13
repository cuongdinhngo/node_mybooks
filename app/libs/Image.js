const multer  = require('multer');
const sharp = require('sharp');
const config = require('config');
const { v4: uuidv4 } = require('uuid');

exports.upload_image = (req, res, next) => {
    let type = config.get("upload_images.types").filter(item => req.originalUrl.indexOf(item)).toString();
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb("Please upload only images.", false);
        }
    };
    
    const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });

    let imageInfo = config.get(`upload_images.${type}`);
    const uploadFiles = upload.fields(imageInfo.fields);

    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.send("Too many files to upload.");
            }
        } else if (err) {
            return res.send(err);
        }
        next();
    });
};

exports.resize_image = async (req, res, next) => {
    let type = config.get("upload_images.types").filter(item => req.originalUrl.indexOf(item)).toString();
    let imageInfo = config.get(`upload_images.${type}`);
    let [width, height] = imageInfo.size;
    req.body.images = [];

    for (let [key, value] of Object.entries(req.files)) {
        await Promise.all(
            value.map(async file => {
                const [filename, extension] = file.originalname.split('.');
                const newFilename = `${uuidv4()}.${extension}`;

                await sharp(file.buffer)
                .resize(width, height)
                .toFile(`${imageInfo.dest}${newFilename}`);
        
                req.body.images.push(newFilename);
            })
        ); 
    }  
    next();
};
