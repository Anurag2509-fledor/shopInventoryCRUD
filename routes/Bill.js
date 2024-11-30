const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: Retrieve all bills
 *     description: Fetch all the bills created.
 *     responses:
 *       200:
 *         description: A list of bills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bill'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
        const bills = await Bill.find();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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


/**
 * @swagger
 * /api/bills/{id}:
 *   put:
 *     summary: Update a bill
 *     description: Update a specific bill using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bill to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bill'
 *     responses:
 *       200:
 *         description: Bill updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bill'
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
    try {
        const { customerName, items } = req.body;

        const updatedBill = await Bill.findByIdAndUpdate(
            req.params.id,
            { customerName, items },
            { new: true, runValidators: true }
        );

        if (!updatedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/bills/{id}:
 *   delete:
 *     summary: Delete a bill
 *     description: Remove a bill using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bill to delete
 *     responses:
 *       200:
 *         description: Bill deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bill deleted successfully"
 *       404:
 *         description: Bill not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedBill = await Bill.findByIdAndDelete(req.params.id);

        if (!deletedBill) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
