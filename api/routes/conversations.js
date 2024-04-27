const router=require("express").Router();
const Conversation=require("../models/Conversations");

router.post("/", async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    try {
        // Check if a conversation already exists between sender and receiver
        const existingConversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        // If conversation already exists, return a response indicating no action needed
        if (existingConversation) {
            return res.status(200).json({ message: "Conversation already exists" });
        }

        // If conversation doesn't exist, create a new conversation
        const newConversation = new Conversation({
            members: [senderId, receiverId],
        });

        // Save the new conversation
        const savedConversation = await newConversation.save();
        
        res.status(200).json(savedConversation);
    } catch (err) {
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