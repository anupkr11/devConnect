const express = require('express');

const app = express();

//this get will match only get http method
app.get("/user", (req,res) =>{
    res.send({ name: "John Doe", age: 30 });
})

app.post("/user", (req,res) =>{
    res.send("User created successfully!");
})

app.get("/product/:id", (req,res) =>{
    console.log(req.params.id); 
    res.send({ id: req.params.id, name: "Laptop", price: 999.99 });
})

// app.get("/test", (req,res) =>{
//     res.send("Welcome to the test route!");
// })

//this use will match all the http methods
// app.use("/hello", (req,res) =>{
//     res.send("Hello from the /hello route!");
// })

app.listen(3000, () =>{
    console.log("Server is running on port 3000");
})