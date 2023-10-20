const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://lontebangsat062:agus12345@cluster0.aalujvg.mongodb.net/latihan-mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("uploads"));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/"); // Store uploaded files in the "uploads" folder
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname); // Rename files with a timestamp
  },
});

const upload = multer({ storage: storage });
   

const Image = mongoose.model("Image",{ 
   
    age: Number,
    kesukaan: [String], // Store an array of kesukaan
    name: String,
    images: [String]
  


  // Store an array of image filenames
  });

// Route to upload an image
app.post("/upload", upload.array("images"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const newImage = new Image({
   
    age: req.body.age,
    kesukaan: req.body.kesukaan,
    name: req.body.name,
    images: req.files.map((file) => file.filename)  
 
     // Store an array of image filenames
});

  try {
    await newImage.save();
    res.status(200).send("Images saved to the database.");
  } catch (error) {
    console.error("Error saving images:", error);
    res.status(500).send("Internal server error.");
  }
});

// Route to get all images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/images/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "uploads", filename);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found.");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



// const express = require("express");
// const cors = require("cors");
// const app = express();
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const Grid = require("gridfs-stream");
// const crypto = require("crypto");
// const GridFsStorage = require("multer-gridfs-storage");

// const url = "mongodb+srv://lontebangsat062:agus12345@cluster0.aalujvg.mongodb.net/latihan-mongodb";
// const port = 5000;

// app.use(cors());
// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


// const connection = mongoose.connection;
// connection.on("open", () => {
//   console.log("Database is connected");
// });

// let gfs;
// connection.once("open", () => {
//   gfs = Grid(connection.db, mongoose.mongo);
//   gfs.collection("uploads");
// });

// const storage = new GridFsStorage({
//   url: url,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

// const upload = multer({ storage });

// const latihanSchema = new mongoose.Schema({
//   nama: String,
//   umur: Number,
//   image: String, // Store the image file name
// });

// const LatihanModel = mongoose.model("Latihan", latihanSchema);

// app.post("/upload", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   const newEntry = new LatihanModel({
//     nama: req.body.nama,
//     umur: req.body.umur,
//     image: req.file.filename, // Store the image file name
//   });

//   try {
//     await newEntry.save();
//     res.status(200).send("Image saved to the database.");
//   } catch (error) {
//     console.error("Error saving image:", error);
//     res.status(500).send("Internal server error.");
//   }
// });

// app.get("/latihan", async (req, res) => {
//   try {
//     const training = await LatihanModel.find();
//     res.json(training);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.get("/image/:filename", (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: "No file exists",
//       });
//     }

//     const readstream = gfs.createReadStream(file.filename);
//     readstream.pipe(res);
//   });
// });

// app.listen(port, () => {
//   console.log(`The server is listening to : ${port}`);
// });

// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(result=> console.log("database is connected"))
// .catch(err => console.log(err))

// const latihanSchema = new mongoose.Schema({
//   nama: String,
//   umur:Number
// });

// const LatihanModel = mongoose.model("Latihan", latihanSchema);

// app.get("/latihan", async (req, res) => {
//   try {
//     const training = await LatihanModel.find()
//     res.json(training)
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// app.get("/",(req,res) =>{
//        res.send("hello anjing express gue ngulang lagi")
// })
// app.listen(port, () => {
//     console.log(`The server is listening to : ${port}`);
// });