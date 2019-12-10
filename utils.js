const fs = require('fs');

function createDirectoryIfNotExists(directory){
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
}

function writeObjectToFileIfNotExists(filepath, obj){
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify(obj));
    }
}



module.exports = {createDirectoryIfNotExists, writeObjectToFileIfNotExists};