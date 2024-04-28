var jwt = require('jsonwebtoken')
const secretKey = '1111'

const userAuthenticate = (req, res, next)=>{  
  const authToken = req.headers['Authorization'] || req.headers['authorization']
  if(!authToken){
    return res.status(401).end()
  }

  try{
    const decoded = jwt.verify(authToken, secretKey)  
    req.user = decoded
    next()
  }catch(e){
    console.error(e)
    res.status(401).end()
  }  
}

module.exports = {
    secretKey,
    userAuthenticate
}