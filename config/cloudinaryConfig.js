import { config, uploader } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: 'karokojnr',
    api_key: '346784416385434',
    api_secret: 'oinDoqFA3NRMY66lPMV-M5NOCgQ',
  });
  next();
}

export { cloudinaryConfig, uploader };