const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.post("/",async(req,res)=>{
  try{
    const task = await Task.create({
      title: req.body.title,
    });
    res.status(201).json(task);
  }catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/",async(req,res)=>{
  try{
    const task = await Task.find();
    res.status(200).json(task);
  }catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
});
router.put("/:id",async(req,res)=>{
  try{
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );
    res.status(200).json(updatedTask);
  }catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
});
router.delete("/:id",async(req,res)=>{
  try{
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message:"Task deleted sucessfully",
      deletedTask,
    });
  }catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;