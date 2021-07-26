const bodyParser = require('body-parser')
const commandeModel = require('../models/commandeModel')




module.exports={



    
    createcommande: async (req, res) => {
        try { 
          const commande = new commandeModel(req.body);
          const result = await commande.save();
        
          res.json({message:'new commande created', data:result,statut:200});
        } catch (error) {
          console.log(error.message);
          res.json({message:'error', data:Null,statut:500});
        }
    },



    
    getAllcommande: async (req, res) => {
        try { 
         
          const result = await commandeModel.find({}).populate('user').populate('produit');
          res.json({message:'all commande in bd', data:result,statut:200});
       
        } catch (error) {
          console.log(error.message);
          res.json({message:'error', data:Null,statut:500});
        }
    },
  
  
  
  
  
    getCommandeById: async (req, res) => {
  
      try { 
       
        const result = await commandeModel.findById({_id:req.params.id}).populate('user').populate('produit');
        res.json({message:'commande in bd', data:result,statut:200});
      
      } catch (error) {
        console.log(error.message);
        res.json({message:'error', data:Null,statut:500});
      }
    },
  

    
    


    deletecommande: async (req,res) => {
      try{
          const result = await commandeModel.findByIdAndDelete({_id:req.params.id})
          res.json({message:'commande deleted', data:result,statut:200});
      } catch (error) {
          console.log(error.message);
          res.json({message:'error', data:Null,statut:500});
      }
  },


  updatecommande: async (req,res) => {
    try{
        const result = await commandeModel.updateOne({_id:req.params.id},req.body)
        res.json({message:'commande updated', data:result,statut:200});
    } catch (error) {
        console.log(error.message);
        res.json({message:'error', data:Null,statut:500});
    }
},



removecommande: async (req,res) => {
  try{
      const result = await commandeModel.remove()
      res.json({message:'commande removed', data:result,statut:200});
  } catch (error) {
      console.log(error.message);
      res.json({message:'error', data:Null,statut:500});
  }
}


}






