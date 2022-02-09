const express = require('express')
const User = require('../models/User');
const {registerValidation} = require('../validation')
const router = express.Router();
const {verifyAccess} = require("../middleware/auth")

//POST - Create new user
router.post("/register", async (req, res, next) => {
  //validate before db entry
  const {error} = registerValidation(req.body)
  if(error){
    console.log(error.details[0].message)
    return res.status(400).send({message: error.details[0].message})
  }

  const checkEmail = await User.findOne({email: req.body.email});
  const checkPhone = await User.findOne({phone: req.body.phone});
  // if(checkEmail){
  //   console.log("Email already exists")
  //   return res.status(400).send({message: "Email already exists"})
  // }
  // if(checkPhone){
  //   console.log("Phone number already exists")
  //   return res.status(400).send({message: "Phone number already exists"})
  // }

  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    dob: req.body.dob,
    height: req.body.height,
    email: req.body.email,
    phone: req.body.phone,
    preferences:{
      minAge: 18,
      maxAge: 99,
      maxDistance: 25
    },
    location: {
      type: "Point",
      coordinates: [req.body.coordinates.longitude, req.body.coordinates.latitude]
    }
  });

  try{
    const newUser = await user.save()
    console.log(newUser)
    res.send({message: "User created", user: newUser});
  }catch(err){
    console.log(err)
    res.status(400).send({status: 400, error: err})
  }
  next();
});

//GET - Get current logged in user information
router.get("/me", verifyAccess, async (req, res, next) => {
  /*req.authId comes from middleware authentication check*/
  try{
    const userInfo = await User.findById(req.authId)
    console.log(userInfo)
    res.status(200).send({user: userInfo});
  }catch(err){
    console.log(err)
    res.status(400).send({error: err})
  }
});

//DELETE - Delete account of current logged in user
router.delete("/me/delete", verifyAccess, async (req, res, next) => {
  try{
    const user = await User.findOneAndDelete(req.authId)
    console.log(user)
    res.status(200).send({message: `Account deleted`})
  }catch(err){
    console.log(err)
    res.status(400).send({error: err})
  }
});

//GET - Login user
router.get("/login", async (req, res, next) => {
  console.log(req)
});

/*
Update specific user
Only fields eligible for updates are preferences
*/
router.put("/me/preferences", verifyAccess, async (req, res, next) => {
  try{
    const user = await User.findOneAndUpdate(
      {_id: req.authId}, 
      {$set: 
        {
          "preferences.minAge": req.body.minAge,
          "preferences.maxAge": req.body.maxAge,
          "preferences.maxDistance": req.body.maxDistance,
        }
      }, {new: true},    
    )
    console.log(user)
    res.status(200).send({user: user});
  }catch(err){
    res.status(400).send({error: err})
  }
});

module.exports = router
