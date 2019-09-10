let mongoose=require('mongoose');

let developSchema = mongoose.Schema({
    name:{
        firstname:{
            type:String,
            require:true
        },
        lastname:String
    },

    level:{
        type:String,
        require:true,
        set: function(level){
            return level.toUpperCase()
        }
    },

    address:{
        unit:String,
        street:String,
        suburb:String,
        state:String,
        }
});


let developerModel = mongoose.model('developer', developSchema, 'developer');
module.exports=developerModel;