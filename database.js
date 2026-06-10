const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./votes.db');

db.serialize(() => {
    // Create items table with an auto-incrementing ID, name, and vote count
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        votes INTEGER DEFAULT 0
    )`);

    // Seed initial options if the database is brand new
    db.get("SELECT COUNT(*) as count FROM items", (err, row) => {
        if (row && row.count === 0) {
            const statement = db.prepare("INSERT INTO items (name, votes) VALUES (?, 0)");
            const coffeeItems = ['Espresso', 'Americano', 'Cappuccino', 'Latte', 'Macchiato'];
            coffeeItems.forEach(item => statement.run(item));
            statement.finalize();
            console.log("Database initialized and seeded with coffee options.");
        }
    });
});

module.exports = db;