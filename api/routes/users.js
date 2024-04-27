const router=require("express").Router();
const User=require("../models/User");
router.put("/:id",async(req,res)=>{
    if(req.body.userId==req.params.id || req.body.isAdmin)
    {
        if(req.body.password)
        {
            try{
                const salt=await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt);
            }
            catch(err)
            {
                return res.status(500).json(err);
            }

        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{$set: req.body,});
            res.status(200).json("Account has been updated!");
        }
        catch(err)
        {
            return res.status(500).json(err);
        }

    }
    else
    return res.status(403).json("You can update only yr account");

});

router.delete("/:id",async(req,res)=>{
    if(req.body.userId==req.params.id || req.body.isAdmin)
    {
        try{
            const user=await User.deleteOne({_id: req.params.id});
            res.status(200).json("Account has been deleted!");
        }
        catch(err)
        {
            return res.status(500).json(err);
        }

    }
    else
    return res.status(403).json("You can delete only yr account");

});
//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

  router.put('/', async (req, res) => {
    try {
        const { name, city } = req.body;
        const userId = req.query.userId;
        const username = req.query.username;
        console.log(username);
        console.log(city);
        console.log(name);
        
        // Find the user by userId if provided, otherwise by username
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user's name and city
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { name, city } },
            { new: true } // Return the updated user
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


  // get friends 
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        console.log("user:", user); // Check if user object is retrieved successfully
        const friends = await Promise.all(
            user.followings.map(friendsId => {
                return User.findById(friendsId);
            })
        );
        console.log("friends:", friends); // Check if friends array is populated
        let friendList = [];
        friends.map(friend => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        console.log("friendList:", friendList); // Check the final friendList array
        res.status(200).json(friendList);
    } catch (err) {
        console.error(err); // Log any errors to console
        res.status(500).json(err);
    }
});

   
  //follow a user
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!=req.params.id)
    {
        try{
            const user=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId))
            {
                await user.updateOne({$push:{followers: req.body.userId}});
                await currUser.updateOne({$push:{followings: req.params.id}});
                res.status(200).json("user followed");
            }
            else
            res.status(403).json("you already follow this user");
        }catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    res.status(403).json("you cant follow yourself");

});
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!=req.params.id)
    {
        try{
            const user=await User.findById(req.params.id);
            const currUser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId))
            {
                await user.updateOne({$pull:{followers: req.body.userId}});
                await currUser.updateOne({$pull:{followings: req.params.id}});
                res.status(200).json("user unfollowed");
            }
            else
            res.status(403).json("you dont follow this user");
        }catch(err)
        {
            res.status(500).json(err);
        }
    }
    else
    res.status(403).json("you cant unfollow yourself");

});
router.post("/search",async(req,res)=>{
    const find_prof = req.body.find_prof;
    try {
      if (find_prof === '') {
        res.status(200).json([]);
      } else {
        // Using regular expression for case-insensitive search
        const users = await User.find({ username: { $regex: new RegExp(find_prof, 'i') } });
        res.status(200).json(users);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
module.exports=router;