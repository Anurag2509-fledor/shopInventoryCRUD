const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    customerName: { type: String },
    date: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
            quantity: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model('Bill', BillSchema);
