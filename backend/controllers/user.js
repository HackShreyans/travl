const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require('mongoose');


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }
  

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({ msg: "user logged in", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `your welcome in travel dashboard, your lucky trip number is ${luckyNumber}`,
  });
};

const getAllUsers = async (req, res) => {
 
  let users = await User.find({});

  return res.status(200).json({ users });
};
const getSingle = async (req, res) => {
  let id = req.params.userId
   


  const getUser = await User.findById(id);
  
  return res.status(200).json({data:getUser});
};


const editProfile = async (req, res) => {
  let _id = req.params.userId; 
  const { name, email, password } = req.body;

  try {
    const updatedUserData = {};
    if (name) updatedUserData.name = name;
    if (email) updatedUserData.email = email;
    if (password) updatedUserData.password = password;

    const user = await User.findByIdAndUpdate(_id, updatedUserData, { new: true });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};



const deleteUser = async (req, res) => {
  try {
    
    let id = req.params.userId
   


    const deletedUser = await User.findByIdAndDelete(id);
    console.log(deletedUser)
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log(deletedUser);
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  login,

  dashboard,
  getAllUsers,
  editProfile,
  deleteUser,
  getSingle
};
