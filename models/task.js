let mongoose=require('mongoose');

let taskSchema=mongoose.Schema({
    taskname:String,
    assignto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developer'
    },
    taskdue:Date,
    taskstate:String,
    taskdesc:String
});

let taskModel = mongoose.model('task', taskSchema, 'task');
module.exports=taskModel;