const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swagger.json');
const funcUsers = require('../controller/dbfuncs');
const bodyParser = require('body-parser');
const cors = require('cors');
const checkToken = require('../controller/mindware');

const router = express();
router.use(bodyParser.json())
router.use(cors())


// Exibe mensagem se esta funcionando a conexao
router.get('/', async (req, res) => {
    res.status(200).send({ success: true, message: "Sistema Funcionando!!!" })
});
// Conecta Com A Documentação Swagger
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// rota que gera o token para usuarios cadastrados
router.post('/logar', async (req, res, next) => {
    const {email, password} = req.body
    const authentica = await funcUsers.checkToken({email, password});

    res.status(200).send(authentica);
});

// Create User
router.post('/newuser', async (req, res) => {
    let userLogin = req.body
    let user = await funcUsers.criarUser(userLogin);

    res.status(200).send(user)
});

//  Read User
router.get('/users',checkToken, async (req, res) => {
    let logins = await funcUsers.getAllLogin();
    console.log(logins)
    res.status(200).send(logins)

});

// Update User from ID
router.put('/user/:id',checkToken, async (req, res) => {
    let filter = req.params.id;
    let newDate = req.body;

    let user = await funcUsers.updateUser(filter, newDate);
    console.log(user)

    res.status(200).send({ success: true, user })
});

// Delete User from ID
router.delete('/user/:id',checkToken, async (req, res) => {
    let user = req.params.id
    let UserID = await funcUsers.deleteUser(user);
    res.status(200).send(`<h1> O User: "${user}" Foi Removido Com Exito !! </h1>`)
});

//  Pegar Um Usuario pelo ID
router.get('/user/:id',checkToken, async (req, res) => {
    let User = req.params.id
    let UserID = await funcUsers.getUser(User);
    console.log(UserID)
    res.status(200).send(UserID)
});



// Apagar tudo
 router.delete('/deletmany',checkToken, async (req, res) => {
     let msg = await funcUsers.deletaUsers()
     res.status(200).send(msg)
 })

// Retorna Usuario Pelo Email
router.get('/login',  async (req, res) => {
    let newDate = req.body;
    let user = await funcUsers.getLogin(newDate);
    console.log(user)

    res.status(200).send({ success: true, user })
});


module.exports = router;