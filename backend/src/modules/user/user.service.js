import { userModel } from "../../models/user/user.model.js";
import fs from "fs/promises";
import { resolve } from "path";
import { LOGOUT_FLAG } from "../../enums/user.enum.js";

export const uploadImage = async ({ user, path }) => {
  if (user.picture) {
    await fs.unlink(resolve(user.picture)).catch(() => {});
  }
  await userModel.updateOne(
    { _id: user._id },
    {
      picture: path,
    },
  );
};

export const uploadGallery = async ({ user, paths }) => {
  await userModel.updateOne(
    { _id: user._id },
    {
      $addToSet: { galleries: paths },
    },
  );
};

export const logoutService = async ({ user, flag = LOGOUT_FLAG.all }) => {
  if (flag == "all") {
    user.credentialChangedAt = Date.now();
    user.save();
  }
};
