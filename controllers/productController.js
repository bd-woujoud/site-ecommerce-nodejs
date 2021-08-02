
const bodyParser = require('body-parser')
const productModel=require('../models/productModel')
const nodemailer=require('nodemailer')
module.exports={


createProduct:function(req,res){

    //productModel.create(req.body,function(err,product){

    
  console.log(req.body)

            let img =req.file
            console.log('fiiiiiiilllleee',req.file.mimetype);
            if(img.mimetype!=='image/png'){
              res.json({msg:'please enter a valid extention'})
            }
            else{
              productModel.create({
                name:req.body.name,
                price:req.body.price,
                description:req.body.description,
                image:img.filename
               
              },function(err,product){
                  if (err) {
                      res.json({message:'error add model'+err,data:null,status:500})
                  } else {
                      res.json({message:'Model created successfully',data:product,status:200})
                  }
              })
            }
          },

        /*name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        image:req.file.filename},(err,product)=>{



            if (err) {
    
                res.json({message:'error add product'+err,data:null ,status:500})
            } else {
                
                res.json({message:'product added ',data:product ,status:200})
            
            }
        })

},*/


getAllproduct:function(req,res){


productModel.find({}).populate('commande').populate('subcategorie').exec((err,product)=>{

if (err) {
    
    res.json({message:'error get all product'+err,data:null ,status:500})
} else {
    
    res.json({message:'all product in system',data:product ,status:200})

}

})

},

getproductById :function(req,res){

   productModel.findById({_id:req.params.id}).populate('commande').populate("subcategorie").exec((err,product)=>{

        if (err) {
            
            res.json({message:'error get  product'+err,data:null ,status:500})
        } else {
            
            res.json({message:'this product in system', data:product ,status:200})
        
        }
        
        })
        



},





deleteproductById :function(req,res){

   

    productModel.deleteOne({},(err,product)=>{
        
        if (err) {
            
            res.json({message:'error removed product'+err,data:null ,status:500})
        } else {
            
            res.json({message:'one product remove successfuly', data:product,status:200})
        
        }
        
        })
        


} ,




updateproductById :function(req,res){

   

    productModel.findByIdAndUpdate({_id:req.params.id},req.body,(err,product)=>{
        
        if (err) {
            
            res.json({message:'error update product'+err,data:null ,status:500})
        } else {
            
            res.json({message:'product updating successfuly', data:product,status:200})
        
        }
        
        })
        


} ,


sendimage: function (req, res) {
    var data = req.body;
    var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
  
    auth: {
    user: 'wwwwboudhina@gmail.com',
    pass: 'zoula1983'
    }
    });

    var mailOptions = {
    from: data.email,
    
    to: 'wejdenbdn94@gmail.com',
    subject: data.title,
    html: `<p>${data.email}</p>
    <p>${data.message}</p>`,
    attachments: [
    {
    filename: 'image.png',
    contentType:  'image/jpeg',
  
    }
    ]
    };

    smtpTransport.sendMail(mailOptions,
    (error, response) => {
    if (error) {
    res.status(400).send(error)
    } else {
    res.send('Success')
    }
    smtpTransport.close();
    });
    }



}