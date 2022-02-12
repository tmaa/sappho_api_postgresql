const express = require('express')
const router = express.Router();
const {verifyAccess} = require("../middleware/firebase-auth");

//Search for and filter users matching current user preferences
router.get("/filter/:id", verifyAccess, async (req, res, next) => {
 
});

module.exports = router
