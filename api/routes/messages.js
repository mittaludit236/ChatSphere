const router=require("express").Router();
const Message=require("../models/Message");
const User=require("../models/User");
router.post("/",async(req,res)=>{
    const newm=new Message(req.body);
    try{
        const sm=await newm.save();
        res.status(200).json(sm);
    }catch(err)
    {
        res.status(500).json(err);
    }
});
router.get("/:conversationId",async(req,res)=>{
    try{
        const messages=await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    }catch(err)
    {
        res.status(500).json(err);
    }
});
router.post("/search", async (req, res) => {
    const find_prof = req.body.find_prof;
    const userId = req.body.userId; // assuming you receive a userId from the frontend

    try {
        if (find_prof === '') {
            res.status(200).json([]);
        } else {
            // Fetch the user and their followings
            const mainUser = await User.findById(userId);
            if (!mainUser) {
                return res.status(404).json({ message: "User not found" });
            }
            const followings = mainUser.followings; // assuming 'followings' is an array of userIds

            // Fetch the details of users being followed
            const followingUsers = await User.find({
                '_id': { $in: followings }
            });

            // Filter these users based on the regex pattern provided
            const filteredUsers = followingUsers.filter(user =>
                new RegExp(find_prof, 'i').test(user.username)
            );

            res.status(200).json(filteredUsers);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports=router;