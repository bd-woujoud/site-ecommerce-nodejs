const bodyParser = require('body-parser');
const { populate } = require('../models/categoriemodel');
const categoriemodel = require('../models/categoriemodel')




module.exports={




    createNewcategorie: async (req, res) => {
        try { 
          const categorie = new categoriemodel(req.body);
          const result = await categorie.save();

        //   const result = await productModel.create(req.body)
          res.json({message:'new categorie created', data:result,status:200});
        } catch (error) {

          console.log(error.message);
          res.json({message:'error', data:null,status:500});
        }
    },
        



    getAllcategorie: async (req, res) => {
      try { 
       
        const result = await categoriemodel.find({}).populate('subcategorie').exec(err,users);
        res.json({message:'all categorie in bd', data:result,status:200});
     
      } catch (error) {
        console.log(error.message);
        res.json({message:'error', data:null,status:500});
      }
  },





  getCategorieById: async (req, res) => {

    try { 
     
      const result = await categoriemodel.find({}).populate('subcategorie').exec(err,users);
      res.json({message:'categorie in bd', data:result,status:200});
    
    } catch (error) {
      console.log(error.message);
      res.json({message:'error', data:null,status:500});
    }
  },





    deletecategorie: async (req,res) => {
      try{
          const result = await categoriemodel.findByIdAndDelete({_id:req.params.id})
          res.json({message:'categorie deleted', data:result,status:200});
      } catch (error) {
          console.log(error.message);
          res.json({message:'error', data:null,status:500});
      }
  },


  updatecategorie: async (req,res) => {
    try{
        const result = await categoriemodel.updateOne({_id:req.params.id},req.body)
        res.json({message:'categorie ', data:result,status:200});
    } catch (error) {
        console.log(error.message);
        res.json({message:'error', data:null,status:500});
    }
},


/*
updatecategorie :function(req,res){

  categoriemodel.updateOne({_id:req.params.id},req.body,(err,users)=>{
      if (err) {
          
          res.json({message:'error update  one user'+err,data:null ,status:500})
      } else {
          
          res.json({message:'one user updated', data:users ,status:200})
      
      }
      
      })
      
},
*/


removecategorie: async (req,res) => {
  try{
      const result = await categoriemodel.remove()
      res.send(result+" "+'categorie removed successefly');
  } catch (error) {
      console.log(error.message);
      res.send(error+'err');
  }
}

}


















