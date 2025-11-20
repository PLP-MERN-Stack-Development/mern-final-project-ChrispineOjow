import {connectDB} from "./config/db.js";
import "dotenv/config";
import express from "express";
import reportRouter from "./routes/report.routes.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
// import helmet from "helmet";



const app = express();

const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}));

//Database connection
await connectDB();

//Configuring cors
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || "")
    .split(",")
    .map(origin=>origin.trim())
    .filter(Boolean)
const corsOptions = {
    origin : (origin, callback)=>{
        //Check if the request ing origin is in our list of allowed origins
        if(allowedOrigins.includes(origin) || !origin){
           //Allow acces
            callback(null,true);
        }else{
            //Block access
            callback(new Error('Not allowed to access this backend'))
        }
    }
}

// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "'unsafe-inline'","'unsafe-eval'", "https://*.clerk.com"],
//             styleSrc: ["'self'", "'unsafe-inline'", "https://*.clerk.com"],
//             connectSrc: ["'self'", "https://*.clerk.com"],
//             imgSrc: ["'self'","blob:" ,"https://*.clerk.com", "data:"],
//         },
//     },
// }));

app.use(cors(corsOptions));

//End points
app.get("/", async(req, res)=>{
    res.send(`The Server is up and running`);
});


app.use('/api', reportRouter);
app.use('/api',userRouter);



//Listen to the PORT
app.listen(PORT,()=>{
    console.log(`The server is running in http://localhost:${PORT}`);
});

