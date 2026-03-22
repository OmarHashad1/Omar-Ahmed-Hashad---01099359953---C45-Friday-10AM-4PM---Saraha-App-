import { decodeToken } from "../utils/token.js";
import { errorRes } from "../utils/response.js";
import { tokenModel } from "../models/token/token.model.js";
import { get, revokedTokenKey } from "../db/redis.repo.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const {
      user,
      payload: { jti, iat },
    } = await decodeToken({
      token: authorization,
      tokenType: "access",
    });
    if (!user) {
      errorRes({ res, message: "user not found" });
    }
   
    if (await get(revokedTokenKey(jti, user._id)))
      return errorRes({ res, message: "Invalid login session" });

    req.user = user;
    req.decoded = { jti, iat };
    next();
  } catch (err) {
    errorRes({ res, message: err.message });
  }
};

export const checkRole = (allowed_roles = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!allowed_roles.includes(user.role))
      errorRes({ res, message: "user not authorized", status: 401 });

    return next();
  };
};
