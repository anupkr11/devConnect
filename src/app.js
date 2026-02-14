const express = require("express");
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

//middilewares to parse data into specified format and to handle cookies
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
