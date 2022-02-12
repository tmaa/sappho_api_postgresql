const express = require('express')
const {registerValidation} = require('../validation')
const router = express.Router();
const {verifyAccess} = require("../middleware/auth")
const pool = require("../db/connection")

/**  
 * Create a new user. Utilizing Firebase Auth
 */
router.post("/register", async (req, res) => {
  // const {error} = registerValidation(req.body)
  // if(error){
  //   console.log(error.details[0].message)
  //   return res.status(400).send({message: error.details[0].message})
  // }
  console.log(req.body)
  const {id, name, dob, gender, coordinates, show_me, email, phone} = req.body
  const insertUser = `INSERT INTO users (id, name, date_of_birth, gender, the_geom, email, phone)
                  VALUES ($1, $2, $3, $4, st_makepoint($5, $6), $7, $8)
                  RETURNING *`
  const userValues = [id, name, dob, gender, coordinates.longitude, 
                      coordinates.latitude, email, phone]
  const insertPref = `INSERT INTO preferences (user_id, gender)
                      VALUES ($1, $2)
                      RETURNING *`
  const prefValues = [id, show_me]
  
  try{
    const userInsertRes = await pool.query(insertUser, userValues)
    const prefInsertRes = await pool.query(insertPref, prefValues)
    //console.log(queryResponse)
    res.send({message: `User ${userInsertRes.rows[0].id} inserted successfully`, 
              user: userInsertRes.rows[0], preferences: prefInsertRes.rows[0]})
  }catch(error){
    console.log(error)
    res.status(400).send({error: "User insert operation failed"})
  }
});

/**  
 * Get current logged in user information
 */
router.get("/me", verifyAccess, async (req, res) => {
  /*req.authId comes from middleware authentication check*/
  const query = `SELECT u.name, u.gender, date_part('year', AGE(NOW(), u.date_of_birth)) AS age, 
                  ST_AsGeoJSON(u.the_geom)::json AS coordinates, u.details,
                  json_build_object(
                    'gender', p.gender, 'minimum_age', p.minimum_age,
                    'maximum_age', p.maximum_age, 'maximum_distance', maximum_distance
                  ) AS preferences  
                  FROM users u 
                  JOIN preferences p ON p.user_id = u.id
                  WHERE u.id = $1`
  const values = [req.authId]
  try{
    const queryResponse = await pool.query(query, values)
    console.log(queryResponse)
    res.send({message: "Success", user: queryResponse.rows[0]})
  }catch(error){
    console.log(error)
    res.status(400).send({error: "User information retrieval failed"})
  }
});

/**  
 * Delete account of current logged in user
 */
router.delete("/me/delete", verifyAccess, async (req, res) => {
    /*req.authId comes from middleware authentication check*/
  const query = `DELETE FROM users WHERE id = $1`
  const values = [req.authId]
  try{
    const queryResponse = await pool.query(query, values)
    console.log(queryResponse)
    res.send({message: `User ${req.authId} deleted successfully`})
  }catch(error){
    res.status(400).send({error: "User deletion failed"})
  }
});

/**
 * Update logged in user preferences
 * Only fields eligible for updates are preferences
 */
router.put("/me/preferences", verifyAccess, async (req, res) => {

});

module.exports = router
