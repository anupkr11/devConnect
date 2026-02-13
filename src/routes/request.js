const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;


        // Validate status
        const validStatus = ["interested", "ignored"];
        if(!validStatus.includes(status)){
            return res.status(400).send("Invalid status type. Allowed values are 'interested' and 'ignored'.");
        }

        //check if user is trying to send request to themselves
        // if(fromUserId.toString() === toUserId){
        //     return res.status(400).send("You cannot send a connection request to yourself.");
        // }

        //check if user is trying to send request to a non-existent user
        const toUserExists = await User.findById(toUserId);
        if(!toUserExists){
            return res.status(404).send("The user you are trying to connect with does not exist.");
        }

        // Check if a connection request already exists between the users
        const existingRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if(existingRequest){
            return res.status(400).send("A connection request already exists between these users.");
        }

        const connectionReq = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionReq.save();
        res.json({ message: "Connection request sent successfully", data });
    }
    catch(err){
        res.status(400).send("Error sending connection request: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res) =>{
    try{
        // Validate status
        const status = req.params.status;
        const validStatus = ["accepted", "rejected"];
        if(!validStatus.includes(status)){
            return res.status(400).send("Invalid status type. Allowed values are 'accepted' and 'rejected'.");
        }
        // Check if the connection request exists and belongs to the user
        const requestId = req.params.requestId;
        const connectionReq = await ConnectionRequest.findOne({ _id: requestId, toUserId: req.user._id, status: "interested" });
        if(!connectionReq){
            return res.status(404).send("Connection request not found or does not belong to the user.");
        }
        connectionReq.status = status;
        const data = await connectionReq.save();
        res.json({ message: "Connection request reviewed successfully", data });
    }
    catch(err){
        res.status(400).send("Error reviewing connection request: " + err.message);
    }
})

module.exports = requestRouter;