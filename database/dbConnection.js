import mongoose from "mongoose";

const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "PORTFOLIO"
    }).then(()=>{
        console.log("Connected to database")
    }).catch(()=>{
        console.log(`Some Error Occured While Connecting To Database: ${error}`);
    });
};

export default dbConnection;