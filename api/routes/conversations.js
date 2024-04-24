const router=require("express").Router();
const Conversation=require("../models/Conversations");

router.post("/",async(req,res)=>{
    const newConversation=new Conversation({
        members:[req.body.senderId,req.body.receiverId],
    });
    try{
        const sc=await newConversation.save();
        res.status(200).json(sc);
    }catch(err)
    {
        res.status(500).json(err);
    }
});
router.get("/:userId",async(req,res)=>{
    try{
        const conversation=await Conversation.find({
            members:{$in:[req.params.userId]},
        });
        res.status(200).json(conversation);
    }catch(err)
    {
        res.status(500).json(err);
    }
})
module.exports=router;