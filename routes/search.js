const express = require('express')
const router = express.Router();
const {verifyAccess} = require("../middleware/auth");
const User = require('../models/User');

//Search for and filter users matching current user preferences
router.get("/filter/:id", verifyAccess, async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id)
    if(user){
      const minAge = user.preferences.minAge
      const maxAge = user.preferences.maxAge
      const longitude = user.location.coordinates[0]
      const latitude = user.location.coordinates[1]
      const maxDistance = user.preferences.maxDistance * 1609.34

      var minDob = new Date()
      minDob.setFullYear(minDob.getFullYear() - maxAge - 1)
      var maxDob = new Date()
      maxDob.setFullYear(maxDob.getFullYear() - minAge + 1)
      minDob = minDob.toISOString().split('T')[0]
      maxDob = maxDob.toISOString().split('T')[0]
      
      const query = await User.find({
        _id: {
          $ne: req.params.id
        },
        dob: {
          $gte: new Date(minDob),
          $lte: new Date(maxDob)
        },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        }
      }).limit(25).select('_id name dob')
      res.send({data: query})
    }else{
      res.status(400).send({error: "Current user not valid"})
    }
  }catch(err){
    console.log(err)
    res.status(400).send({message: "Error"})
  }
});

module.exports = router
