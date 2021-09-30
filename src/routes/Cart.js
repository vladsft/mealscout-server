const express = require('express')
const fs = require('fs')
var path = require('path');

const router = express.Router()

const db = require('../queries')

router.post('/', async (req, res) => {
    /* Create new session in db and generate token*/
    const body = req.body
    const session = body.session
    const cart = await db.getSessionCart(session)

    res.status(200).json(cart)
})

router.post('/add', async (req, res) => {
    const body = req.body
    const session_id = body.session
    const recipe_id = body.recipe
    await db.addItemToCart(session_id, recipe_id)

    res.sendStatus(200)
})

router.post('/del', async (req, res) => {
    const body = req.body
    const session_id = body.session
    const recipe_id = body.recipe
    await db.removeItemFromCart(session_id, recipe_id)

    res.sendStatus(200)
})

module.exports = router