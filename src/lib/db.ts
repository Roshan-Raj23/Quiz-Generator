import mongoose from "mongoose";

const connectToDatabase = async () => {

    try {
        // When already db is connected just return
        if (mongoose.connection.readyState >= 1) 
            return;

        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to DB")
    } catch (err) {
        console.log(err);
    }
}

export default connectToDatabase