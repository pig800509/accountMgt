//const inspect = require('util').inspect
const path = require('path')
//const os = require('os')
const fs = require('fs')
const Busboy = require('busboy')

function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

function getSuffixName( fileName ) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

function uploadFile( ctx, options) {
  let req = ctx.req
  let busboy = new Busboy({headers: req.headers})

  let filePath = options.path;
  mkdirsSync( filePath )
  
  return new Promise((resolve, reject) => {
    console.log('Image uploading...')
    let result = { 
      success: false,
      message: '',
      data: null
    }

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename)
      let _uploadFilePath = path.join( filePath, fileName )
      let saveTo = path.join(_uploadFilePath)

      file.pipe(fs.createWriteStream(saveTo))

      file.on('end', function() {
        result.success = true
        result.message = 'Image upload success'
        result.data = {
          //pictureUrl: `//${ctx.host}/image/${fileType}/${fileName}`
          pictureUrl: `//${ctx.host}/image/${fileName}`,
          fileName:fileName
        }
        console.log('Image upload success！')
        resolve(result)
      })
    })

    busboy.on('finish', function( ) {
      console.log('Image upload complete')
      resolve(result)
    })

    busboy.on('error', function(err) {
      console.log('Upload image fail')
      reject(result)
    })

    req.pipe(busboy)
  })
    
} 


module.exports =  {
  uploadFile
}
