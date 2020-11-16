const mongoose = require('mongoose');
const config = require('config');
const {dbLogger} = require('../libs/Logger.js');

module.exports = function() {
    mongoose.connect(`mongodb://${config.get("mongo_db.credential")}@${config.get("mongo_db.host")}/${config.get("mongo_db.db_name")}`, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    mongoose.connection.on("open", function(ref) {
        console.log("[MONGODB STATUS] Connected to mongo server.");
    }); 
    mongoose.connection.on("error", function(err) {
        console.log("[MONGODB ERROR] Could not connect to MongoDB Server!");
        return console.log(err);
    });
    mongoose.set('debug', function(collectionName, methodName, ...methodArgs) {
        dbLogger.info(`MongoDB: ${collectionName}.${methodName}(${methodArgs.map(item => JSON.stringify(item)).toString()})`);
    });
}
