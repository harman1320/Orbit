import fs from "node:fs/promises";
import path from "node:path";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "../config/aws-config.js";

const S3_BUCKET = process.env.AWS_BUCKET_NAME;

async function pullRepo() {
  try {
    const repoPath = path.join(process.cwd(), ".orbitGit");
    const configPath = path.join(repoPath, "config.json");

    const configData = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(configData);

    const repoName = config.reponame;

    if (!repoName) {
      console.log("Repository name not found in config.json");
      return;
    }

    console.log(`Pulling repository: ${repoName}`);

    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: `${repoName}/`,
      }),
    );

    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;
      const relativePath = key.substring(`${repoName}/`.length);

      if (!relativePath) {
        continue;
      }
      const localPath = path.join(process.cwd(), relativePath);

      // Download file from S3
      const fileContent = await s3.send(
        new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
        }),
      );

      const body = await fileContent.Body.transformToByteArray();

      await fs.writeFile(localPath, body);

      console.log(`Pulled: ${relativePath}`);
    }

    console.log("Repository pulled successfully!");
  } catch (err) {
    console.error("Error while pulling repository:", err);
  }
}

export { pullRepo };
