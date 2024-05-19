const mongoose=require("mongoose");
const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 500
    },
    // No need to separately add date and time fields; timestamps will handle it
}, {
    timestamps: true // This will automatically add `createdAt` and `updatedAt` fields
});
const PostSchema=new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        max: 500
    },
    img:{
        type: String
    },
    likes:{
        type: Array,
        default:[]
    },
    closeFriend:{
       type:Boolean,
       default:false
    },
    comments: [CommentSchema],
    
},
{timestamps: true}
);
module.exports=mongoose.model("Post",PostSchema);