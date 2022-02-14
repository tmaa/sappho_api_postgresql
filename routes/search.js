const express = require('express')
const router = express.Router();
const {verifyAccess} = require("../middleware/firebase-auth");
const pool = require("../db/connection")

/**
 * ---common parameters---
 *  -req.authId- comes from firebase middleware authentication check 
 */

/**
 * Search for and filter accounts matching current account preference
 * */
router.get("/filter", verifyAccess, async (req, res) => {
  const getPref = `SELECT p.*, ST_AsGeoJSON(u.the_geom)::json AS location 
                  FROM preference p
                  JOIN account u ON u.id = p.account_id 
                  WHERE p.account_id = $1`
  const getPrefValues = [req.authId]

  try{
    const prefRes = await pool.query(getPref, getPrefValues)
    //console.log(prefRes.rows[0])
    const {interested_in, minimum_age, maximum_age, maximum_distance, location} = prefRes.rows[0];
    
    if(interested_in === 'e'){
      const allGenders = `
        SELECT * FROM(
          SELECT *, date_part('year', AGE(NOW(), u.date_of_birth)) AS age 
          FROM account u WHERE id NOT IN (
            SELECT target_account_id 
            FROM interaction
            WHERE account_id = $1
            )
            AND u.id != $1
            AND date_part('year', AGE(NOW(), u.date_of_birth)) BETWEEN $2 AND $3
            AND ST_DWithin(u.the_geom, 'SRID=4326;POINT(${location.coordinates[0]} ${location.coordinates[1]})', $4 * 1609.34, true)
            ORDER BY random()
            LIMIT 50
        ) AS sel`
      const allGendersValues = [req.authId, minimum_age, 
                                maximum_age, maximum_distance];
      const allGendersRes = await pool.query(allGenders, allGendersValues)
      //console.log(allGendersRes.rows)
      res.send({accounts: allGendersRes.rows})
    }else{
      const specificGender = `
          SELECT * FROM (
            SELECT *, date_part('year', AGE(NOW(), u.date_of_birth)) AS age 
            FROM account u 
            WHERE id NOT IN (
              SELECT target_account_id 
              FROM interaction
              WHERE account_id = $1
              )
            AND u.id != $1
            AND date_part('year', AGE(NOW(), u.date_of_birth)) BETWEEN $2 AND $3
            AND ST_DWithin(u.the_geom, 'SRID=4326;POINT(${location.coordinates[0]} ${location.coordinates[1]})', $4 * 1609.34, true)
            AND ((u.gender = $5) OR (u.gender = $6))
            ORDER BY random()
            LIMIT 50
          ) AS sel`
      const specificGenderValues = [req.authId, minimum_age, 
        maximum_age, maximum_distance, interested_in, `t${interested_in}`];
      const specificGenderRes = await pool.query(specificGender, specificGenderValues)
      //console.log(specificGenderRes.rows)
      res.send({accounts: specificGenderRes.rows})
    }
  
  }catch(error){
    console.log(error)
    res.status(400).send({error: "Bad request"})
  }
});

module.exports = router
