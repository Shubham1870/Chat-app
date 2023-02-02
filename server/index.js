const express=require("express")
const http=require("http")
const app=express()
const router=require("./router")
const {addup,deleteuser,getuser,userroom} =require("./users.js")
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
app.use(router)
server.listen(PORT,()=>console.log("server is up"))