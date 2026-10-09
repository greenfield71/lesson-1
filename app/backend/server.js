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


// studen qoshish method create

app.post('/students', (req, res) => {
    const { name, age, course } = req.body;

    if (!name || !age || !course) {
        return res.status(400).json({ error: "Barcha maydonlarni (name, age, course) to'ldiring!" });
    }

    const sql = `INSERT INTO students (name, age, course) VALUES (?, ?, ?)`;
    db.run(sql, [name, age, course], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            name,
            age,
            course
        });
    });
});



// student malumotini update qilish
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, course } = req.body;

    if (!name || !age || !course) {
        return res.status(400).json({ error: "Barcha maydonlarni (name, age, course) to'ldiring!" });
    }

    const sql = `UPDATE students SET name = ?, age = ?, course = ? WHERE id = ?`;

    db.run(sql, [name, age, course, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Bunday ID ga ega talaba topilmadi!" });
        }

        res.json({
            message: "Talaba ma'lumotlari muvaffaqiyatli yangilandi",
            student: { id: Number(id), name, age, course }
        });
    });
});



//studentni ochirib tashlash

app.delete('/students/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM students WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Bunday ID ga ega talaba topilmadi!" });
        }

        res.json({
            message: `ID: ${id} bo'lgan talaba muvaffaqiyatli o'chirildi!`
        });
    });
});

app.get('/', (req, res) =>{
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

