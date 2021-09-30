require('dotenv').config();

const express = require('express')
const app = express()

const JWT = require('jsonwebtoken')
const logger = require('morgan')
const cors = require('cors')

const Recipes = require('./routes/Recipes')
const Session = require('./routes/Session')
const Cart = require('./routes/Cart')

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send("Hello World");
})

app.use('/recipes', Recipes)

app.use('/session', Session)

app.use('/cart', Cart)

/* Start server and export it */

module.exports = {
  server: app.listen(process.env.PORT, () => { console.log(`Example app listening at http://localhost:${process.env.PORT}`) }),
  //  routes: routes
}

/* Allow stopping server from terminal */

process.on('SIGINT', function () {
  console.log("\nGracefully shutting down server from SIGINT (Ctrl-C)");
  process.exit(1);
})

process.on('SIGTSTP', function () {
  console.log("\nGracefully shutting down server from SIGTSTP (Ctrl-Z)");
  process.exit(1);
})