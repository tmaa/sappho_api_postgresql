const express = require('express')
const router = express.Router();
const {verifyAccess} = require("../middleware/firebase-auth");
const pool = require("../db/connection")

/**
 * ---common parameters---
 *  -req.authId- comes from firebase middleware authentication check 
 */

/**
 * Current account likes or dislikes target account
 * */
router.post("/like-dislike", verifyAccess, async (req, res) => {
  console.log(req.body)
  const {account_id, target_account_id, liked} = req.body
  const checkMutualLike = `
          SELECT 1 FROM interaction
          WHERE account_id = $1
          AND target_account_id = $2
          AND liked = true`
  const checkMutualLikeValues = [target_account_id, account_id]
  const insertIntointeraction = `
        INSERT INTO interaction (account_id, target_account_id, liked)
        VALUES ($1, $2, $3) RETURNING *`
  const insertIntointeractionValues = [account_id, target_account_id, liked]
  const insertIntoMatch = ``
  try{
    if(liked){
      const mutualLikeRes = await pool.query(checkMutualLike, checkMutualLikeValues)
      if(mutualLikeRes.rowCount === 1){
        console.log("mutual like established")
      }
    }
    const statementRes = await pool.query(insertIntointeraction, insertIntointeractionValues)
    //console.log(statementRes)
    res.send({message: "statementRes"})
  }catch(error){
    console.log(error)
    res.status(400).send({error: "Liked/Dislike insert failed"})
  }
})

module.exports = router