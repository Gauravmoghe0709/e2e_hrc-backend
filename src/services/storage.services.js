const Imagekit = require("imagekit");

const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Upload a file buffer to ImageKit
 * @param {Buffer} imageBuffer 
 * @param {string} fileName 
 * @param {string} folder - 
 */
async function uploadImage(imageBuffer, fileName, folder = "e2e-uploads") {
    const response = await imagekit.upload({
        file: imageBuffer,
        fileName: fileName,
        folder: folder
    });
    return response;
}

module.exports = uploadImage;