var jwt = require('jsonwebtoken')

module.exports={



validateUser:function(req,res,next){

    jwt.verify(req.headers['x-access-token'],req.app.get('secretKey'),function(err,decoded){

    if (err) {
        res.status(401).json({

statut:401,
message:err.message,
data:null

        })
        
    } 
    



    })

}








}