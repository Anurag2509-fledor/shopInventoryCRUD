require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const inventoryRoutes = require('./routes/Inventory');
const billRoutes = require('./routes/Bill');

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Serve Swagger UI at `/api-docs`
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log('API documentation available at http://localhost:5000/api-docs');


// Middleware
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/bills', billRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
