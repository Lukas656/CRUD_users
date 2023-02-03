require('dotenv').config();
const { ObjectID } = require('mongodb');
const conectDB = require("../Model/BD-conect");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/* Exibe todos os os logins do banco*/
async function getAllLogin() {
    const conectionDb = await conectDB.getConect();
    const logins = await conectionDb.find().toArray();
    return logins
};

// retorna um usuario pelo seu ID
async function getUser(id) {
    const conectionDb = await conectDB.getConect();
    const user = conectionDb.findOne({ _id: ObjectID(id) });
    return user;
};
// retorna email e senha
async function getLogin(email) {
    const conectionDb = await conectDB.getConect();

    const user = await conectionDb.findOne(email, email);
    
    const userEmail = user.email
    const userPass = user.password

    const res = {userEmail, userPass}
    
    return res;
};

// /* Criar um novo Usuário*/
async function criarUser(newUser) {
    const conectionDb = await conectDB.getConect();

    if (!newUser.name || !newUser.email || !newUser.state || !newUser.password) {
        return newUser = { alert: 'Nao foi possivel Criar este usuario Ainda falta campos para preenche!' }
    }

    // criptografando password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(newUser.password, salt)
    newUser.password = passwordHash
    console.log(newUser);

    const returnUser = await conectionDb.insertOne(newUser);

    return returnUser
};

// gero um token de autenticação
async function checkToken(buscaLogin) {
const conectionDb = await conectDB.getConect();

const checkEmail = await conectionDb.findOne({email: buscaLogin.email});
if(!checkEmail){
    return {msg: 'email invalido!!!'}
}

const checkPass = await bcrypt.compare(buscaLogin.password, checkEmail.password);
if(!checkPass){
    return {msg: 'Senha invalida!!!'}
}

const secret = process.env.TOKEN_SECRET

const token = jwt.sign({
    id: checkEmail._id,
    name: checkEmail.name
    // data de expiração , nome 
},secret)

const resp = {token}

return resp

}

// /* Atualiza Usuário*/
async function updateUser(filter, newDate) {
    const conectionDb = await conectDB.getConect();

    let myquere = { _id: ObjectID(filter) }

    let newValues = { $set: { name: newDate.name, email: newDate.email, state: newDate.state, password: newDate.password, photo: newDate.photo } }

    let resp = await conectionDb.updateOne(myquere, newValues);

    return resp
};

// /* Deleta Usuário*/
async function deleteUser(id) {
    const conectionDb = await conectDB.getConect();
    const user = conectionDb.deleteOne({ _id: ObjectID(id) });
    return user;
};

// apaga tudo
async function deletaUsers() {
    const conectionDb = await conectDB.getConect();
    const users = conectionDb.deleteMany()
    return "Todos Os Usuarios Foram Excluidos Com Sucesso !!!";
};



const funcLogin = {
    getAllLogin,
    getUser,
    getLogin,
    criarUser,
    updateUser,
    deleteUser,
    checkToken,
    deletaUsers
}

module.exports = funcLogin;