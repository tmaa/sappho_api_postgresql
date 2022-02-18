const express = require('express')
const router = express.Router();
const {verifyAccess} = require("../firebase/firebase-auth");
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
          SELECT 1 FROM like_dislike
          WHERE account_id = $1
          AND target_account_id = $2
          AND liked = true`
  const checkMutualLikeValues = [target_account_id, account_id]
  const insertIntolike_dislike = `
        INSERT INTO like_dislike (account_id, target_account_id, liked)
        VALUES ($1, $2, $3) RETURNING *`
  const insertIntolike_dislikeValues = [account_id, target_account_id, liked]
  const insertMatch = `
        INSERT INTO relationship (account_id_1, account_id_2)
        VALUES ($1, $2)`
  const insertMatchValues = [account_id, target_account_id]
  try{
    if(liked){
      const mutualLikeRes = await pool.query(checkMutualLike, checkMutualLikeValues)
      if(mutualLikeRes.rowCount === 1){
        console.log("mutual like established")
        const insertMatchRes = await pool.query(insertMatch, insertMatchValues)
        //console.log(insertMatchRes)
      }
    }
    const statementRes = await pool.query(insertIntolike_dislike, insertIntolike_dislikeValues)
    //console.log(statementRes)
    res.send({message: "statementRes"})
  }catch(error){
    console.log(error)
    res.status(400).send({error: "insert failed"})
  }
});

// const express = require("express");

// const Router = express.Router();

// // Very simple example
// Router.post("/new-message", (req, res) => {
//   // You can do validation or database stuff before emiting
//   req.io.emit("new-message", { content: req.body.content });
//   return res.send({ success: true });
// });

// module.exports = Router;

module.exports = router