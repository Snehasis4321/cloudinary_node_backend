import express from "express";
import {
  streamAndUpload,
  deleteFile,
} from "./controllers/cloudinary_functions.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("hello from server");
});

app.post("/upload", (req, res) => streamAndUpload(req, res));

app.post("/delete", (req, res) => deleteFile(req, res));

app.listen(3000, () => {
  console.log("🚆 running on port 3000");
});
