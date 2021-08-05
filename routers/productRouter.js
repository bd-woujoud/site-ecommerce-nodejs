
const productController =require('../controllers/productController');
const productModel =require('../models/productModel'); //7atineh 5ater ena 3addit fct de pagination fi product model 
const express=require('express');
const upload=require('../midlware/uploadFile');
const pagination = require('../midlware/pagination');
const route= express.Router();





route.post('/addproduct',upload.single('image'), productController.createProduct)
route.get('/findallproduct/:page/:limit',pagination.paginatedResults(productModel), productController.getAllproduct)

route.get('/findproductbyid/:id',productController.getproductById)
route.delete('/deleteproductById/:id',productController.deleteproductById)
route.put('/updateproduct/:id',productController.updateproductById)



module.exports=route;