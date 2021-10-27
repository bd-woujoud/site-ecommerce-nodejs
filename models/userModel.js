const mongoose=require('mongoose')
const Schema = mongoose.Schema

var uniqueValidator = require('mongoose-unique-validator');

const bcrypt =require('bcrypt')

const SaltRounds =10

const userSchema = new Schema({
  


    nom:{

        type:String,
        required:true  //nom est un champ obligatoire

    },

   
    prenom:{


        type:String,
        required:true


    },


    email:{
    
        type:String,
        unique:[true, 'email  required'],
        required: true, 
        //required: [true, 'User mail required'],

        // validate: {/*pour tester sur les caractére  regex*/

        //     validator: function(mail) {
        //       return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
        //     },

        //     message: props /* props qui s'affiche */ => `${props.value} is not a valid email!`

        //   },
 
          
     },
    


    password :{

        type:String,
       required:true  ,

        // validate: {/*pour tester sur les caractére  regex*/
        //     validator: function(password) {
        //       return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password);
        //     },

        //     message: props /* propse el message eli bech yeketbo*/ => `${props.value} is not a correct password`
        //   },
 
    },




    //phone : {

        //type:Number,     
        // minLength:8,
        // maxLength:20,


        //  validate: {/*pour tester sur les caractére  regex*/
        //   validator: function(phone) {
        //       return /[+]+\d{3} \d{2} \d{3} \d{3}/.test(phone);
        //     },

        //     message: props /* propse el message eli bech yeketbo*/ => `${props.value} is not a correct phone number`
        //    },


    




    resetLink:{

        type:String


    },

commandes:[{

type:mongoose.Schema.Types.ObjectId,////plusieur  relation 
ref:"commande"

}]



},



{timestamps:true},///retourne date de creation d user et date 'update

)

userSchema.plugin(uniqueValidator);




userSchema.pre('save',function(next){

this.password=bcrypt.hashSync(this.password,SaltRounds);//cryptage pasword
next()

})


module.exports=mongoose.model('user',userSchema);