let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let express=require("express")
let ToDoList = require("./models/ToDoList.model")
let app= express()
let bodyParser = require('body-parser')
app.use(bodyParser.raw({ type: '*/*' }))

let url = "mongodb://chris:pw1234@ds145365.mlab.com:45365/todo"
mongoose.connect(url,{ useNewUrlParser: true })


let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// app.get("/", function (req, res) {
//     res.send("hello to mongoose")
// })

app.put("/createList",function(req,res){
    let parsed = JSON.parse(req.body)

    let newList = new ToDoList()

    newList.title = parsed.title
    newList.description= parsed.description
    newList.dueDate = parsed.dueDate

    newList.save(function(err, list){
        if (err){
            res.send(JSON.stringify({error: true, message:"error saving list"}))
        } else {
            res.send(JSON.stringify(list))

        }
    })
})

app.get("/getAllLists", function(req,res){

    ToDoList.find()
    .exec(function(err,lists){
        if(err){
            res.send(JSON.stringify({error: true, message:"error getting the lists"}))
        } else {
            res.send(JSON.stringify(lists))
        }
    })
})

app.put("/addItem", function(req, res){

let parsed = JSON.parse(req.body)
let id = parsed.id
let item= parsed.item
ToDoList.findOneAndUpdate({_id: id},
    {$push:{items: item}, $set:{updatedAt: new Date()}},
    { upsert: true },
    function(err,list){
    if(err){
        res.send(JSON.stringify({error: true, message: "error finding list"}))
    } else {
        res.send(JSON.stringify({success: true, message:"item add to the list"}))
    }
})
})

app.get("/getListById/:id", function(req,res){
    ToDoList.findOne({_id: req.params.id})
    .exec(function(err, list){
        if(err){ 
            res.send(JSON.stringify({error:true, message:"error finding the list by id"}))
        } else{
            res.send(JSON.stringify(list))
        }
    })
})

app.delete("/removeItem", function(req,res){
    let parsed = JSON.parse(req.body)
    let index = parsed.index
    let id = parsed.id
    ToDoList.findOne({_id: id})
    .exec(function(err,list){
        if(err){ res.send(JSON.stringify({error: true, message:"error finding list"}))}
        else{
            list.items.splice(index,1)
            list.updatedAt = new Date()
            list.save(function(err){
                if(err){ 
                    res.send(JSON.stringify({ error: true , message:"error saving list"}))
                }
                else{
                    res.send(JSON.stringify({success: true, message:"item has been removed"}))
                    }
            })
        }
    })
})

app.post("/completedList", function(req,res){
    let parsed = JSON.parse(req.body).id

    ToDoList.findOne({_id: parsed})
    .exec(function(err,list){
        if(err){
            res.send(JSON.stringify({error: true, message:"error finding list"}))
        }
        else{
            let comp = function(str){
                if(str !=="completed"){
                    str="completed"
                }else {
                    str ="active"
                }
                return str
            }
            list.status = comp(list.status)
            list.completedAt= new Date ()
            list.save(function(err){
                if(err){
                    res.send(JSON.stringify({error: true, message:"error saving status"}))
                } else{
                    res.send(JSON.stringify({success: true, message: "status updated successfully"}))
                }
            })
        }
    })
})


app.delete("/removeAllItems", function(req,res){
    let parsed = JSON.parse(req.body)
    let id = parsed.id
    ToDoList.findOne({_id: id})
    .exec(function(err,list){
        if(err){
            res.send(JSON.stringify({error: true, message: "error finding the list"}))
        } else {
            list.items.splice(0,list.items.length)
            list.save(function(err){
                if (err){
                    res.send(JSON.stringify({error: true, message:"error saving list"}))
                } else {
                    res.send(JSON.stringify({success: true, message: "items successfully removed"}))
                }
            })
        }
    })
})

app.delete("/removeList", function(req,res){
    let parsed = JSON.parse(req.body)
    let id = parsed.id
    ToDoList.findByIdAndDelete({_id: id}, function(err){
        if(err){
            res.send(JSON.stringify({error: true, message: "error delete the list"}))
        } else {
            res.send(JSON.stringify({success: true , message: "the list successfully removed"}))
        }
    })
})

app.put("/editItem", function(req,res){
    let parsed = JSON.parse(req.body)
    let id = parsed.id
    let index= parsed.index
    let newInput = parsed.newInput
    ToDoList.findOne({_id:id})
    .exec(function(err,list){
        if (err){ 
            res.send(JSON.stringify({error: true, message: "error finding list"}))
        } else{

             list.items.splice(index,1, newInput)
            

             list.save(function(err){
                 if(err){ 
                     res.send(JSON.stringify({error: true, message:"error saving list"}))
                 } else {
                     res.send(list)
                 }
             })
        }
    })
})

app.listen(4000, ()=>{
    console.log("running on 4000")
})