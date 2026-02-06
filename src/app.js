const express = require("express");
const dbConnect = require("./config/database");
const User = require("./models/user");
const { validateData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

//middilewares to parse data into specified format and to handle cookies
app.use(express.json());
app.use(cookieParser());

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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // validateData(req);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await user.passwordMatches(password);
    if (isPasswordValid) {
      //create jwt token
      const token = await user.getJWTToken();
      //add the token to cookie and send response back to client
      res.cookie("token", token, {expires: new Date(Date.now() + 3600000)});

      res.send("Login successful");
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(400).send("Login failed: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile: " + err.message);
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
