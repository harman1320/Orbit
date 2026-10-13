import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.log("Error while fetching all users : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User Already Exists!" });
    }

    const isUserWithEmailFound = await User.findOne({ email });
    if (isUserWithEmailFound) {
      return res
        .status(400)
        .json({ message: `User with Email : ${email} Already Exists!` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUser: [],
      startRepo: [],
    });

    const result = await newUser.save();

    const token = jwt.sign(
      { id: result._id.toString() },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2d",
      },
    );

    res.json({ token, id: result._id.toString(), name: result.username });
  } catch (err) {
    console.log("Error during signup : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });

    res.json({ token, id: user._id, name: user.username });
  } catch (err) {
    console.log("Error during login : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id }).populate("repositories");
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    console.log("Error while fetching profile details : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { email, password } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, password: hashedPassword },
      { returnDocument: "after" },
    );

    res.json(updatedUser);
  } catch (err) {
    console.log("Error while updating the user profile : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const deleteUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id, {
      returnDocument: "after",
    });

    if (!deletedUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    res.json({ message: "User deleted!" });
  } catch (err) {
    console.log("Error while deleting the user profile : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};
