const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();

requestRouter.post("/getConnectionRequest", userAuth, async(req,res) =>{
    const user = req.user;
    console.log("Sending a connection request");
    res.send(user.firstName+"sent a connection request");
})

module.exports = requestRouter;