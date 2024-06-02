const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");
const conversationRoute=require("./routes/conversations");
const messageRoute=require("./routes/messages");
const multer=require("multer");
const path = require("path");

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("Connected to MongoDB"))
.catch(error => {
    console.error("Error occurred while connecting to MongoDB");
    console.error(error);
});

app.use("/images", express.static(path.join(__dirname, "public/images"))); 
 
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

  const upload=multer({storage});
  

  app.post("/api/upload", upload.single("file"), (req, res) => {
    console.log("out");
    try {
        return res.status(200).json("File uploaded Successfully.");
    } catch (err) {
        console.error(err);
        return res.status(500).json("File upload failed.");
    }
});
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images"); // Set the destination folder for profile pictures
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, "profile-" + Date.now() + ext); // Set the filename to include a timestamp
    },
  });
  

// Initialize multer upload for profile pictures
const uploadProfilePicture = multer({storage:profilePictureStorage });

// Endpoint for uploading profile pictures
app.post("/api/upload/profile", uploadProfilePicture.single("profileImage"), (req, res) => {
    console.log("done");
  try {
      if (!req.file) {
          return res.status(400).json({ message: "No file uploaded." });
      }
      console.log("Profile picture uploaded successfully:", req.file.filename);
      return res.status(200).json({ message: "Profile picture uploaded successfully.", filename: req.file.filename });
  } catch (err) {
      console.error("Error uploading profile picture:", err);
      return res.status(500).json({ message: "Profile picture upload failed. what to do" });
  }
});

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.use("/api/conversations",conversationRoute);
app.use("/api/messages",messageRoute);
app.listen(8000, () => {
    console.log("Server running on port 8000");
});
