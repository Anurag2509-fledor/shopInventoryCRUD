const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryItem:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the item
 *         name:
 *           type: string
 *           description: Name of the item
 *         price:
 *           type: number
 *           description: Price of the item
 *         quantity:
 *           type: integer
 *           description: Quantity of the item in stock
 *       example:
 *         id: 613b1f37c21a3a2f8d3f982b
 *         name: Apple
 *         price: 1.2
 *         quantity: 100
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Retrieve a list of inventory items
 *     responses:
 *       200:
 *         description: A list of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 */
router.get('/', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Add a new inventory item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       201:
 *         description: Item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const item = new Inventory({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  });
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an existing inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 *       400:
 *         description: Invalid input
 */
router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (req.body.name) item.name = req.body.name;
    if (req.body.price) item.price = req.body.price;
    if (req.body.quantity) item.quantity = req.body.quantity;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
