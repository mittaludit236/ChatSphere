const router=require("express").Router();
const Post=require("../models/Post");
const User=require("../models/User");
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
router.get("/timeline/all",async(req,res)=>{
    let postArray=[];
    try{
        const currentUser=await User.findById(req.body.userId);
        const userPosts=await Post.find({userId: currentUser._id});
        const friendsPosts=await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId: friendId});
            })
        );
        res.json(userPosts.concat(...friendsPosts));
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})
module.exports=router;