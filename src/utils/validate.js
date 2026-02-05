const validator = require("validator");
const validateData = (req) =>{
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || firstName.length <4 || firstName.length >30){
        throw new Error("First name is required and should be between 4 to 30 characters.");
    }
    else if(!email || !validator.isEmail(email)){
        throw new Error("A valid email is required.");
    }
    else if(!password || !validator.isStrongPassword(password)){
        throw new Error("A strong password is required.");
    }
}

module.exports = {
    validateData
}