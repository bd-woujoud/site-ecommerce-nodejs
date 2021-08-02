const mongoose=require('mongoose')
const Schema = mongoose.Schema

var uniqueValidator = require('mongoose-unique-validator');



const subcategorieSchema = new Schema({


id_sub:{

    type:String,
    require:true
},

product:[{

    type:mongoose.Schema.Types.ObjectId,
    ref:"product"
    
    
    }],





categorie:{

    type:mongoose.Schema.Types.ObjectId,
    ref:"categorie"
    
    
    }





},


{timestamps:true},



)


subcategorieSchema.plugin(uniqueValidator);

module.exports=mongoose.model('subcategorie',subcategorieSchema);