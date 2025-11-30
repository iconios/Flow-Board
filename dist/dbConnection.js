import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
const uri = process.env.DB_URI;
const dbConnect = async () => {
    try {
        if (!uri) {
            console.log("Database uri missing");
        }
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri);
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });
        await mongoose.connection.db?.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Exit process with failure
    }
};
// Handle application termination gracefully
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
});
export default dbConnect;
//# sourceMappingURL=dbConnection.js.map