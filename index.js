import express from "express"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import fs from "fs"

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const loginForm = `
<form method="post" action="/login">
    <label for="name">Name:</label>
    <input name="name" type="text">
    <label for="pw">Password:</label>
    <input name="pw" type="password">
    <button type="submit">Login</button>
    <a href="/register">Register</a>
</form>
`;

const users = [];

const registerForm = `
<form method="post" action="/register">
    <label for="name">Name:</label>
    <input name="name" type="text">
    <label for="pw">Password:</label>
    <input name="pw" type="password">
    <label for="confirmPw">Confirm Password:</label>
    <input name="confirmPw" type="password">
    <button type="submit">Register</button>
</form>
`;


app.get("/", (req, res) => {
    res.send(loginForm);
});

app.get("/register", (req, res) => {
    res.send(registerForm);
});

app.get("/index", (req, res) => {
    res.sendFile("index.html", {root: "./"})
})

app.post("/login", (req, res) => {
    const { name, pw } = req.body;

    for (let i = 0; i < users.length; i++) {
        if (name === users[i].name && bcrypt.compareSync(pw, users[i].hashedPassword)) {
            res.send(`
                Login successful. Redirecting in 3 seconds...
                <script>
                    setTimeout(() => {
                        window.location.href = "/index";
                    }, 3000);
                </script>
            `);
            
           
        }
    }
    res.send(`Login failed 
    <script>
        setTimeout(() => {
            window.location.href = "/";
            }, 1000);
    </script>`);
    
});


app.post("/register", (req, res) => {
    const { name, pw, confirmPw } = req.body;

    // Check if user already exists
    for (let i = 0; i < users.length; i++) {
        if (name === users[i].name) {
            res.send(`Username already taken! <script>
            setTimeout(() => {
                window.location.href = "/";
                }, 1000);
        </script>`);
            return;
        }
    }

    // Compare passwords
    if (pw !== confirmPw) {
        res.send(`Passwords do not match`);
        return;
    }
   
     // Safely hash password
    const saltRounds = 10; // Number of hashing rounds
    const hashedPassword = bcrypt.hashSync(pw, saltRounds);

    // Create a new user
    users.push({ name, hashedPassword });
    

    res.send(`<script>window.location.href = "/" </script>`)

   
   
    
});

app.listen(port, () => {
    console.log("Server listens on port", port);
});
