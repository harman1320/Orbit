import fs from "node:fs/promises";
import path from "path";
import User from "../models/userModel.js";

async function loginCLI(email, password, repo) {
  try {
    const res = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.log(error.message || "CLI login error");
      return;
    }

    const data = await res.json();

    // check whether user is having the repo provided in the fnx parameter
    const user = await User.findById(data.id).populate("repositories");
    const isRepo = user.repositories.find((r) => r.name == repo);

    if (!isRepo) {
      console.log(
        `You do not have any repository with name : ${repo}. Please create a repo on orbit before executing this command`,
      );
      return;
    }

    // send the user details in config.json file
    const repoPath = path.resolve(process.cwd(), ".orbitGit");
    const filePath = path.join(repoPath, "config.json");

    await fs.writeFile(
      filePath,
      JSON.stringify({
        token: data.token,
        id: data.id,
        name: data.name,
        reponame: repo,
      }),
    );

    console.log(`Welcome ${data.name}`);
  } catch (err) {
    console.log("Error while executing 'login' command : ", err.message);
  }
}

export { loginCLI };
