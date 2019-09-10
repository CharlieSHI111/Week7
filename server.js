let express = require('express');
let app = express();
app.use(express.static('img'));
app.use(express.static('css'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));

let mongoose = require('mongoose');
let url = 'mongodb://localhost:27017/week7lab';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err) console.log(err);
    else{
        console.log('Connected')
    }
});

let Task = require('./models/task');
let Developer = require('./models/developer');
var filePath = __dirname + "/views/";

app.get('/', function(req,res){
    let fileName = filePath + 'index.html';
    res.sendFile(fileName);
});

app.get('/newtask', function(req,res){
    let fileName = filePath + 'newtask.html';
    res.sendFile(fileName);
});

app.post('/createtask', function(req,res){
    let data = req.body;

    let taskname=data.taskname;
    let assignto=data.assignto;
    let taskdue=data.taskdue;
    let taskstate=data.taskstate;
    let taskdesc=data.taskdesc;

    let task=new Task({
        taskname:taskname,
        assignto:new mongoose.mongo.ObjectId(assignto),
        taskdue:taskdue,
        taskstate:taskstate,
        taskdesc:taskdesc
    });

    task.save(function(err){
        if(err) console.log(err);
        else{
            console.log('Task Saved')
        }
    });

    res.redirect('listtasks');
});

app.get('/newdeveloper', function(req,res){
    let fileName = filePath + 'newdeveloper.html';
    res.sendFile(fileName);
});

app.post('/createdeveloper', function(req,res){
    let data = req.body;

    let firstname=data.firstname;
    let lastname=data.lastname;
    let level=data.level;
    let unit=data.unit;
    let street=data.street;
    let suburb=data.suburb;
    let state=data.state;

    let developer = new Developer({
        name:{
            firstname:firstname,
            lastname:lastname
        },
        level:level,
        address:{
            unit:unit,
            street:street,
            suburb:suburb,
            state:state
        }
    });

    developer.save(function(err){
        if(err) console.log(err);
        else{
            console.log('Developer Saved');
        }
    });

    res.redirect('listdevelopers')
});

app.get("/listtasks", function(req,res){
    Task.find().exec(function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            for(let i=0;i<result.length;i++){
                // console.log(result);
                // result.assignto = Developer.find({_id: result.assignto});
                console.log(result);
                Developer.find({_id:new mongoose.mongo.ObjectId(result.assignto)}, function(err, data){
                    if(err) console.log(err);
                    else{
                        console.log(data.name);
                    }
                });
                console.log(result)
            }
            res.render("listtasks", {mydata: result});
        }
    });
});

app.get('/listdevelopers', function(req,res){
    Developer.find().exec(function(err, result){
        if(err) console.log(err);
        else{
            res.render('listdevelopers', {mydata: result});
        }
    })
});

app.get("/deleteone", function(req,res){
    let fileName = filePath + "deleteone.html";
    res.sendFile(fileName);
});

app.post("/deleteOne", function(req, res){
    let __id = req.body.id;
    let id = new mongoose.mongo.ObjectID(__id);
    Task.deleteOne({_id: id}, function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks')
        }
    });
});

app.get("/delComplete", function(req,res){
    let fileName = filePath + "delComplete.html";
    res.sendFile(fileName);
});

app.post("/deleteComplete", function(req,res){
    Task.deleteMany({taskstate:'Complete'}, function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks');
        }
    });
});

app.get("/updatestate", function(req,res){
    let fileName = filePath + "updatestate.html";
    res.sendFile(fileName);
});

app.post('/update', function(req, res){
    let __id = req.body.id;
    let id = new mongoose.mongo.ObjectID(__id);
    let _taskstate = req.body.taskstate;
    Task.updateOne({_id:id}, {$set:{taskstate:_taskstate}}, (err, result)=>{
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks');
        }
    });
});



app.listen(8080, ()=>{
    console.log('Server is running')
});