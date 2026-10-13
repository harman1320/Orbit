import fs from "node:fs/promises";
import path from "node:path";

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".orbitGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);
    const files = await fs.readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      await fs.copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log("revert successfull");
  } catch (err) {
    console.error("Error Ocurred while executing revert command : ", err);
  }
}

export { revertRepo };
