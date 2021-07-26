
const bodyParser = require('body-parser')
const userModel=require('../models/userModel')
const bcrypt =require('bcrypt')
const SaltRounds =10
var jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const Joi = require("joi");


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

    userModel.findByIdAndDelete/*deleteOne*/({_id:req.params.id},(err,users)=>{

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



removeUser :function(req,res){

   

    userModel.remove({},(err,users)=>{
        
        if (err) {
            
            res.json({message:'error deleted users'+err,data:null ,status:500})
        } else {
            
            res.json({message:'users deleted successfuly', data:users ,status:200})
        
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




/*
signin:function(req, res){
    userModel.findOne({email: req.body.email},(err,user)=>{
      
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

      var token = jwt.sign({ id: user.id }, 'bootcamp', {
        expiresIn: 86400 // 24 hours//generili un token par jwt qui prend les donnes id user puis elle va generer un nouveau token 
      });

          res.status(200).send({
          message:'user found',
          
          user:user,
          
           accessToken: token

            });


        });
       
        
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
          var token = jwt.sign({ id: user.id }, 'secret', {
            expiresIn: 86400 // 24 hours
          });
          res.status(200).send({
           message:'user found',
              user:user,
            accessToken: token,
            status:200
          });
        })
    }*/




    
sendMail: function (req, res) {
   
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '********',
      pass: '******'
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




  forgetPass: async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}




/*

      // request to send smtp email containing jwt token in the URL
      for('/forgot', function(req, res, next){
        async.waterfall([
           
            function(token, user, done){
                const smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'XXXX',
                        pass: 'XXXX'
                    }
                });
    
                const mailOptions = {
                    to: user.email,
                    from: 'xxxx@gmail.com',
                    subject: 'Nodejs password reset',
                    text: 'You are receiving this email. Please click on the email for password reset ' +
                          'http://' + req.headers.host + '/reset/' + token + '\n\n' + 
                          'If you did not request this, please ignore this email'
                };
                smtpTransport.sendMail(mailOptions, function(err){
                    console.log('mail sent');
                    done(err, 'done');
                });
            }
        ], function(err){
            if(err) return next(err);
        });
    });
    
    // request to get and verify if the token has expired or user is invalid
    router.get('/reset/:token', function(req, res){
        Usermodel.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, user){
            if(!user) {
                return res.status(422).send({errors: [{title: 'Invalid token!', detail: 'User does not exist'}]});
            }   
            res.json('reset', {token: req.params.token});
        });
    });
    
    // request to update the password in database if password and confirm password is matching. Also send email to user regarding successful password change
    router.post('/reset/:token', function(req, res){
        async.waterfall([
            function(done) {
                Usermodel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
                    if(!user){`enter code here`
                        return res.status(422).send({errors: [{title: 'error', detail: 'Password reset token is invalid or has expired'}]});
                    }
    
                    if(req.body.password === req.body.confirm){
                        user.setPassword(req.body.password, function(err){
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
    
                            user.save(function(err){
                                req.logIn(user, function(err) {
                                    done(err, user);
                                });
                            });
                        });
                    } else {
                        return res.status(422).send({errors: [{title: 'error', detail: 'Password do not match'}]});
                    }
                });
            },
            function(user, done){
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'XXXX',
                        pass: 'XXXX'
                    }
                });
    
                var mailOptions = {
                    to: user.email,
                    from: 'xxxx@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' + 
                        'This is a confirmation that the password for your account ' + user.email + ' has just changed'
                };
                smtpTransport.sendMail(mailOptions, function(err){
                    done(err);
                });
            }
        ],   function(err){
            res.redirect('/');
        });
    })


*/






}

