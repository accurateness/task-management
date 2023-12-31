import "dotenv/config";
import mongoose from "mongoose";
mongoose.Promise = require("bluebird");

import app from "./app";

const port = process.env.APP_PORT || 1010;
const dbIP = process.env.DB_IP || "127.0.0.1";
const dbName = process.env.DB_NAME || "task_db";

mongoose
  .connect(`mongodb://${dbIP}:27017/${dbName}`)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit();
  });

const server = app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
