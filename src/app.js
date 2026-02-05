const express = require("express");
const dbConnect = require("./config/database");
const User = require("./models/user");
const { validateData } = require("./utils/validate");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateData(req);
    const { firstName, lastName, email, password } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const user = new User(
      { firstName, lastName, email, password: passHash },
      // firstName: "John",
      // lastName: "Doe",
      // email: "john.doe@example.com",
      // age: 28,
      // password: "securepassword",
    );

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/login", async(req,res)=>{
  try{
    const{email, password} = req.body;
    // validateData(req);
    const user = await User.findOne({email: email});
    if(!user){
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(isPasswordValid){
      res.send("Login successful");
    } else{
      throw new Error("Invalid password");
    }
  }
  catch(err){
    res.status(400).json({ message: err.message });
  }
})

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const UpdatedData = ["gender", "skills", "photoURL", "about"];
    const isAllowedUpdates = Object.keys(data).every((k) => {
      UpdatedData.includes(k);
    });

    if (!isAllowedUpdates) {
      throw new Error("Invalid updates!");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10!");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    return res.status(400).send("something went wrong");
  }
});

dbConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

//this get will match only get http method
// app.get("/user", (req,res) =>{
//     res.send({ name: "John Doe", age: 30 });
// })

// app.post("/user", (req,res) =>{
//     res.send("User created successfully!");
// })

// app.get("/product/:id", (req,res) =>{
//     console.log(req.params.id);
//     res.send({ id: req.params.id, name: "Laptop", price: 999.99 });
// })

// //multiple route handlers for the same route
// app.use("/user", (req,res,next) =>{
//     console.log("user route accessed");
//     next();
// }, (req,res) =>{
//     res.send("User route with multiple handlers");
// });

// app.get("/test", (req,res) =>{
//     res.send("Welcome to the test route!");
// })

//this use will match all the http methods
// app.use("/hello", (req,res) =>{
//     res.send("Hello from the /hello route!");
// })
