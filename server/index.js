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
  username: String,
  email: String,
  password: String
})
const user = mongoose.model("user", Userschema)

app.post("/login", async (req, res) => {
    const {email,password}=req.body
    try {
        const foundUser = await user.findOne({email:email});
        if(foundUser){
            if(password===foundUser.password){
                res.send({
                    message:"login successful",data:foundUser
                })
            } else {
                res.send({
                    message:"password not match"
                })
            }
        } else {
            res.send({
                message:"user not found"
            })
        }
    } catch (err) {
        res.send(err);
    }
});

app.post("/register", async (req, res) => {
    const {username,email,password}=req.body
    try {
        const existingUser = await user.findOne({email:email});
        if(existingUser){
            res.send({message:"User already registered"})
        } else {
            const newUser = new user({
                username,
                email,
                password
            })
            await newUser.save();
            res.send({message:"Successfully registered"})
        }
    } catch (err) {
        res.send(err);
    }
});

app.use(router)
server.listen(PORT,()=>console.log("server is up"))
