import { userModel } from "../../models/user/user.model.js";
import fs from "fs/promises";
import { resolve } from "path";
import { LOGOUT_FLAG } from "../../enums/user.enum.js";
import { create } from "../../db/db.repo.js";
import { tokenModel } from "../../models/token/token.model.js";
import { revokedTokenKey, set } from "../../db/redis.repo.js";

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

export const logoutService = async ({
  user,
  flag = LOGOUT_FLAG.all,
  jti,
  iat,
}) => {
  if (flag == LOGOUT_FLAG.all) {
  }
  switch (flag) {
    case LOGOUT_FLAG.all: {
      user.credentialChangedAt = Date.now();
      await user.save();
      break;
    }
    case LOGOUT_FLAG.device: {
  
      await set(revokedTokenKey(jti, user._id), jti, 7 * 24 * 60 * 60);
      break;
    }
    default:
      throw new Error("Invalid Logout flag");
  }
};
