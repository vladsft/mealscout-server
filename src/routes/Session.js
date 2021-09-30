const express = require('express')
const fs = require('fs')
var path = require('path');

const router = express.Router()

const db = require('../queries')

router.post('/', async (req, res) => {
    /* Create new session in db and generate token*/
    const session = await db.addSession()

    res.status(200).json({
        session: session.rows[0].id
    })
})

module.exports = router