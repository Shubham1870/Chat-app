const express=require("express")
const http=require("http")
const app=express()
const router=require("./router")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.json()) 
const users=[]
mongoose.connect("mongodb+srv://root:aashiana@4516@cluster0.sdwf5gn.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log("database connected") }
)
const Userschema = new mongoose.Schema({
  username:{type:String},
  email: {type:String},
  password: {type:String}
})

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


const user = mongoose.model("user", Userschema)

app.post('/signup', async (req, res) => {
    try {
      const { email, password, username } = req.body;
      
      
      const emailExists = users.some((user) => user.email === email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
  
     
      const user = { email, password: hashedPassword, username };
      users.push(user);
  
      res.status(201).json({ message: 'Sign up successful' });
    } catch (error) {
      res.status(500).json({ message: 'Sign up failed' });
    }
  });
  
  app.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Look up the user in the database
      const user = users.find((user) => user.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Email or password is incorrect' });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Email or password is incorrect' });
      }
  
      res.json({ message: 'Sign in successful' });
    } catch (error) {
      res.status(500).json({ message: 'Sign in failed' });
    }
  });
  
app.use(router)
server.listen(PORT,()=>console.log("server is up"))