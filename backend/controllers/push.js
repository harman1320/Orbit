import fs from "node:fs/promises";
import path from "path";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws-config.js";
import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".orbitGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitPath = await getLatestCommit(commitsPath);

    const dirContents = await fs.readdir(commitPath);
    const { id, reponame } = JSON.parse(
      await fs.readFile(path.join(repoPath, "config.json"), "utf-8"),
    );

    const user = await User.findById(id).populate("repositories");
    const repo = user.repositories.find((r) => r.name == reponame);

    if (!repo) {
      console.log(
        `you are not having any repo on orbit with name : ${reponame}. Please create a repository on orbit first.`,
      );
      return;
    }

    for (let dir of dirContents) {
      const dirPath = path.join(commitPath, dir);
      let data = null;

      if (dir == "commit.json") {
        continue;
      }

      const stat = await fs.stat(dirPath);
      if (stat.isDirectory()) {
        // another loop
      }

      if (stat.isFile()) {
        data = await fs.readFile(dirPath, "utf-8");

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${reponame}/${dir}`,
          Body: data,
        };

        repo.content.push(`${reponame}/${dir}`);

        const command = new PutObjectCommand(params);
        await s3.send(command);
      }
    }

    await repo.save();
    console.log("All files pushed to S3");
  } catch (err) {
    console.error("Error Ocurred while executing push command : ", err);
  }
}

// get latest commit
async function getLatestCommit(commitsPath) {
  try {
    const commitDirs = await fs.readdir(commitsPath);

    let latestCommit = null;
    let latestDate = 0;

    for (let commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);

      const stat = await fs.stat(commitPath);

      if (!stat.isDirectory()) {
        continue;
      }

      const commitJsonPath = path.join(commitPath, "commit.json");
      const commitData = JSON.parse(await fs.readFile(commitJsonPath, "utf-8"));

      const commitDate = new Date(commitData.date).getTime();

      if (commitDate > latestDate) {
        latestDate = commitDate;
        latestCommit = commitDir;
      }
    }

    const commitPath = path.join(commitsPath, latestCommit);
    return commitPath;
  } catch (err) {
    console.error("Error while fetching latest commit : ", err);
  }
}

export { pushRepo };
