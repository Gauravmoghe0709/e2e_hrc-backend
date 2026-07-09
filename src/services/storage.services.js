const Imagekit = require("imagekit");

const imagekit = process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT
    ? new Imagekit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    })
    : null;

/**
 * Upload a file buffer to ImageKit
 * @param {Buffer} imageBuffer 
 * @param {string} fileName 
 * @param {string} folder - 
 */
async function uploadImage(imageBuffer, fileName, folder = "e2e-uploads") {
    if (!imagekit) {
        throw new Error("ImageKit credentials are not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.");
    }

    const response = await imagekit.upload({
        file: imageBuffer,
        fileName: fileName,
        folder: folder
    });
    return response;
}

module.exports = uploadImage;