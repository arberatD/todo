import express from "express"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import fs from "fs"

const port = 3000;
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const loginForm = `
<form method="post" action="/login">
<form method="post" action="/login" onsubmit="return validateLogin()">
<style>
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    padding: 50px;
}

form {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 20px;
    max-width: 300px;
    margin: auto;
}

label {
    display: block;
    margin-bottom: 10px;
}

input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #cccccc;
}

button {
    background-color: #007BFF;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

h2, h3 {
    text-align: center;
}

button:hover {
    background-color: #0056b3;
}
</style>
    <h2>ToDo Liste📃</h2>
    <h3>Login🔞</h3>
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
<form method="post" action="/register" onsubmit="return validateRegister()">
<style>
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    padding: 50px;
}

form {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 20px;
    max-width: 300px;
    margin: auto;
}

label {
    display: block;
    margin-bottom: 10px;
}

input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #cccccc;
}

button {
    background-color: #007BFF;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

h2, h3 {
    text-align: center;
}

button:hover {
    background-color: #0056b3;
}
</style>
    <h2>ToDo Liste📃</h2>
    <h3>Registrierung🚀</h3>
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
                <script>
                    setTimeout(() => {
                        window.location.href = "/index";
                    }, 0);
                </script>
            `);
            
           
        }
    }
    res.send(`
    Login failed! You'll be redirected..  
    <br>
    <img src="/zonk.jpeg" alt="Hier sollte ein ZONK sein" />
    <script>
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    </script>
`); 
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
