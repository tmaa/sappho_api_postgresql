const admin = require("../firebaseConfig")

const verifyAccess = async (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    const userInfo = await admin.auth().verifyIdToken(token);
    req.authId = userInfo.uid;
    return next();
  } catch(err){
    return res.status(401).send({error: 'Access Denied'});
  }
}

module.exports.verifyAccess = verifyAccess