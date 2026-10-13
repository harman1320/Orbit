import fs from "node:fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".orbitGit");
  const stagingPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitID = uuidv4();
    const commitPath = path.join(commitsPath, commitID);
    await fs.mkdir(commitPath, { recursive: true });

    const files = await fs.readdir(stagingPath);

    for (const file of files) {
      await fs.copyFile(
        path.join(stagingPath, file),
        path.join(commitPath, file),
      );
    }

    await fs.writeFile(
      path.join(commitPath, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() }),
    );

    console.log(`Commit ${commitID} created with message ${message}`);
  } catch (err) {
    console.log("Error ocuured while executing commit command : ", err);
  }
}

export { commitRepo };
