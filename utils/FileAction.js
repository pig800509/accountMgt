const fileSystem = require('fs');
const path = require('path');
const IDGen = require('./IDGenerator')

const dirPath = path.join(__dirname, '../public/thumbnail');

exports.uploadPhoto = (ctx) => new Promise(
    (resolve, reject) => {
    console.log("photo uploading...");
    let filename = IDGen.genIdInDatetimeForm();
    let body = ctx.request.body;
    let fullfilename = filename + '.' + body.files.photo.name.split('.').pop();
    //fileSystem.mkdirSync(dirPath);
    let file = body.files.photo;
    try {
        let reader = fileSystem.createReadStream(file.path);
        let stream = fileSystem.createWriteStream(path.join(dirPath, fullfilename));
        reader.pipe(stream);
        //reader.end();
        //stream.end();
        let photo_url = `/thumbnail/${fullfilename}`;
        resolve({
            "photo_filename": fullfilename,
            "photo_url": photo_url,
            "photo_preview_url": ctx.host + photo_url
        });
        /*
        let photo_url = `/public/thumbnail/${fullfilename}`;
        return {
            "photo_filename": fullfilename,
            "photo_url": photo_url,
            "photo_preview_url": ctx.host + photo_url
        };
        */
    }catch (err){
      console.log(err);
      reject(err);
    }
});

exports.deletePhoto = fileName => new Promise((resolve, reject) => {
    fileSystem.unlink(dirPath+"/"+fileName, (err) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve();
      console.log(fileName + ' was deleted');
    });
  });