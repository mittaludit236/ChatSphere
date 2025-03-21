const router=require("express").Router();
const User=require("../models/User");
const bcrypt=require("bcrypt");
router.post("/register",async(req,res)=>{
   
   try{
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(req.body.password,salt);
    const newUser=new User({
        username: req.body.username,
        email: req.body.email,
        password:hash,
       });
    const user=await newUser.save();
    res.status(200).json(user);
   }catch(err)
   {
    res.status(500).json(err);
   }
});
router.post("/login",async(req,res)=>{
    try
    {
        console.log(req.body);
        const user=await User.findOne({email: req.body.email});
        console.log(user);
        if(!user)
        res.status(404).json("user not found");
        const vp=await bcrypt.compare(req.body.password,user.password);
        if(!vp)
        res.status(400).json("wrong password");
        else
        res.status(200).json(user);
    }catch(err)
    {
       console.log("hello");
       res.status(500).json(err);
    }
   

})
module.exports=router;