const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");
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

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.listen(8000, () => {
    console.log("Server running on port 8000");
});
