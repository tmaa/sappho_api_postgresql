const express = require('express')
const {registerValidation} = require('../validation')
const router = express.Router();
const {verifyAccess} = require("../middleware/firebase-auth")
const pool = require("../db/connection")

/**
 * ---common parameters---
 *  -req.authId- comes from firebase middleware authentication check 
 */

/**  
 * Create a new account. Utilizing Firebase Auth
 */
router.post("/register", async (req, res) => {
  // const {error} = registerValidation(req.body)
  // if(error){
  //   console.log(error.details[0].message)
  //   return res.status(400).send({message: error.details[0].message})
  // }
  //console.log(req.body)
  const {id, name, dob, gender, coordinates, interested_in, email, phone} = req.body
  const insertaccount = `
          INSERT INTO account (id, name, date_of_birth, gender, the_geom, email, phone)
          VALUES ($1, $2, $3, $4, st_makepoint($5, $6), $7, $8)
          RETURNING *`
  const accountValues = [id, name, dob, gender, coordinates.longitude, 
                      coordinates.latitude, email, phone]
  const insertPref = `
          INSERT INTO preference (account_id, interested_in)
          VALUES ($1, $2)
          RETURNING *`
  const prefValues = [id, interested_in]
  
  try{
    const accountInsertRes = await pool.query(insertaccount, accountValues)
    const prefInsertRes = await pool.query(insertPref, prefValues)
    //console.log(queryResponse)
    res.send({message: `account ${accountInsertRes.rows[0].id} inserted successfully`, 
              account: accountInsertRes.rows[0], preference: prefInsertRes.rows[0]})
  }catch(error){
    console.log(error)
    res.status(400).send({error: "account insert operation failed"})
  }
});

/**  
 * Get current logged in account information
 */
router.get("/me", verifyAccess, async (req, res) => {
  const statement = `
          SELECT u.name, date_part('year', AGE(NOW(), u.date_of_birth)) AS age, 
          ST_AsGeoJSON(u.the_geom)::json AS location, u.details, g.name AS gender,
          json_build_object(
            'interested_in', p.interested_in, 'minimum_age', p.minimum_age,
            'maximum_age', p.maximum_age, 'maximum_distance', maximum_distance
          ) AS preference  
          FROM account u 
          JOIN preference p ON p.account_id=u.id
          JOIN gender g ON g.id=u.gender
          WHERE u.id = $1`
  const values = [req.authId]
  try{
    const account = await pool.query(statement, values)
    //console.log(account)
    res.send({account: account.rows[0]})
  }catch(error){
    console.log(error)
    res.status(400).send({error: "account information retrieval failed"})
  }
});

/**  
 * Delete account of current logged in account
 */
router.delete("/me/delete", verifyAccess, async (req, res) => {
  const statement = `DELETE FROM account WHERE id = $1`
  const values = [req.authId]
  try{
    const statementRes = await pool.query(statement, values)
    //console.log(statementRes)
    res.send({message: `account ${req.authId} deleted successfully`})
  }catch(error){
    console.log(error)
    res.status(400).send({error: "account deletion failed"})
  }
});

/**
 * Update logged in account preference
 * Only fields eligible for updates are preference
 */
router.put("/me/preference", verifyAccess, async (req, res) => {
  //console.log(req.body)
  const {interested_in, minimum_age, maximum_age, maximum_distance} = req.body
  const statement = `INSERT INTO preference (interested_in, minimum_age, maximum_age, maximum_distance, account_id)
                      VALUES ($1, $2, $3, $4, $5)
                      ON CONFLICT (account_id) DO UPDATE 
                      SET interested_in = $1, minimum_age = $2, 
                      maximum_age = $3, maximum_distance = $4
                      RETURNING *`
  const values = [interested_in, minimum_age, maximum_age, maximum_distance, req.authId.toString()]

  try{
    const statementRes = await pool.query(statement, values)
    //console.log(statementRes.rows)
    res.send({message: "preference updated"})
  }catch(error){
    console.log(error);
    res.status(400).send({error: "preference update failed"})
  }
});

/**
 * Update current account information
 */
 router.put("/me", verifyAccess, async (req, res) => {

});

module.exports = router
