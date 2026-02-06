const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
            throw new Error("No token found, please login");
        }
        //validate my token
        const isTokenValid = await jwt.verify(token, "secretkey");
        const{_id} = isTokenValid;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    userAuth
}