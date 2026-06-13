const Task = require("./models/Task");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const dotenv = require("dotenv");
require("dotenv").config();
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);
app.get("/",(req,res)=>{
  res.send("Todo API Running")
});
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});