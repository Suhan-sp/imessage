import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URI

        if(!mongoUri) {
            throw new Error("MONGODB_URI is required");
        }
        
        const conn = await mongoose.connect(mongoUri)

        console.log("MongoDB connected",conn.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1); // Exit the process with an error code
    }

}
        