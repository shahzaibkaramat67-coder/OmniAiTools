import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name:               string;
  email:              string;
  password?:          string;
  image?:             string;
  role:               "user" | "admin";
  credits:            number;
  plan:               "free" | "starter" | "pro";
  emailVerified:      boolean;
  googleId?:          string;
  resetToken?:        string;
  resetTokenExpires?: Date;
  createdAt:          Date;
  updatedAt:          Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name:               { type: String, required: true, trim: true },
    email:              { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:           { type: String, select: false },
    image:              { type: String },
    role:               { type: String, enum: ["user", "admin"], default: "user" },
    credits:            { type: Number, default: 10, min: 0 },
    plan:               { type: String, enum: ["free", "starter", "pro"], default: "free" },
    emailVerified:      { type: Boolean, default: false },
    googleId:           { type: String },
    resetToken:         { type: String, select: false },
    resetTokenExpires:  { type: Date,   select: false },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// Index for faster lookups
UserSchema.index({ resetToken: 1 }, { sparse: true });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
