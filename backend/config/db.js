import mongoose from "mongoose";

export const connectDB = async ()=> {
    await mongoose.connect('mongodb+srv://prateekjdelhi2004:r4dmwxRWFj9aUsSX@cluster0.cskfcn6.mongodb.net/taskflow')
        .then(()=>console.log('DB CONNECTED'));
}