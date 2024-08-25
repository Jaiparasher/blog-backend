const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser") ;
const { errorHandler } = require('./middleware/errorMiddleware');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true , limit: "50mb"}));
app.use(express.static("public"))
app.use(cookieParser());
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log requests to the console

// Connect to MongoDB
connectDB();

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Error Handling Middleware
app.use(errorHandler);

// Define the PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

