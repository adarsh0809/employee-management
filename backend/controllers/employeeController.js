import { cloudinary, storage } from '../cloudconfig.mjs'; // Import ES module
import {Employee} from "../models/employeeModel.js"; // Ensure the model is in ES module syntax
import HttpError from "../models/errorModel.js"; // Ensure the error model is in ES module syntax
import validator from "validator";

const createEmployee = async (req, res, next) => {
  try {
    const { name, email, mobile, designation, gender, courses } = req.body;
    console.log(req.body);
    
    if (!name || !email || !mobile || !designation || !gender || !courses) {
      return next(new HttpError("fill in all the fields", 422));
    }

    const isValidEmail = (email) => validator.isEmail(email);

    if (isValidEmail(email)) {
      let image = "";

      const emailExists = await Employee.findOne({ email: email });

      if (emailExists) {
        return next(new HttpError("email already Exists", 422));
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, storage);
        image = result.secure_url;
      }

      const employees = await Employee.find();
      const id = employees.length + 1;

      const newEmployee = await Employee.create({
        id,
        name,
        email,
        mobile,
        designation,
        gender,
        courses,
        image,
      });

      res.status(201).json(`new employee ${newEmployee.email} id created`);
    } else {
      return next(new HttpError("invalid email", 422));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ employees });
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return next(new HttpError("employee not found", 404));
    }
    res.status(200).json({ employee });
  } catch (error) {
    return next(new HttpError(error));
  }
};

const editEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    let { name, email, mobile, designation, gender, courses } = req.body;

    const existingEmployee = await Employee.findById(id);

    if (!existingEmployee) {
      return next(new HttpError("Employee not found", 404));
    }

    if (email !== existingEmployee.email) {
      const isValidEmail = (email) => validator.isEmail(email);
      if (isValidEmail(email)) {
        const emailExists = await Employee.findOne({
          email: email,
        });

        if (emailExists) {
          return next(new HttpError("Email already exists", 422));
        }

        existingEmployee.email = email;
      } else {
        return next(new HttpError("invalid email", 422));
      }
    }

    if (name) existingEmployee.name = name;
    if (mobile) existingEmployee.mobile = mobile;
    if (designation) existingEmployee.designation = designation;
    if (gender) existingEmployee.gender = gender;
    if (courses) existingEmployee.courses = courses;

    let updatedImage;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedImage = result.secure_url;
      existingEmployee.image = updatedImage;
    }

    await existingEmployee.save();

    res.status(200).json(`Employee ${existingEmployee.email} updated successfully`);
  } catch (error) {
    return next(new HttpError("Employee update failed", 422));
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return next(new HttpError("couldn't delete employee", 422));
    }

    res.status(203).json(`Deleted employee ${employee.name}`);
  } catch (error) {
    return next(new HttpError("couldn't delete employee", 422));
  }
};

export { createEmployee, getEmployees, getEmployee, editEmployee, deleteEmployee };
