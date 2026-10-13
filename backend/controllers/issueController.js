import Issue from "../models/issueModel.js";
import Repository from "../models/repoModel.js";

export const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const repoID = req.params.id;
  try {
    if (!title) {
      return res
        .status(400)
        .json({ message: "title must be given to the issue!" });
    }

    if (!description) {
      return res
        .status(400)
        .json({ message: "description must be given to the issue!" });
    }

    const issue = new Issue({ title, description, repository: repoID });
    const result = await issue.save();

    const repo = await Repository.findById(repoID);
    repo.issues.push(result);
    await repo.save();

    res.status(201).json({ message: "Issue Created", issue: result });
  } catch (err) {
    console.error("Error Occurred during issue creation : ", err.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    if (!title || !description || !status) {
      return res
        .status(400)
        .json({ message: "Please provide necessary details" });
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true, runValidators: true },
    );
    if (!issue) {
      return res.status(404).json({ message: "issue not found" });
    }

    res.json({ message: "Issue updated", issue: issue });
  } catch (err) {
    console.error("Error Occurred during issue updation : ", err.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const deleteIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);
    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found!" });
    }

    res.json({ message: "Issue deleted successfully!" });
  } catch (err) {
    console.error("Error Occurred during deleting the issue : ", err.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

// all issues of a repository
export const getAllIssues = async (req, res) => {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error Occurred during issues fetching : ", err.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(400).json({ message: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (err) {
    console.error("Error Occurred during issue creation : ", err.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
