
const bodyParser = require('body-parser')
const userModel=require('../models/userModel')
const bcrypt =require('bcrypt')
const SaltRounds =10
var jwt = require("jsonwebtoken");
var _ = require("lodash");
var nodemailer = require("nodemailer");
var fs = require("fs");
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




getAllUser: async(req,res)=>{

    /// const limit =3;/*pagination*/
     // const skip0 =;
   /*  page=req.params.page;
     const PAGE_SIZE = 2;                   // Similar to 'limit'
     const skip = (page - 1) * PAGE_SIZE;    // For page 1, the skip is: (1 - 1) * 20 => 0 * 20 = 0
     
        userModel.find({}).skip(skip).limit(PAGE_SIZE).populate("id_commande").exec((err,users)=>{

            if(err){

                res.json({message:'error get all users'+err,data:null,status:500})
                
            }else{

                res.json({size:users.length , message:'all users in system',size:users.length, data:users,status:200})
                
            }
    })
    */



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
            
            res.json({message:'error get one user'+err, data:null ,status:500})
        } else {
            
            res.json({message:'one user in system',data:users,status:200})
        
        }
        
        })
},






deleteUserById :function(req,res){

    userModel.findByIdAndDelete({_id:req.params.id},(err,users)=>{

        if (err) {
            
            res.json({message:'error delete  one user'+err,data:null ,status:500})
        } else {
            
            res.json({message:'one user delete system', data:users ,status:200})
        
        }
        
        })
        


} ,





updateUserById :function(req,res){

   

    userModel.updateOne({_id:req.params.id},req.body,{runValidators: true}/*runvalidator pour respecterla validation au fonction update*/,(err,users)=>{//bech naccedi lel contenu lkol mte3 lbody w nbadel kima n7eb kima n7eb
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
       console.log('inBody',req.body)
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
      pass: 'zoula1983',
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
  from: req.body.from,
  to: req.body.to,
  subject:req.body.subject,
  text:req.body.text,
  
/*
  attachments: [{

          
    filename: 'Forest.png',
    path: 'C:/Users/Wejdane/Downloads/Forest.jpg',
    cid: 'uniq-Forest.jpg'
  

}],*/

      };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.json({message:'error ' +error});
    } else {

      res.json({message:'Email sent: ' + info.response});
    }
  })
  
        
  },




  forgotPassword: function (req, res) {
    const Email = req.body.email;
    userModel.findOne({ email: Email }, (err, user) => {
        if (err || !user) {
            return res.json({
                status: 'Email error',
                error: 'Email does not exist',
            });
        }
        const token = jwt.sign({ _id: user._id }, req.app.get('secretKey'), {
            expiresIn: '20min',
        });
        console.log(token);
        var data = {
            from: '*****',
            to: Email,
            subject: 'Reset Password',

            text: `http://localhost:3000/reset-password/${token}`,
            // text:  voila = {token}
        };
        
        return userModel.findOneAndUpdate(
            { email: Email },
            { resetLink: token },
            (err, info) => {
                var transporter4 = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "wwwwboudhina@gmail.com",
                        pass: 'zoula1983',
                    },
                });
                transporter4.sendMail(data, function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.json({ err: 'Error in email' });
                    } else {
                        return res.json({
                            status: 'Success',
                            message: 'Email has been send',
                        });
                    }
                });
            }
        );
    });
},



resetPassword: function (req, res) {
    resetLink = req.body.resetLink;
    newPass = req.body.newPass;
    if (resetLink) {
        jwt.verify(
            resetLink,
            req.app.get('secretKey'),
            function (err, decodeData) {
                if (err) {
                    return res.json({
                        message: 'invalid token',
                        error: 'Incorrect token or it is expired',
                    });
                }
                userModel.findOne({ resetLink: resetLink }, (err, user) => {
                    if (err || !user) {
                        return res.json({
                            message: 'invalid token',
                            error: 'User with this token does not exist',
                        });
                    }
                    const obj = {
                        password: newPass,

                        
                    };
                    user = _.extend(user, obj);
                    user.save((err, result) => {

                        console.log(result)
                        if (err) {
                            return res.status(400).json({
                                error: 'Reset password error',
                            });
                        } else {
                            return res.status(200).json({
                                status: 'Success',
                                message: 'Password has been changed!',
                            });
                        }
                    });
                });
            }
        );
    } else {
        return res.status(401).json({
            error: 'Authentification error',
        });
    }
},





}

