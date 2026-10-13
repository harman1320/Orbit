import fs from "node:fs/promises";
import path from "path";

async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".orbitGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));

    console.log(`File : ${fileName} successfully added to the staging area!`);
  } catch (err) {
    console.error("Error while executing add command : ", err);
  }
}

export { addRepo };
