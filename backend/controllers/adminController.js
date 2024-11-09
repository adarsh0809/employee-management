import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Admin} from "../models/adminModel.js";
import HttpError from "../models/errorModel.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    
    if (!username || !email || !password) {
      return next(new HttpError("Fill in all the fields", 422));
    }

    const newEmail = email.toLowerCase();
    const emailExists = await Admin.findOne({ email: newEmail });

    if (emailExists) {
      return next(new HttpError("Email already exists", 422));
    }

    if (password.trim().length < 6) {
      return next(new HttpError("Password should be at least 6 characters"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      username,
      email: newEmail,
      password: hashedPass,
    });

    res.status(201).json(`New user ${newAdmin.email} is registered`);
  } catch (error) {
    return next(new HttpError("User registration failed", 422));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(new HttpError("Please fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();
    const admin = await Admin.findOne({ email: newEmail });

    if (!admin) {
      return next(new HttpError("Invalid credentials", 422));
    }

    const comparePass = await bcrypt.compare(password, admin.password);
    if (!comparePass) {
      
      return next(new HttpError("Wrong password", 422));
    }

    const { _id: id, username } = admin;
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, username });
  } catch (error) {
    return next(new HttpError("Login failed", 422));
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json({ admin });
  } catch (error) {
    return next(new HttpError(error));


  }
};
