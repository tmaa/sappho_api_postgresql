const express = require('express')
const {registerValidation} = require('../validation')
const router = express.Router();
const {verifyAccess} = require("../middleware/auth")

//Create new user
router.post("/register", async (req, res, next) => {
  const {error} = registerValidation(req.body)
  if(error){
    console.log(error.details[0].message)
    return res.status(400).send({message: error.details[0].message})
  }
  res.send({message: req.body})
  console.log(req.body)
  console.log(JSON.stringify(req.body))
  console.log("test deploy")
  next();
});

//Get current logged in user information
router.get("/me", verifyAccess, async (req, res, next) => {
  /*req.authId comes from middleware authentication check*/
 
});

//DELETE - Delete account of current logged in user
router.delete("/me/delete", verifyAccess, async (req, res, next) => {
  
});

//GET - Login user
router.get("/login", async (req, res, next) => {
  
});

/*
Update specific user
Only fields eligible for updates are preferences
*/
router.put("/me/preferences", verifyAccess, async (req, res, next) => {

});

module.exports = router
