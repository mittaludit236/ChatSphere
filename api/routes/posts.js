const router=require("express").Router();
const Post=require("../models/Post");
const User=require("../models/User");
const mongoose=require("mongoose");
router.post("/",async(req,res)=>{
    const newPost=new Post(req.body);
    try{
        const sp=await newPost.save();
        res.status(200).json(sp);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
});
router.put("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
    if(post.userId==req.body.userId)
    {
        await post.updateOne({$set:req.body});
        res.status(200).json("post updated");
    }
    else
    res.status(403).json("u can update only yr post");
    }
    catch(err)
    {
        res.status(500).json(err);
    }
    
});
router.delete("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
    if(post.userId==req.body.userId)
    {
        await post.deleteOne();
        res.status(200).json("post deleted");
    }
    else
    res.status(403).json("u can delete only yr post");
    }
    catch(err)
    {
        res.status(500).json(err);
    }
    
});
router.get("/comments", async (req, res) => {
    console.log("hello");
    const postId= req.query.postId.trim(); // Ensure you're extracting the postId correctly.
    console.log(postId);
    try {
        //Validate postId
        // if (!mongoose.Types.ObjectId.isValid(postId)) {
        //     return res.status(400).json({ message: "Invalid postId provided" });
        // }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post.comments);
        //res.status(200).json({message: "hello"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving comments", error: err.message });
    }
});
router.put("/:id/like",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
    if(!post.likes.includes(req.body.userId))
    {
        await post.updateOne({$push: {likes: req.body.userId}});
        res.status(200).json("post liked");
    }
    else
    {
        await post.updateOne({$pull: {likes: req.body.userId}});
        res.status(200).json("post disliked");
    }
    }
    catch(err)
    {
        res.status(500).json(err);
    }
});
router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
});
router.get("/timeline/:userId",async(req,res)=>{
    let postArray=[];
    try{
        const currentUser=await User.findById(req.params.userId);
        const userPosts=await Post.find({userId: currentUser._id});
        const friendsPosts=await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendsPosts));
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})
//get user's all posts

router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.post("/comments", async (req, res) => {
    const { userId, postId, description } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Create a new comment
        const comment = {
            userId,
            description
        };

        // Add the comment to the comments array of the post
        post.comments.push(comment);

        // Save the updated post
        const updatedPost = await post.save();

        // Send the updated post back to the client
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding comment", error: err.message });
    }
});

module.exports=router;