// server.js
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));



app.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile('users.json', 'utf8');
        res.send(JSON.parse(data));
    } catch (err) {
        return res.status(500).send({ error: 'Fehler beim Lesen der Benutzerdaten' });
    }
});

app.post('/register', async (req, res) => {
    try {
        let users;
        try {
            const data = await fs.readFile('users.json', 'utf8');
            users = JSON.parse(data);
        } catch {
            users = {};
        }

        const { username, password } = req.body;

        if (users[username]) {
            return res.status(400).send({ error: 'Benutzername bereits vergeben' });
        }

        users[username] = password; // Use a hashed password in a real-world scenario
        await fs.writeFile('users.json', JSON.stringify(users));
        res.send({ success: 'Registrierung erfolgreich!' });
    } catch (err) {
        return res.status(500).send({ error: 'Fehler beim Speichern der Benutzerdaten' });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
