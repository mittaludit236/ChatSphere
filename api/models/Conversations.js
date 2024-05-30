const mongoose=require("mongoose");
const ConversationSchema=new mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members:{
        type: Array,
    },
},
{timestamps: true}
);
module.exports=mongoose.model("Conversations",ConversationSchema);