import mongoose, { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jti: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

tokenSchema.index(
  { expiresIn: 1 },
  {
    expireAfterSeconds: 0,
  },
);

tokenSchema.index({ jti: 1 });
export const tokenModel = model("Token", tokenSchema);
