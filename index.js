const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const loginForm = `
<form method="post" action="/login">
    <label for="name">Name:</label>
    <input name="name" type="text">
    <label for="pw">Passwort:</label>
    <input name="pw" type="password">
    <button type="submit">Login</button>
    <a href="/register">Registrieren</a>
</form>
`;

const user = [];

const registerForm = `
<form method="post" action="/register">
    <label for="name">Name:</label>
    <input name="name" type="text">
    <label for="pw">Passwort:</label>
    <input name="pw" type="password">
    <label for="confirmPw">Passwort wiederholen:</label>
    <input name="confirmPw" type="password">
    <button type="submit">Registrieren</button>
</form>
`;

app.get("/", (req, res) => {
    res.send(loginForm);
});

app.get("/register", (req, res) => {
    res.send(registerForm);
});

app.post("/login", (req, res) => {
    const { name, pw } = req.body;

    for (let i = 0; i < user.length; i++) {
        if (name === user[i].name && bcrypt.compareSync(pw, user[i].hashedPassword)) {
            res.send(`Login erfolgreich`);
            return;
        }
    }

    res.send(`Login fehlgeschlagen`);
});

app.post("/register", (req, res) => {
    const { name, pw, confirmPw } = req.body;

    // existence of User
    for (let i = 0; i < user.length; i++) {
        if (name === user[i].name) {
            res.send(`Benutzername bereits vergeben`);
            return;
        }
    }

    // password compare
    if (pw !== confirmPw) {
        res.send(`Passwörter stimmen nicht überein`);
        return;
    }

    // safe hash
    const saltRounds = 10; // Anzahl der Hashing-Runden
    const hashedPassword = bcrypt.hashSync(pw, saltRounds);

    // New User
    user.push({ name, hashedPassword });

    res.send(`Registrierung abgeschlossen`);
});

app.listen(port, () => {
    console.log("Server listens on port", port);
});
