import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      validate: {
        validator: function (email) {
          return String(email)
            .toLowerCase()
            .match(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
        },
      },
      message: (props) => "Email is invalid",
    },
    password: {
      type: String,
    },
    passwordConfirm: {
      type: String,
    },
    passwordChangeAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    otp_expiry_time: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //Only run if OTP Is Modified.
  if (!this.isModified("otp")) return next();

  // Hash OTP cost of 12
  this.otp = await bcrypt.hash(this.otp, 12);

  next();
});

userSchema.pre("save", async function (next) {
  //Only run if OTP Is Modified.
  if (!this.isModified("password")) return next();

  // Hash OTP cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctOTP = async function (candidateOTP) {
  return await bcrypt.compare(candidateOTP, this.otp);
};

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function(timestamp){
    return timestamp < this.passwordChangeAt;
}

const User = new mongoose.model("User", userSchema);

export default User;
