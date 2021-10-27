const mongoose=require('mongoose')
const Schema = mongoose.Schema

var uniqueValidator = require('mongoose-unique-validator');



const categorieSchema = new Schema({


name_categorie:{

    type:String,
    require:true
},


type_categorie:{

    type:String,
    require:true
},


subcategorie:[{

    type:mongoose.Schema.Types.ObjectId,////plusieur  relation entre commande et user (1..*) donc juste ajouter [] pour devient un tableau d'objet
    ref:"subcategorie"
    
    
    }]


},

{timestamps:true},



)


categorieSchema.plugin(uniqueValidator);

module.exports=mongoose.model('categorie',categorieSchema);