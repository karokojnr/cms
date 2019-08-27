const multer = require('multer');
const dataUri = require('datauri');
const path = require('path');

//!multer.diskStorage() creates a storage space for storing files. 

const storage = multer.memoryStorage;
const multerUploads = multer({ storage }).single('file');export { multerUploads };
const dUri = new Datauri();

//! @description  This function converts the buffer to data url
//!  @param {Object} req containing the field object
//! @returns {String} The data url from the string buffer

const dataUri = req => 
dUri.format(path.extname(req.file.originalname).toString(),
req.file.buffer);
export { multerUploads, dataUri };