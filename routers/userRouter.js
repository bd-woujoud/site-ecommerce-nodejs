

const userController=require('../controllers/userController');
const express=require ('express');

const validUser = require('../midlware/validUser');
const pagination = require('../midlware/pagination');

const route= express.Router();

route.post('/addUser',/*validation.validuser*/userController.createUser);

route.get('/getUser',userController.getAllUser);/*:page*/
route.get('/getUserById/:id',userController.getUserById);
route.delete('/deleteUserById/:id',userController.deleteUserById);
route.put('/updateUserById/:id',userController.updateUserById);

route.post('/signin',userController.signin);
route.post('/refrech',userController.refreshToken);
route.post('/logout',userController.LogOut);
route.post('/sendMail',userController.sendMail);
route.post('/forgotPass',userController.forgotPassword);
route.post('/resetPass',userController.resetPassword);

module.exports=route;

