

const removeFile = fileName => new Promise((resolve, reject) => {
    fs.unlink(fileName, (err) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve();
      console.log('filePath was deleted');
    });
  });