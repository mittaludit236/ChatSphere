const mongoose=require("mongoose");
const MessageSchema=new mongoose.Schema({
    conversationId:{
        type: String,
    },
    sender:{
        type: String,
    },
    text:{
        type: String,
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
},
{timestamps: true}
);
module.exports=mongoose.model("Message",MessageSchema);