import { decodeToken } from "../utils/token.js";
import { errorRes } from "../utils/response.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const user = await decodeToken({
      token: authorization,
      tokenType: "access",
    });
    if (!user) {
      errorRes({ res, message: "user not found" });
    }

    console.log(user.credentialChangedAt);
    console.log(user);

    if (user.credentialChangedAt >= authorization.iat * 1000) {
      throw new Error("Invalid token (Session expired)");
    }
    req.user = user;
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
