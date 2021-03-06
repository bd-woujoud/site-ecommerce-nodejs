
const sellermodel = require('../models/sellermodel')




module.exports={


    
    createseller: async (req, res) => {

        try { 
          const seller = new sellermodel(req.body);
          const result = await seller.save(); //save in BD  :autre methode de ceation 
        
          res.send(result+" "+'seller created');
        }
         catch (error) {
          console.log(error.message);
          res.send(error+'err');
        }

    },
        


    
    getAllseller: async (req, res) => {
        try { 
         
          const result = await sellermodel.find({}).populate('product').populate('categorie');
          res.json({message:'all seller in bd', data:result,status:200});
       
        } catch (error) {
          console.log(error.message);
          res.json({message:'error', data:null,status:500});
        }
    },
  
  
  
  
  
    getsellerById: async (req, res) => {
  
      try { 
       
        const result = await sellermodel.findById({_id:req.params.id}).populate('product').populate('categorie');
        res.json({message:'seller in bd', data:result,status:200});
      
      } catch (error) {
        console.log(error.message);
        res.json({message:'error', data:null,status:500});
      }
    },





    deleteseller: async (req,res) => {
      try{
          const result = await sellermodel.findByIdAndDelete({_id:req.params.id})
          res.json({message:'seller deleted', data:result,status:200});
      } catch (error) {
          console.log(error.message);
          res.json({message:'error', data:null,status:500});
      }
  },


  updateseller: async (req,res) => {
    try{
        const result = await sellermodel.updateOne({_id:req.params.id},req.body)
        res.json({message:'seller updated', data:result,status:200});
    } catch (error) {
        console.log(error.message);
        res.json({message:'error', data:null,status:500});
    }
}


}






