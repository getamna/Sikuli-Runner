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


function readDirSortedByTime(directory){

    let fileList = fs.readdirSync(directory);
    let fileMetadata = []
    for(let fileName of fileList){
        let file = {
            name: fileName,
            time:  fs.statSync(directory + '/' + fileName).mtime.getTime()
        }
        fileMetadata.push(file)
    }

    return fileMetadata.sort((a,b) => {return a.time - b.time})
}

module.exports = {createDirectoryIfNotExists, writeObjectToFileIfNotExists, readDirSortedByTime};