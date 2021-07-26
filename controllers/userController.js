
const bodyParser = require('body-parser')
const userModel=require('../models/userModel')
const bcrypt =require('bcrypt')
const SaltRounds =10
var jwt = require("jsonwebtoken");



var refreshTokens = {}//dectation de nouveau jwt

module.exports={

createUser:function(req,res){


userModel.create(req.body,function(err,user){

if (err) {

    res.json({message:'error add user'+err,data:null ,status:500})
    
} else {
    
    res.json({message:'user added successfuly',data:user ,status:200})
}


})


},




getAllUser:function(req,res){


userModel.find({}).populate('commandes','adresse_cmd ').exec((err,users)=>{

if (err) {
    
    res.json({message:'error get all users'+err,data:null ,status:500})
} else {
    
    res.json({message:'all users in system',data:users ,status:200,size:users.length})

}

})

},


getUserById :function(req,res){

    userModel.findById({_id:req.params.id}).populate('commandes','adresse_cmd -_id').exec((err,users)=>{

        if (err) {
            
            res.json({message:'error get one user'+err, data:Null ,status:500})
        } else {
            
            res.json({message:'one user in system',data:userModel.length,status:200})
        
        }
        
        })
},






deleteUserById :function(req,res){

    userModel.findByIdAndDelet({_id:req.params.id},(err,users)=>{

        if (err) {
            
            res.json({message:'error delete  one user'+err,data:null ,status:500})
        } else {
            
            res.json({message:'one user delete system', data:users ,status:200})
        
        }
        
        })
        


} ,





updateUserById :function(req,res){

   

    userModel.updateOne({_id:req.params.id},req.body,(err,users)=>{//bech naccedi lel contenu lkol mte3 lbody w nbadel kima n7eb kima n7eb
        //userModel.updateOne({_id:req.params.id},{nom:req.body.nom,prenom:req.body.prenom},(err,users)=>{ ::bech tbadali el nom wel prenom eli fel id n...
        if (err) {
            
            res.json({message:'error update  one user'+err,data:null ,status:500})
        } else {
            
            res.json({message:'one user updated', data:users ,status:200})
        
        }
        
        })
        


},



    signin :function (req, res){
      userModel.findOne({
        email: req.body.email
      },(err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
          var token = jwt.sign({ id: user.id }, req.app.get('secretKey'), {
            expiresIn: 86400 // 24 hours
          });
          var refreshToken = jwt.sign({ id: user.id }, req.app.get('secretKey'), {
            expiresIn: 86400 // 24 hours
          });
          refreshTokens[refreshToken] = user._id
          res.status(200).send({
           message:'user found',
              user:user,
            accessToken: token,
            refreshToken: refreshToken,
            status:200
          });
        })
    },
    refreshToken: function (req, res) {
      var id = req.body._id
      var refreshToken = req.body.refreshToken
      // console.log('id',id)
      console.log('refreshTokens',(refreshTokens[refreshToken] == id))
      console.log('refresh',(refreshToken in refreshTokens)) 
      if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == id)) {
          var userId = {
              'id': id
          }
          var token = jwt.sign(userId, req.app.get('secretKey'), {expiresIn: 3600})
          res.json({accesstoken: token})
      } else {
          res.sendStatus(401) 
      }
  },




  LogOut: function (req, res) {
    var refreshToken = req.body.refreshToken
    // console.log('refreshToken',refreshToken)
    jwt.verify(req.headers['x-access-token'],req.app.get('secretKey'))
    if (refreshToken in refreshTokens) {
        delete refreshTokens[refreshToken]
    }
    res.json({msg:'token experied', status: 204})
},






    
sendMail: function (req, res) {
   
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wwwwboudhina@gmail.com',
      pass: '********'
    }
  });
  
  /*send statique var mailOptions = {
    from: 'wwwwboudhina@gmail.com',
    to: 'wejdenbdn94@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: "<b>(` mon text est ${text}`)</b>",*/
    
//send dynamique

var mailOptions = {
  //from: req.body.from,
  to: req.body.to,
  subject:req.body.subject,
  text:req.body.text,
  


      };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.json({message:'error ' +error});
    } else {

      res.json({message:'Email sent: ' + info.response});
    }
  })
  
        
  },









}

