const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

    const token = req.headers["authorization"].split(" ")[1]

    if (token) {
        jwt.verify(token, "SOME_SECRET", (error, decoded) => {
            if (error) {
                res.json({
                    message: error
                })
            }
            else {
                req.user = decoded
                next()
            }
        })
    }
    else {
        req.json({
            message: "Failed Authentication"
        })
    }

});
 
const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
