const express=require("express")
const http=require("http")
const app=express()
const router=require("./router")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
const {addup,getuser} =require("./users.js")
const server=http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
       
    }
  });
const PORT=process.env.PORT||5000

io.on('connection',(socket)=>{
    console.log("connected")
socket.on('join',({username,room},callback)=>{
        
   const {error,user}=addup({id:socket.id,username,room})
    if(error)
       return callback(error)

        socket.emit('message',{user:'admin',text:`${user.username},Welcome Aboard ${user.room}`})

       socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.username}, has joined the chat`})
        socket.join(user.room)
    callback()
    })
socket.on('sendmessage',(message,callback)=>{
    const user=getuser(socket.id)
    io.to(user.room).emit('message',{user:user.username,text:message})
    callback()
})
socket.on('disconnect',()=>{
   console.log("user is no longer here") 
})
})

mongoose.connect("mongodb://127.0.0.1:27017/mylogin",
  { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log("database connected") }
)
const Userschema = new mongoose.Schema({
  username:{type:String},
  email: {type:String},
  password: {type:String}
})
const user = mongoose.model("user", Userschema)

app.post("/login", (req, res) => {
    const {email,password}=req.body
    user.findOne({email:email},(err,data)=>{
        if(data){
            if(password===data.password){
                res.send({
                    message:"login succesfull",data:data
                })
            }else{
                res.send({
                    message:"password not match"
                })
            }
        }else{
            res.send({
                message:"user not found"
            })
        }
        
    })
  }
)
app.post("/register", (req, res) => {
    const {username,email,password}=req.body
    user.findOne({email:email},(err,data)=>{
        if(data){
            res.send({message:"User already registered"})
        }else{
            const data=new user({
                username,
                email,
                password
            })
            data.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"Successfully registed"})
                }
            })

            
        }
    })
  }
)

app.use(router)
server.listen(PORT,()=>console.log("server is up"))
