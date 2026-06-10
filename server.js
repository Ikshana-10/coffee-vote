const express = require('express');
const path = require('path'); // Import path module
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// SERVE FRONTEND: Instruct Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @route   GET /api/items
 * @desc    Retrieve all items ordered by highest votes
 */
app.get('/api/items', (req, res) => {
    db.all("SELECT * FROM items ORDER BY votes DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database query error", details: err.message });
        }
        res.json({ success: true, data: rows });
    });
});

/**
 * @route   POST /api/vote/:id
 * @desc    Increment the vote count for a specific item ID
 */
app.post('/api/vote/:id', (req, res) => {
    const itemId = req.params.id;

    db.run(
        "UPDATE items SET votes = votes + 1 WHERE id = ?",
        [itemId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Database update error", details: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ success: false, error: `Item with ID ${itemId} not found.` });
            }

            db.get("SELECT * FROM items WHERE id = ?", [itemId], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({
                    success: true,
                    message: "Vote cast successfully",
                    updatedItem: row
                });
            });
        }
    );
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend API server running on http://localhost:${PORT}`);
});
