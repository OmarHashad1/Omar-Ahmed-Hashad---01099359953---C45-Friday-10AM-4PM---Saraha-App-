import express from "express";
import { DBConnection } from "./config/db.js";
import "./models/user/user.virtuals.js";
import { userRouter } from "./modules/user/user.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { userModel } from "./models/user/user.model.js";
import { tokenModel } from "./models/token/token.model.js";
import cors from "cors";
import { connectRedisServer } from "./config/redis.js";

export const bootstrap = async () => {
  const app = express();

  const PORT = process.env.PORT;
  await DBConnection();
  await connectRedisServer();
  await userModel.createIndexes();


  app.use(express.json());
  app.use(cors());
  app.use("/uploads", express.static("./uploads"));
  app.use("/user", userRouter);
  app.use("/auth", authRouter);

  app.use((err, req, res, next) => {
    if (err) {
      res.status(err.cause?.status || 500).json({
        status: err.cause?.status || 500,
        message: err.message,
      });
    }
  });

  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
};
