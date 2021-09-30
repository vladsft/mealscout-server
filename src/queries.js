const pg = require('pg')
const Pool = pg.Pool

const pool = new Pool()
pg.defaults.ssl = true;

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const _addIngredient = (req, res) => {
  pool.query('INSERT INTO ingredients (title, unit_price, unit_quantity, by_piece) VALUES ($1,$2,$3,$4)',
    [title, unit_price, unit_quantity, by_piece]
    , (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
}

const _addMeal = (req, res) => {
  pool.query('INSERT INTO meals (title, prep_time, instructions) VALUES ($1,$2,$3)',
    [title, prep_time, instructions]
    , (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
}

const getRecipes = async () => {
  try {
    const res = await pool.query('SELECT * FROM recipes ORDER BY title')
    return res.rows
  }
  catch (error) {
    throw error
  }
}

const getRecipe = async (id) => {
  try {
    const res = await pool.query('SELECT * FROM recipes WHERE id = $1', [id])
    return res.rows[0]
  }
  catch (error) {
    throw error
  }
}

const getRecipeIngredients = async (recipeID) => {
  try {
    const res = await pool.query('SELECT *\
    FROM recipes_ingredients\
    INNER JOIN ingredients ON recipes_ingredients.ingredient = ingredients.id\
    WHERE recipes_ingredients.recipe = $1\
    ORDER BY ingredients.title ASC', [recipeID])
    return res.rows
  }
  catch (error) {
    throw error
  }
}

const addSession = async () => {
  try {
    const session = await pool.query('INSERT INTO sessions(dummy)\
    VALUES (null)\
    RETURNING *')
    return session
  }
  catch (error) {
    throw error
  }
}

const getSessionCart = async (owner_id) => {
  try {
    const res = await pool.query('SELECT *\
    FROM cart_recipes\
    INNER JOIN recipes ON recipes.id = cart_recipes.recipe_id\
    WHERE cart_recipes.owner_id = $1\
    ORDER BY recipes.title ASC', [owner_id])
    return res.rows
  }
  catch (error) {
    throw error
  }
}

const addItemToCart = async (owner_id, recipe_id) => {
  try {
    const update = await pool.query('UPDATE cart_recipes\
    SET count = count + 1\
    WHERE cart_recipes.owner_id = $1\
    AND cart_recipes.recipe_id = $2', [owner_id, recipe_id])
    if (update.rowCount == 0) {
      const insert = await pool.query('INSERT INTO cart_recipes\
      VALUES ($1, $2, 1)', [owner_id, recipe_id])
      return insert.rows
    }
    return update.rows
  }
  catch (error) {
    throw error
  }
}

const removeItemFromCart = async (owner_id, recipe_id) => {
  try {
    const update = await pool.query('UPDATE cart_recipes\
    SET count = count - 1\
    WHERE cart_recipes.owner_id = $1\
    AND cart_recipes.recipe_id = $2\
    RETURNING count', [owner_id, recipe_id])
    if (update.rowCount != 0) {
      if (update.rows[0].count <= 0) {
        const del = await pool.query('DELETE FROM cart_recipes\
      WHERE owner_id = $1\
      AND recipe_id = $2', [owner_id, recipe_id])
        return del.rows
      }
    }
    return update.rows
  }
  catch (error) {
    throw error
  }
}


module.exports = {
  getRecipes,
  getRecipe,
  getRecipeIngredients,
  addSession,
  getSessionCart,
  addItemToCart,
  removeItemFromCart
}