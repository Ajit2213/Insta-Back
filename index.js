const express=require("express");
const app=express();
const path=require("path");
const port=3000;

const multer  = require('multer')
const { v4: uuidv4 } = require('uuid');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))

app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"public/upload")));
// const upload = multer({ dest: '/upload' }) not need
app.use(express.urlencoded({extended:true}));
app.use(express.json());

var methodOverride = require('method-override');
app.use(methodOverride('_method'))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null,"./public/upload/");
    },
    filename: function (req, file, cb) {
      return cb(null,file.originalname)
    }
  });

 const upload = multer({ storage: storage })

let data=[
    {
        id:uuidv4(),
        username:"ajit",
        filename:"girl.jpg",
        caption:"I am cool"
    },
    {
        id:uuidv4(),
        username:"manish",
        filename:"phone.jpeg",
        caption:"Have You fun"
    },

]


app.listen(port,()=>{
    console.log("its listning");
})

app.get("/post",(req,res)=>{
   res.render("main.ejs",{data})
})


app.get("/post/new",(req,res)=>{
    res.render("new.ejs");
})


// app.post("/post",(req,res)=>{
//     let info=req.body;
//     let {username,images,caption}=req.body;
//     console.log(info);
//     data.push({username,images,caption});
//     res.redirect("/post")
// })



app.post("/post",upload.single('image'),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    let id=uuidv4();
    let{username,caption}=req.body;
    let {filename}=req.file;
    data.push({id,username,caption,filename});
    console.log(data);
res.redirect("/post"); 
})


//view

app.get("/post/:id",(req,res)=>{
    let {id}=req.params;
    let post=data.find((p)=>p.id==id);
    console.log(post);
    res.render("view.ejs",{post});
    // res.send("its working");
})


app.get("/post/:id/edit",(req,res)=>{
    let {id}=req.params;
    let post=data.find((p)=>p.id==id);
    res.render("edit.ejs",{post});
    
})


//updation

app.patch("/post/:id",(req,res)=>{
    let{id}=req.params;
    console.log(id);
    let newcontent=req.body.caption;
    console.log(newcontent);
    let post=data.find((p)=>p.id===id);
    post.caption=newcontent;
    res.redirect("/post")
})


//delete 
app.delete("/post/:id",(req,res)=>{
    let{id}=req.params;
     data=data.filter((p)=>p.id!==id);
   
   res.redirect("/post");
})