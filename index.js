const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/Ansh", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MongoDB is connected");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, 
});

const Item = mongoose.model("Item", itemSchema);

// POST API to Add Item
app.post("/items", async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || price == null || !category) {
            return res.status(400).json({ message: "All fields (name, description, price, category) are required" });
        }

        const newItem = new Item({ name, description, price, category });
        const savedItem = await newItem.save();
        res.status(201).json({ message: "Item created successfully", item: savedItem });
    } catch (err) {
        console.error("Error saving item data:", err);
        res.status(500).json({ message: "An error occurred while saving the item" });
    }
});

// GET API to Fetch All Items
app.get("/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ message: "An error occurred while fetching items" });
    }
});

// DELETE API to Delete Item by ID
app.delete('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'An error occurred while deleting the item' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
