import joi from "joi";
import { fileTypes } from "../middlewares/multer.middleware.js";

export const imageSchema = {
  file: joi.object({
    fieldname: joi.string().valid("image").required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi
      .string()
      .valid(...fileTypes.image)
      .required(),
    relativePath: joi.string().required(),
    destination: joi.string().required(),
    filename:  joi.string().required(),
    path:  joi.string().required(),
    size: 1080371,
  }),
};
