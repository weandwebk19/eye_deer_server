const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env. CLOUDINARY_API_SECRET
});

const uploadImage = async (imagePath) => {
  const options = {
    use_filename: true,
    folder: 'WeAndWeb'
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);

    //delete image in local
    fs.unlinkSync(imagePath);

    //return url
    console.log(result.public_id, result.url);
    return result.url;
  } catch (error) {
    console.error(error);
  }
};

module.exports = uploadImage;

