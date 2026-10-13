import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import http from "node:http";
import { Server } from "socket.io";

import { initRepo } from "./controllers/init.js";
import { addRepo } from "./controllers/add.js";
import { commitRepo } from "./controllers/commit.js";
import { pushRepo } from "./controllers/push.js";
import { pullRepo } from "./controllers/pull.js";
import { revertRepo } from "./controllers/revert.js";
import { loginCLI } from "./controllers/loginCLI.js";
import connectDB from "./config/db-config.js";

import mainRouter from "./routes/main.router.js";

yargs(hideBin(process.argv))
  .command("start", "starts the server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    },
  )
  .command(
    "commit <message>",
    "Saves changes to local history",
    (yargs) => {
      yargs.positional("message", {
        describe: "Message to be displayed with commit",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command("push", "Push the changes to AWS S3", {}, async () => {
    await connectDB();
    await pushRepo();
  })
  .command("pull", "Pull the changes from AWS S3 bucket", {}, pullRepo)
  .command(
    "login <email> <password> <reponame>",
    "Login to Orbit",
    (yargs) => {
      yargs.positional("email", {
        describe: "Email of the user",
        type: "string",
      });
      yargs.positional("password", {
        describe: "password of the user",
        type: "string",
      });
      yargs.positional("reponame", {
        describe: "repository name which final code is going to push",
        type: "string",
      });
    },
    async (argv) => {
      await connectDB();
      await loginCLI(argv.email, argv.password, argv.reponame);
    },
  )
  .command(
    "revert <commitID>",
    "Revert to Specific Commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "ID of the commit you want to go back",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    },
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const MONGO_URI = process.env.MONGODB_URI;

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors({ origin: "*" })); // receive request from anywhere

  app.use("/", mainRouter);

  await connectDB();

  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      orgin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("Connection", (socket) => {
    socket.on("joinRoom", (userId) => {
      user = userId;
      console.log("======");
      console.log("User joined");
      console.log("======");
      socket.join(userId);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
