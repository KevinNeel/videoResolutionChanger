var express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
var app = express();

const upload = require("./uploadVideo");
const expressFileUpload = require("express-fileupload");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

var ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg");

ffmpeg.setFfprobePath("C:/ffmpeg/bin/ffprobe");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", upload.single("video"), async (req, res) => {
  try {
    const file = req.file;
    console.log(file);

    let outputPathLar = "uploads/480/";
    let outputPathsmall = "uploads/380/";
    var command = ffmpeg()
      .input(file.path)
      .videoCodec("libx264")
      .output(outputPathLar + file.filename)
      .size("480x320")

      .output(outputPathsmall + file.filename)
      .size("780x620")

      .on("progress", function (progress) {
        console.log("... frames: " + progress.frames);
      })

      .on("end", function () {
        console.log("Videos converted");
      })

      .on("error", function (err) {
        console.error("this error:");
        console.error(err);
      })
      .exec(); //.run()
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
