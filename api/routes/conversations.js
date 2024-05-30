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

router.get("/:userId", async (req, res) => {
    try {
        // Find individual conversations where the user is a member
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        const allConversations = [...conversations];

        res.status(200).json(allConversations);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.post("/addM",async(req,res)=>{
    const members=req.body.members;
    const cId=req.body.conversationId;
    try{
         // Find the conversation corresponding to cId
         const conversation = await Conversation.findById(cId);

         if (!conversation) {
             return res.status(404).json({ message: "Conversation not found" });
         }
 
         // Add new members to the conversation
         conversation.members.push(...members);
 
         // Save the updated conversation
         await conversation.save();
 
         res.status(200).json({ message: "Members added successfully", conversation: conversation });
    }
    catch(err)
    {
        console.error("Error adding member:", err);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/removeM",async(req,res)=>{
    const members=req.body.members;
    const cId=req.body.conversationId;
    try{
         // Find the conversation corresponding to cId
         const conversation = await Conversation.findById(cId);

         if (!conversation) {
             return res.status(404).json({ message: "Conversation not found" });
         }
 
         // Add new members to the conversation
         conversation.removed.push(...members);
 
         // Save the updated conversation
         await conversation.save();
 
         res.status(200).json({ message: "Members removed successfully", conversation: conversation });
    }
    catch(err)
    {
        console.error("Error removing member:", err);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/delete",async(req,res)=>{
    const user=req.body.userId;
    const cId=req.body.conversationId;
    try{
         // Find the conversation corresponding to cId
         const conversation = await Conversation.findById(cId);

         if (!conversation) {
             return res.status(404).json({ message: "Conversation not found" });
         }
 
         // Remove the user from the members array
         const index = conversation.members.indexOf(user);
         if (index !== -1) {
             conversation.members.splice(index, 1);
             const idx=conversation.removed.indexOf(user);
             if(idx==-1)
             conversation.removed.push(user);
         } else {
             return res.status(404).json({ message: "User not found in conversation members" });
         }
 
         // Save the updated conversation
         await conversation.save();
 
         res.status(200).json({ message: "User removed from conversation members successfully", conversation: conversation });
   }
   catch(err)
   {
       console.error("Error removing member:", err);
       res.status(500).json({ message: "Server error" });
   }
});
router.post("/groups", async (req, res) => {
    const { groupName, members, userId } = req.body;

    if (!groupName || !members || !userId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Create a new group conversation
        const newGroup = new Conversation({
            chatName: groupName,
            isGroupChat: true,
            groupAdmin: [userId],
            members: [...members, userId], // Add the creator to the group
        });

        // Save the new group conversation
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/makeAd",async(req,res)=>{
    const curr=req.body.curId;
    const Mid=req.body.memberId;
    const cId=req.body.conversationId;
    try{
         // Find the conversation corresponding to cId
         const conversation = await Conversation.findById(cId);

         if (!conversation) {
             return res.status(404).json({ message: "Conversation not found" });
         }
 
         const idx=conversation.groupAdmin.indexOf(curr);
         if(idx!=-1)
         {
            const idx1=conversation.groupAdmin.indexOf(Mid);
            if(idx1==-1)
            conversation.groupAdmin.push(Mid);
         }
         else
         return res.status(404).json({ message: "Current user is not admin" });
 
         // Save the updated conversation
         await conversation.save();
 
         res.status(200).json({ message: "Admin added successfully", conversation: conversation });
    }
    catch(err)
    {
        console.error("Error adding admin:", err);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/removeAd",async(req,res)=>{
    const curr=req.body.curId;
    const Mid=req.body.memberId;
    const cId=req.body.conversationId;
    try{
         // Find the conversation corresponding to cId
         const conversation = await Conversation.findById(cId);

         if (!conversation) {
             return res.status(404).json({ message: "Conversation not found" });
         }
 
         const idx=conversation.groupAdmin.indexOf(curr);
         if(idx!=-1)
         {
            const idx1=conversation.groupAdmin.indexOf(Mid);
            if(idx1!=-1)
            conversation.groupAdmin.splice(index, 1);
         }
         else
         return res.status(404).json({ message: "Current user is not admin" });
 
         // Save the updated conversation
         await conversation.save();
 
         res.status(200).json({ message: "Admin removed successfully", conversation: conversation });
    }
    catch(err)
    {
        console.error("Error adding admin:", err);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports=router;