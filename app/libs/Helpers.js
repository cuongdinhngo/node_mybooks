const fs = require('fs');

const dataPath = "data";

exports.loadJsonData = function(keys) {
    try {
        keys = keys.split('.');
        const filePath = `${dataPath}/${keys.shift()}.json`;
        const jsonData = JSON.parse(fs.readFileSync(filePath));
        let result = jsonData;
        for (let key of keys) {
            result = result[key];
        }
        return result;
    } catch (e) {
        throw new Error(e);
    }
}