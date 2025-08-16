import mongoose from "mongoose";

const connection = {
    isConnected: 0
};

async function connectDB() {
    if (connection.isConnected) {
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "");
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("Error connecting to DB", error);
        process.exit(1);
    }
}

export default connectDB;
