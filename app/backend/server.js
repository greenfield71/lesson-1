const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
app.use(express.json());

const db=new sqlite3.Database('./database.db')

db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    course TEXT NOT NULL
)`);


// barcha studentlarni olish Method get

app.get('/students', (req, res) => {
    db.all('SELECT * FROM students', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});


app.get('/', (req, res) =>{
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

