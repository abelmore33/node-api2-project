// implement your posts router here
const express = require("express");
const Post = require("./posts-model");

const router = express.Router();

router.get("", async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
    console.log(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

router.get("/:id", async (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specific ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be retreived" });
    });
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  }
  Post.insert({ title, contents })
    .then(({ id }) => {
      return Post.findById(id);
    })
    .then((newPost) => {
      res.status(201).json(newPost);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an error while saving the post to the database",
        err: err.message,
      });
    });
});

router.put("/:id", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.findById(req.params.id)
      .then((content) => {
        if (!content) {
          res
            .status(404)
            .json({ message: "The post with the specified Id does not exist" });
        } else {
          return Post.update(req.params.id, req.body);
        }
      })
      .then((newPost) => {
        console.log(newPost);
      })
      .catch((err) => {
        res.status(500).json({
          message: "The post information could not br modified",
          err: err.message,
        });
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await Post.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({ message: "Te post could not be removed" });
  }
});
module.exports = router;
