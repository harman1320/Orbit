import Repository from "../models/repoModel.js";

const authorizeRepository = async (req, res, next) => {
  const { id } = req.params;
  try {
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository Not Found" });
    }

    if (repo.owner.toString() != req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to access this repository",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default authorizeRepository;
