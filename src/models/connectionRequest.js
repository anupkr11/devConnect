const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        enum:{values: ["interested","ignored", "rejected","accepted" ],
            message: `{VALUE} is incorrect status type`
        }
    }
},{timestamps: true});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre('save', async function(next){
    const connectionReq = this;
    if(connectionReq.fromUserId.toString() === connectionReq.toUserId.toString()){
        throw new Error("You cannot send a connection request to yourself.");
    }
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;