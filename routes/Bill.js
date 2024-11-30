const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Inventory = require('../models/Inventory');

/**
 * @swagger
 * components:
 *   schemas:
 *     BillItem:
 *       type: object
 *       required:
 *         - itemId
 *         - quantity
 *       properties:
 *         itemId:
 *           type: string
 *           description: ID of the inventory item
 *         quantity:
 *           type: integer
 *           description: Quantity of the item being purchased
 *       example:
 *         itemId: 613b1f37c21a3a2f8d3f982b
 *         quantity: 2
 *     Bill:
 *       type: object
 *       required:
 *         - customerName
 *         - items
 *       properties:
 *         customerName:
 *           type: string
 *           description: Name of the customer
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BillItem'
 *           description: List of items purchased in the bill
 *         totalAmount:
 *           type: number
 *           description: Total amount of the bill
 *       example:
 *         customerName: John Doe
 *         items:
 *           - itemId: 613b1f37c21a3a2f8d3f982b
 *             quantity: 2
 *           - itemId: 613b1f37c21a3a2f8d3f983c
 *             quantity: 3
 *         totalAmount: 15.6
 */

/**
 * @swagger
 * /api/bills:
 *   post:
 *     summary: Create a new bill
 *     description: This endpoint creates a bill and reduces the stock of the items purchased.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bill'
 *     responses:
 *       201:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       400:
 *         description: Insufficient stock or invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    try {
        const { customerName, items } = req.body;
        let totalAmount = 0;

        // Loop through each item in the bill
        for (const item of items) {
            const inventoryItem = await Inventory.findById(item.itemId);
            if (!inventoryItem || inventoryItem.quantity < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for item: ${inventoryItem?.name || 'unknown'}` });
            }

            inventoryItem.quantity -= item.quantity; // Directly update the inventory
            await inventoryItem.save(); // Save the updated inventory
            totalAmount += inventoryItem.price * item.quantity;
        }

        // Create and save the bill
        const newBill = new Bill({ customerName, items, totalAmount });
        const savedBill = await newBill.save();

        res.status(201).json(savedBill); // Return the saved bill
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
