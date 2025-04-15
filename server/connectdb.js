const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;


const connectDB = async () => {
    let connection;
    try {
       connection = await mongoose.connect(
        MONGODB_URI,
        {
          dbName: DB_NAME,
        },
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
  
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection;
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
      process.exit();
    }
  };

module.exports = connectDB;
  