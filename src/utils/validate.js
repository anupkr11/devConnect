const validator = require("validator");
const bcrypt = require("bcrypt");
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

const validateProfileData = (req) => {
    const allowedFields = ["firstName", "lastName", "email", "age", "gender", "skills", "about", "photoURL"];
    const isAllowedEditFields = Object.keys(req.body).every(field => allowedFields.includes(field))
    return isAllowedEditFields;
}

const passwordCheck = async (req) => {
    const {password, newPassword} = req.body;
    const isValidPass = await bcrypt.compare(password, req.user.password);
    if(!isValidPass){
        throw new Error("Current password is incorrect.");
    }
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("New password must be strong.");
    }
    return true;
}

module.exports = {
    validateData,
    validateProfileData,
    passwordCheck
}