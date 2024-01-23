import filterObj from "../helpers/filterObject.js";
import { generateJWToken } from "../helpers/generateJWT.js";
import User from "../models/User.js";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { registerEmail } from "../helpers/mailer.js";

//REGISTER New User
async function register(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "password",
    "email"
  );

  //Check if a verified user with email exists.
  const existing_user = await User.findOne({ email });

  if (existing_user && existing_user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already in use, Please login",
    });
  } else if (existing_user) {
    const updated_user = await User.findOneAndUpdate({ email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    //
    req.userId = existing_user._id;
    next();
  } else {
    //User does not exist.
    const newUser = await User.create(filteredBody);

    //Generate OTP and send email to user.
    req.userId = newUser._id;
    req.email = newUser.email;
    req.firstName = newUser.firstName;

    next();
  }
}

//SEND OTP
async function sendOTP(req, res, next) {
  const { userId } = req;

  const newOtp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000;

  const userUpdated = await User.findById(userId);

  userUpdated.otp = newOtp.toString();
  userUpdated.otp_expiry_time = otp_expiry_time;
  userUpdated.save();

  // TODO. Send Mail

  registerEmail({
    email: req.email,
    name: req.firstName,
    newOtp,
  });

  return res.status(200).json({
    status: "Success",
    message: "OTP Send Successfully",
  });
}

//VERIFY OTP.
async function verifyOTP(req, res, next) {
  //Verify OTP and Update user

  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is Invalid or OTP expired",
    });
  }

  if (!(await user.correctOTP(otp))) {
    return res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  //OTP is correct

  user.verified = true;
  user.otp = "";

  await user.save();

  //Send JWT
  const token = generateJWToken(user._id);

  return res.status(200).json({
    status: "Success",
    message: "OTP verified successfully",
    token,
  });
}

//LOGIN User
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Both email and password are required",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password))) {
    return res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  }

  const token = generateJWToken(user._id);

  return res.status(200).json({
    status: "Success",
    message: "Logged in successfully",
    token,
  });
}

//? Protect The Routes. User Has to be Logged.
async function protect(req, res, next) {
  //1) Getting token (JWT) and check if it exist.
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return res.status(400).json({
      status: "error",
      message: "You are not logged In. Please log in to get access",
    });
  }

  //2) Verification Token.
  const decoded = await promisify(jwt.verify)(token, process.env.KEYWORD_JWT);

  //3) Check if user still exist.
  const this_user = await User.findById(decoded.id);

  if (!this_user) {
    return res.status(400).json({
      status: "error",
      message: "The user does not exist",
    });
  }

  //4) Check if user changed their password after token was issued.
  if (this_user.changedPasswordAfter(decoded.iat)) {
    return res.status(400).json({
      status: "error",
      message: "User recently updated password! Please log in again",
    });
  }

  //
  req.user = this_user;
  next();
}

async function forgotPassword(req, res, next) {
  // 1) Get Users email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "There is no user with given email address",
    });
  }

  // 2) Generate the random
  const resetToken = user.createPasswordResetToken();

  const resetURL = `https://tawk.com/auth/reset-password/?code=${resetToken}`;

  try {
    //TODO => Send Email with RESET URL

    return res.status(200).json({
      status: "Success",
      message: "Reset Password link sent to Email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "error",
      message: "There was an error sending the email, Please try again later.",
    });
  }
}

async function resetPassword(req, res, next) {
  //1) Get user based token.
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If Token has expired or submission is out of time window
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is invalid or expired",
    });
  }

  // 3) Update user password. and reset

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //4) Log in the user and send new JWT

  //TODO Send an email to user informing about password reset.

  const token = generateJWToken(user._id);

  return res.status(200).json({
    status: "Success",
    message: "Password Reseted Successfully",
    token,
  });
}

export {
  login,
  register,
  sendOTP,
  verifyOTP,
  protect,
  forgotPassword,
  resetPassword,
};
