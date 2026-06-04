import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createSession,
  setSessionCookies,
} from '../services/auth.js';
import { Session } from '../models/session.js';
import { sendEmail } from "../utils/sendMail.js";
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';


export const registerUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  };

  const hashPassword = await bcrypt.hash(req.body.password, 10);


  const newUser = await User.create({
    email: req.body.email,
    password: hashPassword,
  });
  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  res.status(201).json(newUser);
};


export const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  };

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  };

  await Session.deleteOne({ userId: user._id });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId) {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  };

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, "No session");
  };

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Invalid session");
  };

  const isRefreshTokenExpired = session.refreshTokenValidUntil > new Date();
  if (!isRefreshTokenExpired) {
    await Session.deleteOne({ _id: session._id });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    throw createHttpError(401, "Invalid session");
  }

  await Session.deleteOne({ _id: sessionId });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    seession: "Sessoin updated!",
  });
};


// export const requestResetEmail = async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(200).json({
//       message: 'Password reset email sent successfully'
//     });
//   };
//   const resetToken = jwt.sign({
//     email: user.email,
//     sub: user._id,
//   }, process.env.JWT_SECRET, { expiresIn: '10m' });

//   const frontEndUrl = `${process.env.FRONTEND_URL}?token=${resetToken}`;
//   console.log(resetToken);

//   try {
//     await sendEmail({
//       from: process.env.SMTP_FROM,
//       to: req.body.email,
//       subject: 'Click <a href="${frontEndUrl}">here</a> to reset your password',
//     });
//   } catch (error) {
//     throw createHttpError(500, error);
//   };

//   res.status(200).json({
//     message: "Password reset email sent successfully"
//   });
// };


export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: 'Password reset email sent successfully'
    });
  }


  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  try {

    const templatePath = path.resolve('src/templates/reset-password-email.html');


    const templateSource = await fs.readFile(templatePath, 'utf-8');


    const template = handlebars.compile(templateSource);


    const domain = process.env.FRONTEND_DOMAIN || 'http://localhost:3000';
    const resetLink = `${domain}/reset-password?token=${resetToken}`;


    const html = template({
      name: user.username || user.email,
      link: resetLink,
    });


    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });

  } catch (error) {

    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    message: "Password reset email sent successfully"
  });
};



export const resetPassword = async (req, res) => {

  let payload;
  try {
    payload = jwt.verify(
      req.body.token,
      process.env.JWT_SECRET
    );
  }
  catch {
    throw createHttpError(401, "Invalid or expired token");
  };

  const user = await User.findOne({
    _id: payload.sub,
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(404, "No User");
  };

  const hashPassword = await bcrypt.hash(req.body.password, 10);
  await User.updateOne({
    _id: user._id
  },
    {
      password: hashPassword
    });


  await Session.deleteMany({ userId: user._id });
  res.status(200).json({
    message: "Success"
  });
};
