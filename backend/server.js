const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://admin:admin@localhost:27017/minicrm?authSource=admin', {
  
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const leadRoutes = require('./routes/leadRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const orderRoutes = require('./routes/orderRoutes');
const billingRoutes = require('./routes/billingRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const salesForecastRoutes = require('./routes/salesForecastRoutes');
const eventRoutes = require('./routes/eventRoutes');
const checkReminders = require('./reminderService');

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/billings', billingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/salesforecasts', salesForecastRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('MiniCRM Backend API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Schedule reminder checks every minute
  setInterval(checkReminders, 60 * 1000);
});