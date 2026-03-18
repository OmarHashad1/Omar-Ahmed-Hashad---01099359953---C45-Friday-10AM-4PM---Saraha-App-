import { Router } from "express";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { errorRes, successRes } from "../../utils/response.js";
import { ROLE } from "../../enums/user.enum.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { logoutService, uploadGallery, uploadImage } from "./user.service.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { imageSchema } from "../../schemas/file.schema.js";

export const userRouter = new Router();

userRouter.get(
  "/profile",
  auth,
  checkRole([ROLE.admin, ROLE.user]),
  (req, res) => {
    successRes({ res, data: req.user });
  },
);

userRouter.post(
  "/profile/image",
  auth,
  upload({ dest: "users" }).single("image"),
  async (req, res, next) => {
    try {
      await uploadImage({ user: req.user, path: req.file.relativePath });
      successRes({ res, message: "Profile uploaded successfully" });
    } catch (err) {
      errorRes({ res, message: err.message });
    }
  },
);

userRouter.post(
  "/upload-gallery",
  auth,
  upload({ dest: "/users/gallery" }).array("gallery", 4),
  validate(imageSchema),
  async (req, res) => {
    try {
      const paths = req.files.map((file) => file.relativePath);
      successRes({ res, message: "Gallery Uploaded Successfully!" });
      await uploadGallery({ user: req.user, paths });
    } catch (err) {
      errorRes({ res, message: err.message });
    }
  },
);

userRouter.post("/logout", auth, async (req, res) => {
  try {
    const { flag } = req.body;
    await logoutService({ user: req.user, flag });
    successRes({ res, message: "Logout successfully" });
  } catch (err) {
    errorRes({ res, message: err.message, status: err.cause?.status || 400 });
  }
});
