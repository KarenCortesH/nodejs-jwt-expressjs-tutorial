//servidor
const express = require("express");
const app = express();
//importo el token
const jwt = require("jsonwebtoken");
//para acceder a las VAR Locales
require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hi World!");
});

//Ruta Api
//validateToken es donde inyectamos el midlware
app.get("/api", validateToken, (req, res) => {
    res.json({
        username: req.user,
        tuits: [
            {
                id: 0,
                text: "Este es la prueba uno del Tuit",
                username: "exampletuit1",
            },
            {
                id: 1,
                text: "Este es la prueba dos del Tuit",
                username: "exampletuit2",
            },
        ],
    });
});
//Form login
app.get("/login", (req, res) => {
    res.send(`<!DOCTYPE html>
 <html>
     <head>
         <title>Login</title>
     </head>
     <body>
         <form method="POST" action="/auth">
             username: <input text="text" name="text"><br>
             password: <input type="password" name="password">
                       <input type= "submit" value="Log in" />
         </form>
     </body>
 </html>`);
});

//Ruta Auth
app.post("/auth", (req, res) => {
    const { username, password } = req.body;

    //consulto la bd y validar que existen
    const user = { username: username };
    const accessToken = generateAccessToken(user);
    //Aqui vamos a personalizar lo queremos mostrar
    res.header("authorization", accessToken).json({
        message: "Usuario Autenticado",
        token: accessToken,
    });
});
//funcion para validar  la firma
//payload es la info que yo voy a encriptar
function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '5m'});
}

//Validar el token
function validateToken(req, res, next) {
    //validamos si tenemos un token
    const accessToken = req.headers["authorization"] || req.query.accessToken;
    if (!accessToken) res.send("Access denied");
    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        //validamos si hay error
        if (err) {
            res.send("Access denied , token expired or incorrect");
        } else {
            //Estamos guardando dentro de node un objeto y le asignamos el objeto de user
            req.user = user;
            //Aqui estamos llamando a la siguiente funcion
            next();
        }
    });
}
app.listen(3000, () => {
    console.log("Servidor iniciado....");
});
