const router = require("express").Router();
const Blog = require("../models/Blog");

// Your routing code goes here

router.get("/", (req, res) => {
  res.send("Hello");
});

//GET request

router.get("/blog", async (req, res) => {
  try {
    let pagesize = 5;
    const blog = await Blog.find({ topic: { $regex: req.query.search } })
      .skip((req.query.page - 1) * pagesize)
      .limit(pagesize);
    res.status(200).json({
      status: "success",
      result: blog,
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      massage: e.massage,
    });
  }
});

//POST requst

router.post("/blog", async (req, res) => {
  try {
    const blog = await Blog.create({
      topic: req.body.topic,
      description: req.body.description,
      posted_by: req.body.posted_by,
      posted_at: req.body.posted_at,
    });
    res.status(201).json({
      status: "Success",
      result: {
        id: blog.id,
        topic: blog.topic,
        description: blog.description,
        posted_at: blog.posted_at,
        posted_by: blog.posted_by,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
});

//PUT request

router.put("/blog/:id", async (req, res) => {
  try {
    await Blog.updateOne({ _id: req.params.id }, {
        topic: req.body.topic,
        description: req.body.description,
        posted_by: req.body.posted_by,
        posted_at: req.body.posted_at
    });
    const blog = await Blog.findOne({ _id: req.params.id });
    res.status(200).json({
      status: "Success",
      result: {
        id: blog.id,
        topic: blog.topic,
        description: blog.description,
        posted_at: blog.posted_at,
        posted_by: blog.posted_by,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      massage: "Id not found",
    });
  }
});

//DELETE request

router.delete("/blog/:id", async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: "Success",
      massage: "Data successfully deleted",
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      massage: e.massage,
    });
  }
});

router.get("*", (req, res) => {
  res.status(404).json({
    massage: "Page not found",
  });
});

module.exports = router;
