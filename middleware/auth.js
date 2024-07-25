const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const authMiddleware =async(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token){
        return res.status(401).send('Access Denied')
    }
    try{
    const verified=jwt.verify(token,process.env.TOKEN_SECRET);
    req.user=verified
    next()
    }
    catch(e){
     return res.status(401).send('Invalid token')
    }
    
}

module.exports = authMiddleware;