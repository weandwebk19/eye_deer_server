const multer  = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = './public/image';
        if (!fs.existsSync(dest)){
            fs.mkdirSync(dest);
        }

        cb(null, dest);
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `avatar-${uniqueSuffix + path.extname(file.originalname)}`)
      }
  })
  
  const upload = multer({ storage: storage });
  module.exports = upload;