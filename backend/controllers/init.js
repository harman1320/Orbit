import fs from "node:fs/promises";
import path from "path";

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".orbitGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: process.env.S3_BUCKET }),
    );

    console.log("Repository Initialised!");
  } catch (err) {
    console.error("Error while initialising the repository!!!");
  }
}

export { initRepo };
