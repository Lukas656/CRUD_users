const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const funcUsers = require('../DB-funcoes/dbfuncs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swagger.json');
const port = 8000;
const app = express();
app.use(bodyParser.json())
app.use(cors())

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))



// Rota de Verificação do sistema
app.get('/', async (req, res) => {
    res.status(200).send({ success: true, message: "Sistema Funcionando!!!" })
});

// Exibe mensagem se esta funcionando a conexao
app.get('/', async (req, res) => {
    res.status(200).send({ success: true, message: "Sistema Funcionando!!!" })
});



// Create User
app.post('/newuser', async (req, res) => {
    let userLogin = req.body
    let user = await funcUsers.criarUser(userLogin);
    console.log(user.newObjectId)
    res.status(200).send(user)
});
//  Read User
app.get('/login', async (req, res) => {
    let logins = await funcUsers.getAllLogin();
    console.log(logins)
    res.status(200).send(logins)
});

// Update User from ID
app.put('/user/:id', async (req, res) => {
    let filter = req.params.id;
    let newDate = req.body;

    let user = await funcUsers.updateUser(filter, newDate);
    console.log(user)

    res.status(200).send({ success: true, user })
});

// Delete User from ID
app.delete('/user/:id', async (req, res) => {
    let user = req.params.id
    let UserID = await funcUsers.deleteUser(user);
    res.status(200).send(`<h1> O User: "${user}" Foi Removido Com Exito !! </h1>`)
});



//  Pegar Um Usuario pelo ID
app.get('/user/:id', async (req, res) => {
    let User = req.params.id
    let UserID = await funcUsers.getUser(User);
    console.log(UserID)
    res.status(200).send(UserID)
});


//  Pegar Um Usuario pelo ID e Exibe sua Photo
app.get('/photo/:id', async (req, res) => {
    let User = req.params.id
    let UserID = await funcUsers.getPhotoId(User);
    console.log(UserID)
    res.status(200).send(UserID)
});

// Apagar tudo
app.delete('/deletmany', async (req, res) => {
    let msg = await funcUsers.deletaUsers()
    res.status(200).send(msg)
})

// verifica se o usuario e senha existem
app.post('/user', async (req, res) => {
    let userLogin = req.body
    let user = await funcUsers.autentica(userLogin.UserName, userLogin.Password);
    console.log(user)
    res.status(200).send({ success: true, user })
});





app.listen(port, () => {
    console.log(`Rodando na porta: http://localhost:${port}`)
});

