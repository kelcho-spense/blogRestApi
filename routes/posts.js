const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

//CREATE POST
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    } 
});
//DELETE Post
router.delete("/:id",async (req,res)=>{
    const post = await Post.findById(req.params.id); //check if the post exists via id
    if(req.body.username == post.username){
        try{
            await post.delete();     
               res.status(200).json("Post has been deleted...");
            }catch(err){
            res.status(500).json(err);
            }
            
    }else {
        res.status(500).json("U can only delte your own Post!");            
    }
});

//GET one Post
router.get("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json("post not found " + error);
    }
});
//GET all Post
router.get("/",async (req,res)=>{
    const username = req.query.user;
    const catname = req.query.cat;
    try { 
        let posts;
        if(username){
            posts = await Post.find({username});
        } else if(catname){
            posts = await Post.find({
                categories: {
                    $in: [catname],
                },
            });
        } else {
          posts = await Post.find();       
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});
//UPDATE post
router.put("/:id",async (req,res)=>{
    const post = await Post.findById(req.params.id); //check if the post exists via id
    if(req.body.username == post.username){
        try{
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                {$set:req.body},
                {new:true}
            );     
               res.status(200).json(updatedPost);
            }catch(err){
            res.status(500).json(err);
            }
            
        }else {
            res.status(500).json("U can only update your own Post!");            
        }
});


module.exports = router;
 
