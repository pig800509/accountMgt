const fileSystem = require('file-system');
const path = require('path');
const IDGen = require('./IDGenerator')

module.exports = (ctx) => {
    console.log("photo uploading...");
    let filename = IDGen.genIdInDatetimeForm();
    let body = ctx.request.body;
    let dirPath = path.join(__dirname, '../public/thumbnail');
    let fullfilename = filename + '.' + body.files.photo.name.split('.').pop();
    fileSystem.mkdirSync(dirPath);
    let file = body.files.photo;
    let reader = fileSystem.createReadStream(file.path);
    let stream = fileSystem.createWriteStream(path.join(dirPath, fullfilename));
    reader.pipe(stream);
    console.log("photo uploading...");
    let photo_url = `/public/thumbnail/${fullfilename}`;
    return {
        "photo_filename": fullfilename,
        "photo_url": photo_url,
        "photo_preview_url": ctx.host + photo_url
    };
}