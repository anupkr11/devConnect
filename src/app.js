const express = require("express");
const dbConnect = require("./config/database");
const User = require("./models/user")

const app = express();

app.post('/signup', async (req,res) =>{
    const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        age: 28,
        password: "securepassword",
    })
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

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
