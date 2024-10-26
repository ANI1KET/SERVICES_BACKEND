import { Request, NextFunction, Response } from "express";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";

import { prismaClient } from "../server";
import { REFRESH_JWT_SECRET, ACCESS_JWT_SECRET } from "../env_variable";
import { BadRequestsException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/errorhandler";
import { LoginSchema, SignupSchema } from "../schemas/uers";
import { NotFoundException } from "../exceptions/not_found";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignupSchema.parse(req.body);

  const { email, name, password, number, role } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user)
    throw new BadRequestsException(
      "User already exist",
      ErrorCode.USER_ALREADY_EXIST
    );

  user = await prismaClient.user.create({
    data: {
      number,
      name,
      email,
      password: hashSync(password, 10),
      role,
    },
  });

  res.status(201).json(user);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  LoginSchema.parse(req.body);

  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user)
    throw new NotFoundException(
      "User does not exist",
      ErrorCode.USER_NOT_FOUND
    );

  if (!compareSync(password, user.password))
    throw new NotFoundException(
      "Incorrect email or password",
      ErrorCode.INCORRECT_EMAIL_PASSWORD
    );

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    ACCESS_JWT_SECRET,
    { expiresIn: "1h" }
  );

  const RefreshToken = jwt.sign(
    {
      userId: user.id,
    },
    REFRESH_JWT_SECRET,
    { expiresIn: "1h" }
  );

  // res.cookie("token", RefreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production", // Set to true in production to ensure secure cookies
  //   maxAge: 3 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
  //   sameSite: "strict",
  // });

  res.status(201).json({ user, accessToken });
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(req.user);
};
