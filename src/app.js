const express = require('express');
const routers = require('./routers/router');
const port = 8000;

const app = express();
app.use(routers)







app.listen(port, () => {
    console.log(`Rodando na porta: http://localhost:${port}`)
});