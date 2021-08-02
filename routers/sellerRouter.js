const sellerController =require('../controllers/sellerController');
const express=require('express');

const route= express.Router();


route.post('/addseller',sellerController.createseller);
route.get('/getseller',sellerController.getAllseller);
route.get('/getsellerById/:id',sellerController.getsellerById);
route.delete('/deletesellerById/:id',sellerController.deleteseller);
route.put('/updateseller/:id',sellerController.updateseller);




module.exports=route;