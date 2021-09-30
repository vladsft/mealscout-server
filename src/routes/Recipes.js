const express = require('express')
const fs = require('fs')
var path = require('path');

const router = express.Router()

const db = require('../queries')

const imagesPath = 'res/images/recipes/'

router.get('/', async (req, res) => {
    try {
        const recipes = await db.getRecipes()
        const resp = {
            recipes: recipes
        }
        res.status(200).json(resp)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const recipe = await db.getRecipe(req.params.id)
        if (!recipe) {
            res.status(404).send('recipe not found')
            return
        }

        const ingredientList = await db.getRecipeIngredients(recipe.id)
        recipe['ingredients'] = ingredientList.map((ingredient) => {
            return {
                title: ingredient.title,
                units: ingredient.units,
                unit_price: ingredient.unit_price,
                unit_quantity: ingredient.unit_quantity,
                unit_measure: ingredient.unit_measure,
                by_piece: ingredient.by_piece,
            }
        })
        const resp = {
            recipe: recipe
        }
        res.status(200).json(resp)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

router.get('/images/:id', async (req, res) => {
    const image = path.resolve(imagesPath) + '/recipe' + req.params.id + '.png'
    try {
        if (fs.existsSync(image)) {
            res.status(200).sendFile(image)
        }
        else {
            res.sendStatus(404)
        }
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

module.exports = router