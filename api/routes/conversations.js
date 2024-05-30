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
            groupAdmin: userId,
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

module.exports=router;