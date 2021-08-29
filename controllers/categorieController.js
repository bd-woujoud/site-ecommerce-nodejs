

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
       
        const result = await (await categoriemodel.find({}).populate('subcategorie'));
        res.json({message:'all categorie in bd', data:result,status:200});
     
      } catch (error) {
        console.log(error.message);
        res.json({message:'error', data:null,status:500});
      }
  },





  getCategorieById: async (req, res) => {

    try { 
     
      const result = await categoriemodel.findById({_id:req.params.id}).populate('subcategorie');
      res.json({message:'categorie in bd', data:result,status:200});
    
    } catch (error) {
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


  updatecategorie :function(req,res){

    categoriemodel.findOneAndUpdate({_id:req.params.id},req.body,(err,categorie)=>{
        
        if (err) {
            
            res.json({message:'error update  one categorie'+err,data:null ,status:500})
        } else {
            
            res.json({message:'one categorie updated', data:categorie ,status:200})
        
        }
        
        })
},


// updatecategorie: async (req,res) => {
//     try{
//         const result = await categoriemodel.findOneAndUpdate({_id:req.params.id},req.body)
//         res.json({message:'categorie ', data:result,status:200});
//     } catch (error) {
//         console.log(error.message);
//         res.json({message:'error', data:null,status:500});
//     }
// },





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


















