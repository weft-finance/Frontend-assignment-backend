import express from 'express';
import bodyParser from 'body-parser';
import db from './database';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Fetch all users
app.get('/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
});

// Fetch a list of users matching the search query
app.post('/users/search', (req, res) => {
    const { filter, page = 0, pageSize = 10 } = req.body;
    const nameFilter = filter?.name || '';
    const offset = page * pageSize;

    const stmt = db.prepare(`
        SELECT * FROM users 
        WHERE name LIKE ? 
        LIMIT ? OFFSET ?
    `);

    const users = stmt.all(`%${nameFilter}%`, pageSize, offset);
    res.json(users);
});

// Fetch detailed information for a specific user
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
