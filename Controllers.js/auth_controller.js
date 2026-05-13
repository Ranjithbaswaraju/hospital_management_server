const AuthModel = require("../Models/AuthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretkey = process.env.secretkey;
const Register = async (req, res) => {
  try {
    const { name, email, password, role, dob, phone } = req.body;

    const userExist = await AuthModel.findOne({ email });

    if (userExist) {
      return res.status(500).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const User = await AuthModel.create({
      name,
      email,
      password: hashPassword,
      role,
      dob,
      phone,
    });

    res.status(200).json({
      status: true,
      message: "User Registered Successfully",
      User,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await AuthModel.findOne({ email });

    if (!userExist) {
      return res.status(500).json({
        status: false,
        message: "User Not Found",
      });
    }

    const comparePassword = await bcrypt.compare(password, userExist.password);

    if (!comparePassword) {
      return res.status(500).json({
        status: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        role: userExist.role,
      },
      secretkey,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
      user: userExist,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "Unable to Login",
    });
  }
};
const Logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Unable to Logout",
    });
  }
};

const profile = async (req, res) => {
  try {
    const userData = await AuthModel.findById(req.user.id).select("-password");
    return res.status(200).json({
      success: true,
      userData,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

module.exports = { Register, Login, Logout, profile };
