import mongoose from "mongoose";
import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";

export const createRepository = async (req, res) => {
  const { name, description, content, visibility, owner, issues } = req.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json({ message: "name of the repository is must" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid Owner!" });
    }

    const repo = new Repository({
      name,
      description,
      content,
      visibility,
      owner,
      issues,
    });

    const result = await repo.save();

    // save this repo into user model
    const user = await User.findById(owner);
    user.repositories.push(result);
    await user.save();

    res
      .status(201)
      .json({ message: "Repository created", repositoryId: result._id });
  } catch (err) {
    console.log("Error while creating repository : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getAllRepositories = async (req, res) => {
  try {
    const allRepos = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(allRepos);
  } catch (err) {
    console.log("Error while fetching repositories : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const fetchRepositoryByName = async (req, res) => {
  const name = req.params.name;

  try {
    const repo = await Repository.find({ name }).populate("owner");
    if (!repo) {
      return res.status(400).json({ message: "Repository does not exists!" });
    }

    res.json(repo);
  } catch (err) {
    console.log("Error while fetching repository : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const fetchRepositoryById = async (req, res) => {
  const id = req.params.id;

  try {
    const repo = await Repository.findById(id).populate("owner");
    if (!repo) {
      return res.status(400).json({ message: "Repository does not exists!" });
    }

    res.json(repo);
  } catch (err) {
    console.log("Error while fetching repository : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const fetchRepositoriesForCurrentUser = async (req, res) => {
  const { id } = req.params;

  try {
    const repositories = await Repository.find({ owner: id });
    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ message: "User Repositories not found!" });
    }

    res.json({ message: "User repositories found!", repositories });
  } catch (err) {
    console.log(
      "Error while fetching repositories for current user : ",
      err.message,
    );
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateRepositoryById = async (req, res) => {
  const { content, description } = req.body;
  const id = req.params.id;

  try {
    const updatedRepo = await Repository.findByIdAndUpdate(
      id,
      { content, description },
      { returnDocument: "after" },
    );

    if (!updatedRepo) {
      return res.status(400).json({ message: "Repository not found" });
    }

    res.json({ message: "Repository updated", updatedRepo });
  } catch (err) {
    console.log("Error while updating repository : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(400).json({ message: "Repository not found" });
    }

    repo.visibility = !repo.visibility;
    const result = await repo.save();

    res.json({ message: "visibility changed", repository: result });
  } catch (err) {
    console.log("Error while change repository visibility : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRepo = await Repository.findByIdAndDelete(id);

    if (!deletedRepo) {
      return res.status(400).json({ message: "Repository not found" });
    }

    res.json({ message: "Repository deleted" });
  } catch (err) {
    console.log("Error while deleting repository : ", err.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};
