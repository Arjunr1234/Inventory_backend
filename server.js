import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './src/db/config.js';
import userRoute from './src/routes/userRoute.js';



const origin = 'https://inventory-frontend-dusky.vercel.app'
//const origin:'http://localhost:5173',
dotenv.config(); 
const port = process.env.PORT || 5000; 

const app = express();
connectDB();
const corsOption = {
    origin:origin,
    credentials:true
}
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// app.use((req, res, next) => {
//     console.log(req.method, req.hostname, req.path, req.body, req.params);
//     next();
//   });



app.use('/api/user', userRoute)

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
   