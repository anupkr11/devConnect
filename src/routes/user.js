const express = require('express');
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

userRouter.get("/user/requests/recieved", userAuth, async (req, res) =>{
    try{
        const loggedInUser = req.user;
        const connectionReq = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "email", "skills", "photoURL"]);

        res.json({ message: "Received connection requests fetched successfully", data: connectionReq });

    }
    catch(err){
        res.status(400).send("Error fetching received connection requests: " + err.message);
    }
})


module.exports = userRouter;