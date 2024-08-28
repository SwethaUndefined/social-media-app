import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import  path  from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { register } from "./controller/auth.js";
import authRoutes  from "./routes/auth.js"

/*CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : 'cross-origin'}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended : true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended : true}));
app.use(cors());
app.use("./assests",express.static(path.join(__dirname,"public/assests")));


/*FILE STORAGE*/
// any one stores the file it will and store this public directory
const storage = multer.diskStorage({
    destination : function(req,res,cb){
        cb(null,"public/assests")
    },
    filename : function(req,res,cb){
        cb(null,file.originalname)
    },
})
// anytime we need to upload use this keyword upload
const upload = multer({storage});

//Routes with file
//upload.single("picture")  is a middleware when happened before register 
app.post("/auth/register",upload.single("picture"),register)


// Routes

app.use("/auth/register",authRoutes)
//MONGOOSE SETUP

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Port ${PORT}`)
    })
}).catch((err)=>{
    console.log(`${err} did not connect`)
})
